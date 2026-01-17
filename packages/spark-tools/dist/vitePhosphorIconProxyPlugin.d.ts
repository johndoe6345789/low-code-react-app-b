/**
 * Vite Phosphor Icon Proxy Plugin
 *
 * This plugin provides a proxy for Phosphor icon imports to improve
 * build performance and bundle size.
 */
export default function createIconImportProxy(): {
    name: string;
    resolveId(id: string): null | undefined;
    transform(code: string, id: string): null;
};
//# sourceMappingURL=vitePhosphorIconProxyPlugin.d.ts.map