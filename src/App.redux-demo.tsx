import { Provider } from 'react-redux'
import { store } from '@/store'
import { ReduxIntegrationDemo } from '@/components/ReduxIntegrationDemo'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-background text-foreground">
        <ReduxIntegrationDemo />
        <Toaster />
      </div>
    </Provider>
  )
}

export default App
