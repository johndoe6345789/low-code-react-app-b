/**
 * Spark Runtime - Core runtime services for Spark applications
 * 
 * This module provides implementations of Spark services including:
 * - KV storage (key-value store using IndexedDB)
 * - LLM service (language model integration)
 * - User authentication
 */

import { getStorage } from './storage-service'

const llmFunction = async (prompt: string, model?: string, jsonMode?: boolean): Promise<any> => {
  console.log('Mock LLM called with prompt:', prompt, 'model:', model, 'jsonMode:', jsonMode)
  return 'This is a mock response from the Spark LLM service.'
}

llmFunction.chat = async (messages: any[]) => {
  console.log('Mock LLM chat called with messages:', messages)
  return {
    role: 'assistant',
    content: 'This is a mock response from the Spark LLM service.'
  }
}

llmFunction.complete = async (prompt: string) => {
  console.log('Mock LLM complete called with prompt:', prompt)
  return 'This is a mock completion from the Spark LLM service.'
}

export const sparkRuntime = {
  kv: {
    get: async <T = any>(key: string): Promise<T | undefined> => {
      const storage = getStorage()
      return storage.get<T>(key)
    },
    set: async (key: string, value: any): Promise<void> => {
      const storage = getStorage()
      return storage.set(key, value)
    },
    delete: async (key: string): Promise<void> => {
      const storage = getStorage()
      return storage.delete(key)
    },
    keys: async (): Promise<string[]> => {
      const storage = getStorage()
      return storage.keys()
    },
    clear: async (): Promise<void> => {
      const storage = getStorage()
      return storage.clear()
    }
  },
  
  llm: llmFunction,
  
  user: {
    getCurrentUser: () => ({
      id: 'mock-user-id',
      name: 'Mock User',
      email: 'mock@example.com'
    }),
    isAuthenticated: () => true
  }
}

if (typeof window !== 'undefined') {
  (window as any).spark = sparkRuntime
}
