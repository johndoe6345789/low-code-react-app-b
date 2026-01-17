/**
 * useKV Hook - Persistent key-value storage with localStorage and window.spark.kv integration
 *
 * This hook provides persistent state management that syncs with localStorage
 * and integrates with the Spark KV storage system if available.
 *
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Tuple of [value, setValue, deleteValue]
 */
export declare function useKV<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void];
//# sourceMappingURL=index.d.ts.map