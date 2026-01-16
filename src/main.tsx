import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { Toaster } from './components/ui/sonner.tsx'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

const isResizeObserverError = (message: string | undefined): boolean => {
  if (!message) return false
  return (
    message.includes('ResizeObserver loop') ||
    (message.includes('ResizeObserver') && message.includes('notifications'))
  )
}

const originalError = console.error
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    isResizeObserverError(args[0])
  ) {
    return
  }
  originalError.call(console, ...args)
}

const originalWarn = console.warn
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    isResizeObserverError(args[0])
  ) {
    return
  }
  originalWarn.call(console, ...args)
}

window.addEventListener('error', (e) => {
  if (isResizeObserverError(e.message)) {
    e.stopImmediatePropagation()
    e.preventDefault()
    return false
  }
}, true)

window.addEventListener('unhandledrejection', (e) => {
  if (e.reason && e.reason.message && isResizeObserverError(e.reason.message)) {
    e.preventDefault()
    return false
  }
})

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
    <Toaster />
   </ErrorBoundary>
)
