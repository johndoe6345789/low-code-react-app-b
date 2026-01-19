#!/usr/bin/env node
const { spawn } = require('node:child_process')
const fs = require('node:fs')

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`)
}

function respond(id, result) {
  send({ jsonrpc: '2.0', id, result })
}

function respondError(id, code, message) {
  send({ jsonrpc: '2.0', id, error: { code, message } })
}

function toolList() {
  return [
    {
      name: 'codeql_analyze',
      description: 'Run CodeQL database analyze with a query pack.',
      inputSchema: {
        type: 'object',
        properties: {
          dbPath: { type: 'string' },
          queryPack: { type: 'string' },
          output: { type: 'string' },
          format: { type: 'string', default: 'sarifv2.1.0' },
          rerun: { type: 'boolean', default: false },
          extraArgs: { type: 'array', items: { type: 'string' } },
        },
        required: ['dbPath', 'queryPack'],
      },
    },
    {
      name: 'codeql_database_create',
      description: 'Create a CodeQL database.',
      inputSchema: {
        type: 'object',
        properties: {
          dbPath: { type: 'string' },
          language: { type: 'string', default: 'javascript' },
          sourceRoot: { type: 'string', default: '.' },
          buildMode: { type: 'string', default: 'none' },
          extraArgs: { type: 'array', items: { type: 'string' } },
        },
        required: ['dbPath'],
      },
    },
    {
      name: 'codeql_pack_install',
      description: 'Install dependencies for a local CodeQL pack.',
      inputSchema: {
        type: 'object',
        properties: {
          packDir: { type: 'string' },
          extraArgs: { type: 'array', items: { type: 'string' } },
        },
        required: ['packDir'],
      },
    },
    {
      name: 'codeql_pack_download',
      description: 'Download a CodeQL pack by name.',
      inputSchema: {
        type: 'object',
        properties: {
          pack: { type: 'string' },
          extraArgs: { type: 'array', items: { type: 'string' } },
        },
        required: ['pack'],
      },
    },
    {
      name: 'codeql_resolve_packs',
      description: 'List available CodeQL packs.',
      inputSchema: {
        type: 'object',
        properties: {
          extraArgs: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    {
      name: 'codeql_resolve_languages',
      description: 'List available CodeQL languages.',
      inputSchema: {
        type: 'object',
        properties: {
          extraArgs: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    {
      name: 'codeql_sarif_summary',
      description: 'Summarize a SARIF file by rule and total count.',
      inputSchema: {
        type: 'object',
        properties: {
          sarifPath: { type: 'string' },
          maxPerRule: { type: 'number', default: 5 },
        },
        required: ['sarifPath'],
      },
    },
  ]
}

function runCodeql(args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn('codeql', args, { stdio: ['ignore', 'pipe', 'pipe'], ...options })
    let stdout = ''
    let stderr = ''

    proc.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
    })
    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
    })

    proc.on('error', (err) => reject(err))
    proc.on('close', (code) => {
      resolve({ code, stdout, stderr, args })
    })
  })
}

function runCodeqlAnalyze(input) {
  const {
    dbPath,
    queryPack,
    output,
    format = 'sarifv2.1.0',
    rerun = false,
    extraArgs = [],
  } = input || {}

  if (!dbPath || !queryPack) {
    return Promise.reject(new Error('dbPath and queryPack are required'))
  }

  const args = ['database', 'analyze', dbPath, queryPack, `--format=${format}`]
  if (output) args.push(`--output=${output}`)
  if (rerun) args.push('--rerun')
  if (Array.isArray(extraArgs)) args.push(...extraArgs)

  return runCodeql(args)
}

function runCodeqlDatabaseCreate(input) {
  const {
    dbPath,
    language = 'javascript',
    sourceRoot = '.',
    buildMode = 'none',
    extraArgs = [],
  } = input || {}

  if (!dbPath) {
    return Promise.reject(new Error('dbPath is required'))
  }

  const args = [
    'database',
    'create',
    dbPath,
    `--language=${language}`,
    `--source-root=${sourceRoot}`,
    `--build-mode`,
    buildMode,
  ]
  if (Array.isArray(extraArgs)) args.push(...extraArgs)
  return runCodeql(args)
}

function runCodeqlPackInstall(input) {
  const { packDir, extraArgs = [] } = input || {}
  if (!packDir) return Promise.reject(new Error('packDir is required'))
  const args = ['pack', 'install']
  if (Array.isArray(extraArgs)) args.push(...extraArgs)
  return runCodeql(args, { cwd: packDir })
}

function runCodeqlPackDownload(input) {
  const { pack, extraArgs = [] } = input || {}
  if (!pack) return Promise.reject(new Error('pack is required'))
  const args = ['pack', 'download', pack]
  if (Array.isArray(extraArgs)) args.push(...extraArgs)
  return runCodeql(args)
}

function runCodeqlResolvePacks(input) {
  const { extraArgs = [] } = input || {}
  const args = ['resolve', 'packs']
  if (Array.isArray(extraArgs)) args.push(...extraArgs)
  return runCodeql(args)
}

function runCodeqlResolveLanguages(input) {
  const { extraArgs = [] } = input || {}
  const args = ['resolve', 'languages']
  if (Array.isArray(extraArgs)) args.push(...extraArgs)
  return runCodeql(args)
}

function summarizeSarif(input) {
  const { sarifPath, maxPerRule = 5 } = input || {}
  if (!sarifPath) return Promise.reject(new Error('sarifPath is required'))

  const raw = fs.readFileSync(sarifPath, 'utf8')
  const sarif = JSON.parse(raw)
  const run = sarif.runs?.[0]
  const results = run?.results || []

  const byRule = new Map()
  for (const r of results) {
    const rule = r.ruleId || 'unknown'
    if (!byRule.has(rule)) byRule.set(rule, [])
    byRule.get(rule).push(r)
  }

  const summary = []
  for (const [rule, items] of byRule) {
    const sample = items.slice(0, maxPerRule).map((r) => {
      const loc = r.locations?.[0]?.physicalLocation
      return {
        file: loc?.artifactLocation?.uri || 'unknown',
        line: loc?.region?.startLine || 0,
        message: r.message?.text || '',
      }
    })
    summary.push({ ruleId: rule, count: items.length, sample })
  }

  summary.sort((a, b) => b.count - a.count)
  return Promise.resolve({
    total: results.length,
    rules: summary,
  })
}

async function handleRequest(message) {
  const { id, method, params } = message

  if (method === 'initialize') {
    return respond(id, {
      capabilities: { tools: { list: true, call: true } },
      serverInfo: { name: 'codeql-mcp', version: '0.1.0' },
    })
  }

  if (method === 'tools/list') {
    return respond(id, { tools: toolList() })
  }

  if (method === 'tools/call') {
    const { name, arguments: args } = params || {}
    try {
      let result
      if (name === 'codeql_analyze') {
        result = await runCodeqlAnalyze(args)
      } else if (name === 'codeql_database_create') {
        result = await runCodeqlDatabaseCreate(args)
      } else if (name === 'codeql_pack_install') {
        result = await runCodeqlPackInstall(args)
      } else if (name === 'codeql_pack_download') {
        result = await runCodeqlPackDownload(args)
      } else if (name === 'codeql_resolve_packs') {
        result = await runCodeqlResolvePacks(args)
      } else if (name === 'codeql_resolve_languages') {
        result = await runCodeqlResolveLanguages(args)
      } else if (name === 'codeql_sarif_summary') {
        result = await summarizeSarif(args)
      } else {
        return respondError(id, -32601, `Unknown tool: ${name}`)
      }
      return respond(id, {
        content: [
          {
            type: 'text',
            text: result.code !== undefined
              ? `exit: ${result.code}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
              : JSON.stringify(result, null, 2),
          },
        ],
      })
    } catch (err) {
      return respondError(id, -32603, err.message)
    }
  }

  return respondError(id, -32601, `Unknown method: ${method}`)
}

let buffer = ''
process.stdin.setEncoding('utf8')
process.stdin.on('data', (chunk) => {
  buffer += chunk
  let idx
  while ((idx = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, idx).trim()
    buffer = buffer.slice(idx + 1)
    if (!line) continue
    try {
      const message = JSON.parse(line)
      handleRequest(message)
    } catch (err) {
      respondError(null, -32700, 'Invalid JSON')
    }
  }
})
