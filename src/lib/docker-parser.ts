import { DockerError, KnowledgeBaseItem, Solution } from '@/types/docker'

export function parseDockerLog(log: string): DockerError[] {
  const errors: DockerError[] = []
  const lines = log.split('\n')
  
  let currentError: Partial<DockerError> | null = null
  let contextLines: string[] = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    if (line.includes('ERROR:') || line.includes('Error:')) {
      if (currentError) {
        errors.push({
          id: Math.random().toString(36).substr(2, 9),
          type: currentError.type || 'Unknown Error',
          message: currentError.message || 'An error occurred',
          stage: currentError.stage,
          exitCode: currentError.exitCode,
          context: contextLines.slice(-5),
          severity: 'critical'
        })
      }
      
      currentError = {
        message: line.replace(/^.*?ERROR:\s*/, '').replace(/^.*?Error:\s*/, '').trim()
      }
      contextLines = [line]
      
      const stageMatch = log.match(/\[([^\]]+)\s+\d+\/\d+\]/)
      if (stageMatch) {
        currentError.stage = stageMatch[1]
      }
      
      const exitCodeMatch = line.match(/exit code[:\s]+(\d+)/i)
      if (exitCodeMatch) {
        currentError.exitCode = parseInt(exitCodeMatch[1], 10)
      }
      
      currentError.type = detectErrorType(line, log)
    } else if (currentError) {
      contextLines.push(line)
    }
  }
  
  if (currentError) {
    errors.push({
      id: Math.random().toString(36).substr(2, 9),
      type: currentError.type || 'Unknown Error',
      message: currentError.message || 'An error occurred',
      stage: currentError.stage,
      exitCode: currentError.exitCode,
      context: contextLines.slice(-5),
      severity: 'critical'
    })
  }
  
  return errors
}

function detectErrorType(errorLine: string, fullLog: string): string {
  const lowerError = errorLine.toLowerCase()
  const lowerLog = fullLog.toLowerCase()
  
  if (lowerError.includes('cannot find module') || lowerError.includes('module_not_found')) {
    return 'Missing Dependency'
  }
  
  if (lowerError.includes('enoent') || lowerError.includes('no such file')) {
    return 'File Not Found'
  }
  
  if (lowerLog.includes('arm64') || lowerLog.includes('amd64') || lowerError.includes('platform')) {
    return 'Platform/Architecture Issue'
  }
  
  if (lowerError.includes('permission denied') || lowerError.includes('eacces')) {
    return 'Permission Error'
  }
  
  if (lowerError.includes('network') || lowerError.includes('timeout') || lowerError.includes('connection')) {
    return 'Network Error'
  }
  
  if (lowerError.includes('syntax') || lowerError.includes('unexpected')) {
    return 'Syntax Error'
  }
  
  if (lowerError.includes('memory') || lowerError.includes('out of')) {
    return 'Resource Limit'
  }
  
  return 'Build Failure'
}

export function getSolutionsForError(error: DockerError): Solution[] {
  const solutions: Solution[] = []
  
  const type = error.type.toLowerCase()
  
  if (type.includes('missing dependency') || type.includes('module')) {
    if (error.message.includes('@rollup/rollup') || error.message.includes('rollup')) {
      solutions.push({
        title: 'Install Platform-Specific Rollup Dependencies',
        description: 'The Rollup bundler requires platform-specific native binaries. For multi-platform Docker builds, you need to ensure optional dependencies are installed.',
        steps: [
          'Update your Dockerfile to force install optional dependencies',
          'Use --platform flag to ensure correct architecture binaries',
          'Consider using --legacy-peer-deps flag'
        ],
        code: `# In your Dockerfile, change the npm install line to:
RUN npm install --legacy-peer-deps --include=optional

# Or explicitly install the missing package:
RUN npm install @rollup/rollup-linux-arm64-musl --save-optional`,
        codeLanguage: 'dockerfile'
      })
      
      solutions.push({
        title: 'Update package.json optionalDependencies',
        description: 'Explicitly declare platform-specific Rollup dependencies as optional.',
        steps: [
          'Add optionalDependencies section to package.json',
          'Include all platform variants of Rollup',
          'Rebuild your Docker image'
        ],
        code: `{
  "optionalDependencies": {
    "@rollup/rollup-linux-arm64-musl": "^4.53.3",
    "@rollup/rollup-linux-x64-musl": "^4.53.3",
    "@rollup/rollup-darwin-arm64": "^4.53.3",
    "@rollup/rollup-darwin-x64": "^4.53.3"
  }
}`,
        codeLanguage: 'json'
      })
    } else {
      solutions.push({
        title: 'Install Missing Node Module',
        description: 'A required npm package is not installed in your Docker image.',
        steps: [
          'Verify the package is listed in package.json',
          'Ensure npm install runs before the build step',
          'Check for typos in import statements'
        ],
        code: `# Make sure your Dockerfile includes:
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build`,
        codeLanguage: 'dockerfile'
      })
    }
  }
  
  if (type.includes('platform') || type.includes('architecture')) {
    solutions.push({
      title: 'Build for Single Platform',
      description: 'If you don\'t need multi-platform support, build for a single architecture to avoid complexity.',
      steps: [
        'Remove --platform flag from docker build command',
        'Or specify only one platform: --platform linux/amd64',
        'This will speed up builds and avoid architecture-specific issues'
      ],
      code: `# Instead of:
docker buildx build --platform linux/amd64,linux/arm64 .

# Use:
docker buildx build --platform linux/amd64 .`,
      codeLanguage: 'bash'
    })
    
    solutions.push({
      title: 'Use QEMU for Cross-Platform Builds',
      description: 'Set up proper emulation for building ARM images on x64 hosts.',
      steps: [
        'Install QEMU binfmt support',
        'Create a new buildx builder instance',
        'Verify the builder supports multiple platforms'
      ],
      code: `# Set up buildx with QEMU
docker run --privileged --rm tonistiigi/binfmt --install all
docker buildx create --name multiplatform --driver docker-container --use
docker buildx inspect --bootstrap`,
      codeLanguage: 'bash'
    })
  }
  
  if (type.includes('file not found')) {
    solutions.push({
      title: 'Check File Paths and .dockerignore',
      description: 'Verify that all required files are copied into the Docker build context.',
      steps: [
        'Check .dockerignore to ensure needed files aren\'t excluded',
        'Verify COPY commands use correct paths',
        'Ensure files exist in your repository'
      ],
      code: `# In .dockerignore, make sure you're not ignoring needed files
# Remove these if they're blocking required files:
# node_modules
# dist
# build`,
      codeLanguage: 'text'
    })
  }
  
  if (type.includes('permission')) {
    solutions.push({
      title: 'Fix File Permissions',
      description: 'The Docker build process doesn\'t have permission to access required files.',
      steps: [
        'Check file permissions in your repository',
        'Add RUN chmod commands if needed',
        'Consider using a non-root user correctly'
      ],
      code: `# In Dockerfile, add permission fixes:
RUN chmod +x /app/scripts/*.sh
RUN chown -R node:node /app`,
      codeLanguage: 'dockerfile'
    })
  }
  
  if (solutions.length === 0) {
    solutions.push({
      title: 'General Docker Build Troubleshooting',
      description: 'Try these common fixes for Docker build issues.',
      steps: [
        'Clear Docker build cache: docker builder prune',
        'Rebuild without cache: docker build --no-cache',
        'Check Docker daemon logs for more details',
        'Verify your Dockerfile syntax is correct',
        'Ensure base images are accessible and up to date'
      ]
    })
  }
  
  return solutions
}

export const knowledgeBase: KnowledgeBaseItem[] = [
  {
    id: 'rollup-missing',
    category: 'Dependencies',
    title: 'Rollup Platform-Specific Binary Missing',
    pattern: 'Cannot find module @rollup/rollup-*',
    explanation: 'Rollup uses platform-specific native binaries that are installed as optional dependencies. In Docker multi-platform builds, npm may not install the correct optional dependencies for all target platforms.',
    solutions: [
      {
        title: 'Install Optional Dependencies Explicitly',
        description: 'Force npm to install all optional dependencies during the Docker build.',
        steps: [
          'Modify the RUN npm install command in your Dockerfile',
          'Add the --include=optional flag',
          'Rebuild your Docker image'
        ],
        code: 'RUN npm install --legacy-peer-deps --include=optional',
        codeLanguage: 'dockerfile'
      }
    ]
  },
  {
    id: 'multi-platform',
    category: 'Architecture',
    title: 'Multi-Platform Build Issues',
    pattern: '--platform linux/amd64,linux/arm64',
    explanation: 'Building Docker images for multiple CPU architectures (amd64 and arm64) requires proper setup of buildx and may encounter platform-specific dependency issues.',
    solutions: [
      {
        title: 'Build for Single Platform Only',
        description: 'Simplify by targeting only one architecture.',
        steps: [
          'Choose the primary platform (usually linux/amd64)',
          'Remove multi-platform flags from build command',
          'Update deployment configuration'
        ],
        code: 'docker build --platform linux/amd64 -t myimage:latest .',
        codeLanguage: 'bash'
      }
    ]
  },
  {
    id: 'node-modules',
    category: 'Dependencies',
    title: 'Node Modules Not Found',
    pattern: 'MODULE_NOT_FOUND',
    explanation: 'A required npm package is missing from node_modules, either because npm install failed, the package isn\'t in package.json, or Docker layer caching is stale.',
    solutions: [
      {
        title: 'Verify Dockerfile Order',
        description: 'Ensure proper layer ordering in your Dockerfile.',
        steps: [
          'Copy package.json and package-lock.json first',
          'Run npm install',
          'Then copy the rest of the source code',
          'Finally run the build'
        ],
        code: `COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build`,
        codeLanguage: 'dockerfile'
      }
    ]
  },
  {
    id: 'build-exit-1',
    category: 'Build Process',
    title: 'Build Process Exit Code 1',
    pattern: 'exit code: 1',
    explanation: 'The build command failed with a generic error code. This usually indicates a compilation error, missing dependency, or configuration issue.',
    solutions: [
      {
        title: 'Check Build Logs for Specific Error',
        description: 'Look earlier in the build output for the actual error message.',
        steps: [
          'Scroll up to find the first ERROR or Error message',
          'Look for stack traces or line numbers',
          'Test the build locally with the same commands',
          'Check for environment-specific issues'
        ]
      }
    ]
  },
  {
    id: 'network-timeout',
    category: 'Network',
    title: 'Network Timeout During Build',
    pattern: 'timeout|ETIMEDOUT|ECONNREFUSED',
    explanation: 'Docker build couldn\'t connect to external services like npm registry, causing the build to fail.',
    solutions: [
      {
        title: 'Configure Network Settings',
        description: 'Adjust Docker network configuration and retry logic.',
        steps: [
          'Check Docker daemon network settings',
          'Configure npm registry timeout',
          'Consider using a mirror or proxy',
          'Retry the build'
        ],
        code: `# In Dockerfile, before npm install:
RUN npm config set fetch-timeout 60000
RUN npm config set fetch-retries 5`,
        codeLanguage: 'dockerfile'
      }
    ]
  },
  {
    id: 'memory-limit',
    category: 'Resources',
    title: 'Out of Memory During Build',
    pattern: 'JavaScript heap out of memory|ENOMEM',
    explanation: 'The Node.js build process exceeded available memory limits, common with large applications or many dependencies.',
    solutions: [
      {
        title: 'Increase Node Memory Limit',
        description: 'Allocate more memory to the Node.js process during build.',
        steps: [
          'Set NODE_OPTIONS environment variable',
          'Increase max-old-space-size value',
          'Rebuild Docker image'
        ],
        code: `# In Dockerfile, before build command:
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build`,
        codeLanguage: 'dockerfile'
      }
    ]
  },
  {
    id: 'cache-corruption',
    category: 'Cache',
    title: 'Docker Layer Cache Issues',
    pattern: 'Cached layer|using cache',
    explanation: 'Docker\'s layer caching can sometimes use stale or corrupted cached layers, leading to inconsistent builds.',
    solutions: [
      {
        title: 'Clear Build Cache',
        description: 'Force a clean build without using cached layers.',
        steps: [
          'Run docker builder prune to clear cache',
          'Build with --no-cache flag',
          'Verify the clean build succeeds'
        ],
        code: `docker builder prune -af
docker build --no-cache -t myimage:latest .`,
        codeLanguage: 'bash'
      }
    ]
  },
  {
    id: 'base-image-issue',
    category: 'Images',
    title: 'Base Image Not Found or Incompatible',
    pattern: 'pull access denied|manifest unknown|not found',
    explanation: 'The base image specified in FROM instruction is unavailable, misspelled, or incompatible with the target platform.',
    solutions: [
      {
        title: 'Verify Base Image',
        description: 'Check that the base image exists and is accessible.',
        steps: [
          'Verify image name and tag on Docker Hub',
          'Check if the image supports your target platform',
          'Try pulling the image manually first',
          'Consider using a different tag or base image'
        ],
        code: `# Test pulling the image first:
docker pull node:20-alpine

# Verify platform support:
docker manifest inspect node:20-alpine`,
        codeLanguage: 'bash'
      }
    ]
  },
  {
    id: 'dockerfile-syntax',
    category: 'Configuration',
    title: 'Dockerfile Syntax Error',
    pattern: 'unknown instruction|unexpected token',
    explanation: 'The Dockerfile contains syntax errors or uses unsupported instructions.',
    solutions: [
      {
        title: 'Validate Dockerfile Syntax',
        description: 'Check your Dockerfile for common syntax issues.',
        steps: [
          'Ensure all instructions are uppercase (FROM, RUN, COPY)',
          'Check for typos in instruction names',
          'Verify line continuations with backslash',
          'Use hadolint to lint your Dockerfile'
        ],
        code: `# Install and run hadolint:
docker run --rm -i hadolint/hadolint < Dockerfile`,
        codeLanguage: 'bash'
      }
    ]
  },
  {
    id: 'copy-failed',
    category: 'Files',
    title: 'COPY Instruction Failed',
    pattern: 'COPY failed|no such file or directory',
    explanation: 'Docker couldn\'t find the files or directories specified in a COPY instruction, or they\'re excluded by .dockerignore.',
    solutions: [
      {
        title: 'Check File Paths and Context',
        description: 'Verify files exist and are included in build context.',
        steps: [
          'Confirm files exist in your repository',
          'Check .dockerignore isn\'t excluding them',
          'Ensure COPY paths are relative to build context',
          'List build context: docker build -t test --progress=plain .'
        ],
        code: `# In .dockerignore, check for overly broad patterns:
# These might exclude too much:
# *
# node_modules/*
# src/*`,
        codeLanguage: 'text'
      }
    ]
  }
]
