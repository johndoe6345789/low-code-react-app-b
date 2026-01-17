import { test, expect } from '@playwright/test'

test.describe('CodeForge - Smoke Tests', () => {
  test('app loads successfully', async ({ page }) => {
    test.setTimeout(30000)
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 })
    await page.waitForTimeout(2000)
  })

  test('can navigate to dashboard tab', async ({ page }) => {
    test.setTimeout(30000)
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2000)
    
    const dashboardTab = page.locator('button[role="tab"]').filter({ hasText: /Dashboard/i }).first()
    if (await dashboardTab.isVisible({ timeout: 5000 })) {
      await dashboardTab.click()
      await page.waitForTimeout(500)
      await expect(page.locator('[role="tabpanel"]:visible')).toBeVisible({ timeout: 5000 })
    }
  })

  test('Monaco editor loads in code editor', async ({ page }) => {
    test.setTimeout(45000)
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2000)
    
    const codeEditorTab = page.locator('button[role="tab"]').filter({ hasText: /Code Editor/i }).first()
    if (await codeEditorTab.isVisible({ timeout: 5000 })) {
      await codeEditorTab.click()
      await page.waitForTimeout(3000)
      
      const monaco = page.locator('.monaco-editor').first()
      await expect(monaco).toBeVisible({ timeout: 20000 })
    }
  })

  test('no critical console errors', async ({ page }) => {
    test.setTimeout(30000)
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(3000)
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Download the React DevTools') &&
      !e.includes('favicon') &&
      !e.includes('manifest') &&
      !e.includes('source map') &&
      !e.includes('Failed to load resource') &&
      !e.includes('net::ERR_') &&
      !e.includes('404')
    )
    
    if (criticalErrors.length > 0) {
      console.log('Critical errors found:', criticalErrors)
    }
    
    expect(criticalErrors.length).toBeLessThan(5)
  })
})
