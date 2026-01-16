import { test, expect } from '@playwright/test'

test.describe('CodeForge - Smoke Tests', () => {
  test('app loads successfully', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('h1:has-text("CodeForge")')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Low-Code Next.js App Builder')).toBeVisible()
  })

  test('can navigate to all major tabs', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const tabs = [
      'Dashboard',
      'Code Editor',
      'Models',
      'Components',
      'Styling',
      'Settings'
    ]
    
    for (const tab of tabs) {
      await page.click(`text=${tab}`)
      await page.waitForTimeout(500)
      await expect(page.locator('[role="tabpanel"]:visible')).toBeVisible()
    }
  })

  test('can export project and generate code', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.click('button:has-text("Export Project")')
    await page.waitForTimeout(2000)
    
    await expect(page.locator('text=Generated Project Files')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('button:has-text("Download as ZIP")')).toBeVisible()
    await expect(page.locator('button:has-text("Download as ZIP")')).toBeEnabled()
    
    await expect(page.locator('text=package.json')).toBeVisible()
  })

  test('Monaco editor loads in code editor', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.click('text=Code Editor')
    await page.waitForTimeout(2000)
    
    const monaco = page.locator('.monaco-editor').first()
    await expect(monaco).toBeVisible({ timeout: 15000 })
  })

  test('model designer is functional', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.click('text=Models')
    await page.waitForTimeout(1000)
    
    const addModelButton = page.locator('button:has-text("Add Model"), button:has-text("Create Model")').first()
    await expect(addModelButton).toBeVisible({ timeout: 5000 })
    await expect(addModelButton).toBeEnabled()
  })

  test('style designer with color pickers loads', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.click('text=Styling')
    await page.waitForTimeout(1000)
    
    const colorInputs = page.locator('input[type="color"]')
    await expect(colorInputs.first()).toBeVisible({ timeout: 5000 })
  })

  test('feature toggles work', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.click('text=Features')
    await page.waitForTimeout(1000)
    
    const toggleSwitch = page.locator('button[role="switch"]').first()
    await expect(toggleSwitch).toBeVisible({ timeout: 5000 })
  })

  test('no critical console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Download the React DevTools') &&
      !e.includes('favicon') &&
      !e.includes('manifest') &&
      !e.includes('source map')
    )
    
    expect(criticalErrors.length).toBe(0)
  })
})
