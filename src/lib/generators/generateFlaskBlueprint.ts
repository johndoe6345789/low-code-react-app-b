import { FlaskBlueprint } from '@/types/project'

export function generateFlaskBlueprint(blueprint: FlaskBlueprint): string {
  let code = `from flask import Blueprint, request, jsonify\n`
  code += `from typing import Dict, Any\n\n`

  const sanitizeName = (value: string): string => {
    const normalized = value
      .toLowerCase()
      .replace(/[^a-z0-9_]+/gi, '_')
      .replace(/_+/g, '_')
    const safe = normalized.length > 0 ? normalized : '_'
    return /^[a-z_]/i.test(safe) ? safe : `_${safe}`
  }

  const blueprintVarName = sanitizeName(blueprint.name)
  code += `${blueprintVarName}_bp = Blueprint('${blueprintVarName}', __name__, url_prefix='${blueprint.urlPrefix}')\n\n`

  blueprint.endpoints.forEach(endpoint => {
    const functionName = sanitizeName(endpoint.name)
    code += `@${blueprintVarName}_bp.route('${endpoint.path}', methods=['${endpoint.method}'])\n`
    code += `def ${functionName}():\n`
    code += `    """\n`
    code += `    ${endpoint.description || endpoint.name}\n`

    if (endpoint.queryParams && endpoint.queryParams.length > 0) {
      code += `    \n    Query Parameters:\n`
      endpoint.queryParams.forEach(param => {
        code += `    - ${param.name} (${param.type})${param.required ? ' [required]' : ''}: ${param.description || ''}\n`
      })
    }

    code += `    """\n`

    if (endpoint.authentication) {
      code += `    # TODO: Add authentication check\n`
      code += `    # if not is_authenticated(request):\n`
      code += `    #     return jsonify({'error': 'Unauthorized'}), 401\n\n`
    }

    if (endpoint.queryParams && endpoint.queryParams.length > 0) {
      endpoint.queryParams.forEach(param => {
        if (param.required) {
          code += `    ${param.name} = request.args.get('${param.name}')\n`
          code += `    if ${param.name} is None:\n`
          code += `        return jsonify({'error': '${param.name} is required'}), 400\n\n`
        } else {
          const defaultVal = param.defaultValue || (param.type === 'string' ? "''" : param.type === 'number' ? '0' : 'None')
          code += `    ${param.name} = request.args.get('${param.name}', ${defaultVal})\n`
        }
      })
      code += `\n`
    }

    if (endpoint.method === 'POST' || endpoint.method === 'PUT' || endpoint.method === 'PATCH') {
      code += `    data = request.get_json()\n`
      code += `    if not data:\n`
      code += `        return jsonify({'error': 'No data provided'}), 400\n\n`
    }

    code += `    # TODO: Implement ${endpoint.name} logic\n`
    code += `    result = {\n`
    code += `        'message': '${endpoint.name} endpoint',\n`
    code += `        'method': '${endpoint.method}',\n`
    code += `        'path': '${endpoint.path}'\n`
    code += `    }\n\n`
    code += `    return jsonify(result), 200\n\n\n`
  })

  return code
}
