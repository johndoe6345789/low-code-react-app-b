/**
 * Spark Initialization Module
 *
 * This module initializes the Spark runtime and makes it available globally
 * via window.spark. It should be imported early in the application lifecycle.
 */
import { sparkRuntime } from './spark-runtime';
declare global {
    interface Window {
        spark: typeof sparkRuntime;
    }
}
export default sparkRuntime;
//# sourceMappingURL=spark.d.ts.map