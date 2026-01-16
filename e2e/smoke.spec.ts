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
      'Component Trees',
      'Workflows',
      'Lambdas',
      'Styling',
      'Flask API',
      'Settings',
      'PWA',
      'Features'
    ]
    
    for (const tab of tabs) {
      const tabButton = page.locator(`button[role="tab"]:has-text("${tab}")`)
      if (await tabButton.isVisible()) {
        await tabButton.click()
        await page.waitForTimeout(500)
        await expect(page.locator('[role="tabpanel"]:visible')).toBeVisible()
      }
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
    
    await page.click('button[role="tab"]:has-text("Code Editor")')
    await page.waitForTimeout(2000)
    
    const monaco = page.locator('.monaco-editor').first()
    await expect(monaco).toBeVisible({ timeout: 15000 })
  })

  test('model designer is functional', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.click('button[role="tab"]:has-text("Models")')
    await page.waitForTimeout(1000)
    
    const addModelButton = page.locator('button:has-text("Add Model"), button:has-text("Create Model"), button:has-text("New Model")').first()
    await expect(addModelButton).toBeVisible({ timeout: 5000 })
    await expect(addModelButton).toBeEnabled()
  })

  test('component tree manager loads', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.click('button[role="tab"]:has-text("Component Trees")')
    await page.waitForTimeout(1000)
    
    await expect(page.locator('text=Main App, text=Component Tree, text=Trees')).toBeVisible({ timeout: 5000 })
  })

  test('workflow designer loads', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.click('button[role="tab"]:has-text("Workflows")')
    await page.waitForTimeout(1000)
    
    const createButton = page.locator('button:has-text("Create Workflow"), button:has-text("New Workflow"), button:has-text("Add Workflow")').first()
    await expect(createButton).toBeVisible({ timeout: 5000 })
  })

  test('lambda designer loads with Monaco', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.click('button[role="tab"]:has-text("Lambdas")')
    await page.waitForTimeout(1000)
    
    const createButton = page.locator('button:has-text("Create Lambda"), button:has-text("New Lambda"), button:has-text("Add Lambda")').first()
    await expect(createButton).toBeVisible({ timeout: 5000 })
  })

  test('style designer with color pickers loads', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.click('button[role="tab"]:has-text("Styling")')
    await page.waitForTimeout(1000)
    
    const colorInputs = page.locator('input[type="color"]')
    await expect(colorInputs.first()).toBeVisible({ timeout: 5000 })
  })

  test('Flask API designer loads', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.click('button[role="tab"]:has-text("Flask API")')
    await page.waitForTimeout(1000)
    
    await expect(page.locator('text=Flask, text=Blueprint, text=API')).toBeVisible({ timeout: 5000 })
  })

  test('PWA settings loads', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.click('button[role="tab"]:has-text("PWA")')
    await page.waitForTimeout(1000)
    
    await expect(page.locator('text=Progressive Web App, text=PWA, text=Install')).toBeVisible({ timeout: 5000 })
  })

  test('feature toggles work', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.click('button[role="tab"]:has-text("Features")')
    await page.waitForTimeout(1000)
    
    const toggleSwitch = page.locator('button[role="switch"]').first()
    await expect(toggleSwitch).toBeVisible({ timeout: 5000 })
  })

  test('project manager save/load functionality exists', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const projectButtons = page.locator('button:has-text("Save Project"), button:has-text("Load Project"), button:has-text("New Project")')
    await expect(projectButtons.first()).toBeVisible({ timeout: 5000 })
  })

  test('dashboard displays project metrics', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.click('button[role="tab"]:has-text("Dashboard")')
    await page.waitForTimeout(1000)
    
    const metricsCard = page.locator('text=Files, text=Models, text=Components')
    await expect(metricsCard.first()).toBeVisible({ timeout: 5000 })
  })

  test('keyboard shortcuts dialog opens', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const keyboardButton = page.locator('button[title*="Keyboard"]')
    if (await keyboardButton.isVisible()) {
      await keyboardButton.click()
      await page.waitForTimeout(500)
      await expect(page.locator('text=Keyboard Shortcuts, text=Shortcuts')).toBeVisible({ timeout: 5000 })
    }
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
      !e.includes('source map') &&
      !e.includes('Failed to load resource') &&
      !e.includes('net::ERR_')
    )
    
    if (criticalErrors.length > 0) {
      console.log('Critical errors found:', criticalErrors)
    }
    
    expect(criticalErrors.length).toBe(0)
  })

  test('app is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('h1:has-text("CodeForge")')).toBeVisible({ timeout: 10000 })
    
    const tabs = page.locator('button[role="tab"]')
    await expect(tabs.first()).toBeVisible()
  })
})
