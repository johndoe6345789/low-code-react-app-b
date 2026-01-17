/**
 * Spark Vite Plugin
 *
 * This plugin integrates Spark functionality into the Vite build process.
 * Currently provides a minimal implementation that can be extended with:
 * - Spark runtime injection
 * - Configuration validation
 * - Development server enhancements
 */
export default function sparkPlugin(): {
    name: string;
    configResolved(config: any): void;
    transformIndexHtml(html: string): string;
};
//# sourceMappingURL=sparkVitePlugin.d.ts.map