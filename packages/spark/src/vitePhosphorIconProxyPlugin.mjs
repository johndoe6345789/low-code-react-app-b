/**
 * Vite Phosphor Icon Proxy Plugin
 * 
 * This plugin provides a proxy for Phosphor icon imports to improve
 * build performance and bundle size.
 */

export default function createIconImportProxy() {
  return {
    name: 'vite-phosphor-icon-proxy',
    
    resolveId(id) {
      // Handle icon imports
      if (id.includes('@phosphor-icons/react')) {
        return null // Let Vite handle it normally
      }
    },
    
    transform(code, id) {
      // Transform icon imports if needed
      return null
    }
  }
}
