/**
 * Spark Runtime - Core runtime services for Spark applications
 *
 * This module provides mock implementations of Spark services including:
 * - KV storage (key-value store)
 * - LLM service (language model integration)
 * - User authentication
 */
interface LLMChatResponse {
    role: string;
    content: string;
}
export declare const sparkRuntime: {
    kv: {
        get: <T = any>(key: string) => T | undefined;
        set: (key: string, value: any) => void;
        delete: (key: string) => void;
        clear: () => void;
        keys: () => string[];
    };
    llm: {
        (prompt: string, model?: string, jsonMode?: boolean): Promise<string>;
        chat(messages: any[]): Promise<LLMChatResponse>;
        complete(prompt: string): Promise<string>;
    };
    user: {
        getCurrentUser: () => {
            id: string;
            name: string;
            email: string;
        };
        isAuthenticated: () => boolean;
    };
};
export {};
//# sourceMappingURL=spark-runtime.d.ts.map