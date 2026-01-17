/**
 * Spark Runtime - Core runtime services for Spark applications
 * 
 * This module provides mock implementations of Spark services including:
 * - KV storage (key-value store)
 * - LLM service (language model integration)
 * - User authentication
 */

// Mock KV Storage
const kvStorage = new Map<string, any>()

export const sparkRuntime = {
  kv: {
    get: (key: string) => {
      try {
        const value = kvStorage.get(key)
        return value !== undefined ? value : localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : undefined
      } catch (error) {
        console.error('Error getting KV value:', error)
        return undefined
      }
    },
    set: (key: string, value: any) => {
      try {
        kvStorage.set(key, value)
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error('Error setting KV value:', error)
      }
    },
    delete: (key: string) => {
      try {
        kvStorage.delete(key)
        localStorage.removeItem(key)
      } catch (error) {
        console.error('Error deleting KV value:', error)
      }
    },
    clear: () => {
      try {
        kvStorage.clear()
      } catch (error) {
        console.error('Error clearing KV storage:', error)
      }
    },
    keys: () => Array.from(kvStorage.keys())
  },
  
  llm: {
    chat: async (messages: any[]) => {
      console.log('Mock LLM chat called with messages:', messages)
      return {
        role: 'assistant',
        content: 'This is a mock response from the Spark LLM service.'
      }
    },
    complete: async (prompt: string) => {
      console.log('Mock LLM complete called with prompt:', prompt)
      return 'This is a mock completion from the Spark LLM service.'
    }
  },
  
  user: {
    getCurrentUser: () => ({
      id: 'mock-user-id',
      name: 'Mock User',
      email: 'mock@example.com'
    }),
    isAuthenticated: () => true
  }
}
