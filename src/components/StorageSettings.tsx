import { useState } from 'react'
import { storageConfig, setFlaskAPI, disableFlaskAPI } from '@/lib/storage-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export function StorageSettings() {
  const [useFlask, setUseFlask] = useState(storageConfig.useFlaskAPI)
  const [flaskURL, setFlaskURL] = useState(storageConfig.flaskAPIURL || '')
  const [testing, setTesting] = useState(false)

  const handleToggle = (enabled: boolean) => {
    setUseFlask(enabled)
    if (enabled && flaskURL) {
      setFlaskAPI(flaskURL)
      toast.success('Flask API enabled')
    } else {
      disableFlaskAPI()
      toast.info('Using IndexedDB storage')
    }
  }

  const handleURLChange = (url: string) => {
    setFlaskURL(url)
    if (useFlask && url) {
      setFlaskAPI(url)
    }
  }

  const testConnection = async () => {
    if (!flaskURL) {
      toast.error('Please enter a Flask API URL')
      return
    }

    setTesting(true)
    try {
      const response = await fetch(`${flaskURL}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        toast.success('Flask API connection successful!')
        setFlaskAPI(flaskURL)
        setUseFlask(true)
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('Flask API test failed:', error)
      toast.error('Failed to connect to Flask API. Using IndexedDB instead.')
      disableFlaskAPI()
      setUseFlask(false)
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Settings</CardTitle>
        <CardDescription>
          Choose between local IndexedDB storage or Flask API backend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="flask-toggle">Use Flask API Backend</Label>
            <p className="text-sm text-muted-foreground">
              Store data on a remote Flask server instead of locally
            </p>
          </div>
          <Switch
            id="flask-toggle"
            checked={useFlask}
            onCheckedChange={handleToggle}
          />
        </div>

        {useFlask && (
          <div className="space-y-2">
            <Label htmlFor="flask-url">Flask API URL</Label>
            <div className="flex gap-2">
              <Input
                id="flask-url"
                type="url"
                placeholder="https://api.example.com"
                value={flaskURL}
                onChange={(e) => handleURLChange(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={testConnection}
                disabled={testing || !flaskURL}
              >
                {testing ? 'Testing...' : 'Test'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              If the Flask API fails, the app will automatically fall back to IndexedDB
            </p>
          </div>
        )}

        {!useFlask && (
          <div className="rounded-md bg-muted p-3">
            <p className="text-sm text-muted-foreground">
              Currently using IndexedDB for local browser storage. Data is stored securely in your browser.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
