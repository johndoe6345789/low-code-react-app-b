/**
 * Vite Phosphor Icon Proxy Plugin
 *
 * This plugin provides a proxy for Phosphor icon imports.
 * Currently provides a pass-through implementation that allows
 * Vite to handle icon imports normally. Can be extended to:
 * - Optimize icon bundle sizes
 * - Implement lazy loading for icons
 * - Transform icon imports for better tree-shaking
 */
export default function createIconImportProxy(): {
    name: string;
    resolveId(id: string): null | undefined;
    transform(code: string, id: string): null;
};
//# sourceMappingURL=vitePhosphorIconProxyPlugin.d.ts.map