/**
 * Spark Vite Plugin
 *
 * This plugin integrates Spark functionality into the Vite build process.
 * It handles initialization and configuration of Spark features.
 */
export default function sparkPlugin(): {
    name: string;
    configResolved(config: any): void;
    transformIndexHtml(html: string): string;
};
//# sourceMappingURL=sparkVitePlugin.d.ts.map