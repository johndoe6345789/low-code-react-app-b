/**
 * TypeScript Type Definitions for Spark
 * 
 * Global type declarations for window.spark and Spark APIs
 */

declare global {
  interface Window {
    spark: {
      kv: {
        get: (key: string) => any
        set: (key: string, value: any) => void
        delete: (key: string) => void
        clear: () => void
        keys: () => string[]
      }
      llm: {
        chat: (messages: any[]) => Promise<{ role: string; content: string }>
        complete: (prompt: string) => Promise<string>
      }
      user: {
        getCurrentUser: () => { id: string; name: string; email: string }
        isAuthenticated: () => boolean
      }
    }
  }
}

export {}
