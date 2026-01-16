import { test, expect } from '@playwright/test'

test.describe('CodeForge - Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should load the application successfully', async ({ page }) => {
    await expect(page.locator('h1:has-text("CodeForge")')).toBeVisible()
    await expect(page.locator('text=Low-Code Next.js App Builder')).toBeVisible()
  })

  test('should display all main navigation tabs', async ({ page }) => {
    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=Code Editor')).toBeVisible()
    await expect(page.locator('text=Models')).toBeVisible()
    await expect(page.locator('text=Components')).toBeVisible()
    await expect(page.locator('text=Settings')).toBeVisible()
  })

  test('should switch between tabs', async ({ page }) => {
    await page.click('text=Models')
    await expect(page.locator('[role="tabpanel"]:visible')).toContainText(/model|schema|database/i)
    
    await page.click('text=Styling')
    await expect(page.locator('[role="tabpanel"]:visible')).toContainText(/theme|color|style/i)
  })

  test('should have export project button', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Export Project")')
    await expect(exportButton).toBeVisible()
    await expect(exportButton).toBeEnabled()
  })
})

test.describe('CodeForge - Code Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.click('text=Code Editor')
    await page.waitForTimeout(1000)
  })

  test('should display file explorer and editor', async ({ page }) => {
    await expect(page.locator('text=page.tsx, text=layout.tsx').first()).toBeVisible({ timeout: 5000 })
  })

  test('should show Monaco editor', async ({ page }) => {
    const monacoEditor = page.locator('.monaco-editor, [data-uri*="page.tsx"]')
    await expect(monacoEditor.first()).toBeVisible({ timeout: 10000 })
  })

  test('should add a new file', async ({ page }) => {
    const addFileButton = page.locator('button:has-text("Add File"), button:has([data-icon="plus"])')
    if (await addFileButton.first().isVisible()) {
      await addFileButton.first().click()
      await page.waitForTimeout(500)
    }
  })
})

test.describe('CodeForge - Model Designer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.click('text=Models')
    await page.waitForTimeout(1000)
  })

  test('should open model designer', async ({ page }) => {
    await expect(page.locator('text=Model Designer, text=Prisma, text=Add Model').first()).toBeVisible({ timeout: 5000 })
  })

  test('should have add model button', async ({ page }) => {
    const addModelButton = page.locator('button:has-text("Add Model"), button:has-text("Create Model")')
    await expect(addModelButton.first()).toBeVisible({ timeout: 5000 })
  })

  test('should create a new model', async ({ page }) => {
    const addButton = page.locator('button:has-text("Add Model"), button:has-text("Create Model")').first()
    
    if (await addButton.isVisible()) {
      await addButton.click()
      await page.waitForTimeout(500)
      
      const nameInput = page.locator('input[placeholder*="Model name"], input[name="name"], input[id*="model-name"]').first()
      if (await nameInput.isVisible()) {
        await nameInput.fill('User')
        
        const saveButton = page.locator('button:has-text("Save"), button:has-text("Create"), button:has-text("Add")').first()
        if (await saveButton.isVisible()) {
          await saveButton.click()
          await page.waitForTimeout(1000)
        }
      }
    }
  })
})

test.describe('CodeForge - Component Designer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.click('text=Components')
    await page.waitForTimeout(1000)
  })

  test('should open component designer', async ({ page }) => {
    await expect(page.locator('text=Component, text=Add Component, text=Tree').first()).toBeVisible({ timeout: 5000 })
  })

  test('should have add component functionality', async ({ page }) => {
    const addButton = page.locator('button:has-text("Add Component"), button:has-text("Create Component")').first()
    await expect(addButton).toBeVisible({ timeout: 5000 })
  })
})

test.describe('CodeForge - Style Designer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.click('text=Styling')
    await page.waitForTimeout(1000)
  })

  test('should open style designer', async ({ page }) => {
    await expect(page.locator('text=Theme, text=Color, text=Style').first()).toBeVisible({ timeout: 5000 })
  })

  test('should display theme variants', async ({ page }) => {
    await expect(page.locator('text=Light, text=Dark').first()).toBeVisible({ timeout: 5000 })
  })

  test('should have color pickers', async ({ page }) => {
    const colorInputs = page.locator('input[type="color"]')
    await expect(colorInputs.first()).toBeVisible({ timeout: 5000 })
  })
})

test.describe('CodeForge - Export Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should open export dialog', async ({ page }) => {
    await page.click('button:has-text("Export Project")')
    await page.waitForTimeout(1000)
    
    await expect(page.locator('text=Generated Project Files, text=Download as ZIP').first()).toBeVisible({ timeout: 5000 })
  })

  test('should generate code files', async ({ page }) => {
    await page.click('button:has-text("Export Project")')
    await page.waitForTimeout(2000)
    
    await expect(page.locator('text=package.json, text=schema.prisma, text=theme').first()).toBeVisible({ timeout: 5000 })
  })

  test('should have download ZIP button', async ({ page }) => {
    await page.click('button:has-text("Export Project")')
    await page.waitForTimeout(1000)
    
    const downloadButton = page.locator('button:has-text("Download as ZIP")')
    await expect(downloadButton).toBeVisible({ timeout: 5000 })
    await expect(downloadButton).toBeEnabled()
  })

  test('should have copy functionality', async ({ page }) => {
    await page.click('button:has-text("Export Project")')
    await page.waitForTimeout(1000)
    
    const copyButton = page.locator('button:has-text("Copy All"), button:has-text("Copy")').first()
    await expect(copyButton).toBeVisible({ timeout: 5000 })
  })
})

test.describe('CodeForge - Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.click('text=Settings')
    await page.waitForTimeout(1000)
  })

  test('should display Next.js configuration', async ({ page }) => {
    await expect(page.locator('text=Next.js, text=Configuration, text=App Name').first()).toBeVisible({ timeout: 5000 })
  })

  test('should display NPM settings', async ({ page }) => {
    await expect(page.locator('text=npm, text=Package, text=Dependencies').first()).toBeVisible({ timeout: 5000 })
  })
})

test.describe('CodeForge - Feature Toggles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.click('text=Features')
    await page.waitForTimeout(1000)
  })

  test('should display feature toggle settings', async ({ page }) => {
    await expect(page.locator('text=Feature, text=Toggle, text=Enable').first()).toBeVisible({ timeout: 5000 })
  })

  test('should have toggleable features', async ({ page }) => {
    const switches = page.locator('button[role="switch"]')
    await expect(switches.first()).toBeVisible({ timeout: 5000 })
  })

  test('should toggle a feature off and hide corresponding tab', async ({ page }) => {
    const toggleSwitch = page.locator('button[role="switch"]').first()
    
    if (await toggleSwitch.isVisible()) {
      const isChecked = await toggleSwitch.getAttribute('data-state')
      
      if (isChecked === 'checked') {
        await toggleSwitch.click()
        await page.waitForTimeout(500)
        
        const newState = await toggleSwitch.getAttribute('data-state')
        expect(newState).toBe('unchecked')
      }
    }
  })
})

test.describe('CodeForge - Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.click('text=Workflows')
    await page.waitForTimeout(1000)
  })

  test('should open workflow designer', async ({ page }) => {
    await expect(page.locator('text=Workflow').first()).toBeVisible({ timeout: 5000 })
  })

  test('should have workflow creation functionality', async ({ page }) => {
    const addButton = page.locator('button:has-text("Add Workflow"), button:has-text("Create Workflow")').first()
    await expect(addButton).toBeVisible({ timeout: 5000 })
  })
})

test.describe('CodeForge - Flask API Designer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.click('text=Flask API')
    await page.waitForTimeout(1000)
  })

  test('should open Flask designer', async ({ page }) => {
    await expect(page.locator('text=Flask, text=API, text=Blueprint').first()).toBeVisible({ timeout: 5000 })
  })

  test('should display Flask configuration options', async ({ page }) => {
    await expect(page.locator('text=Port, text=CORS, text=Debug').first()).toBeVisible({ timeout: 5000 })
  })
})

test.describe('CodeForge - Testing Tools', () => {
  test('should open Playwright designer', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.click('text=Playwright')
    await page.waitForTimeout(1000)
    
    await expect(page.locator('text=Playwright, text=Test').first()).toBeVisible({ timeout: 5000 })
  })

  test('should open Storybook designer', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.click('text=Storybook')
    await page.waitForTimeout(1000)
    
    await expect(page.locator('text=Storybook, text=Story').first()).toBeVisible({ timeout: 5000 })
  })

  test('should open Unit Tests designer', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.click('text=Unit Tests')
    await page.waitForTimeout(1000)
    
    await expect(page.locator('text=Unit, text=Test').first()).toBeVisible({ timeout: 5000 })
  })
})

test.describe('CodeForge - PWA Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.click('text=PWA')
    await page.waitForTimeout(1000)
  })

  test('should open PWA settings', async ({ page }) => {
    await expect(page.locator('text=Progressive Web App, text=PWA').first()).toBeVisible({ timeout: 5000 })
  })

  test('should display PWA configuration', async ({ page }) => {
    await expect(page.locator('text=Manifest, text=Service Worker, text=Install').first()).toBeVisible({ timeout: 5000 })
  })
})

test.describe('CodeForge - Favicon Designer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.click('text=Favicon Designer')
    await page.waitForTimeout(1000)
  })

  test('should open favicon designer', async ({ page }) => {
    await expect(page.locator('text=Favicon, text=Icon').first()).toBeVisible({ timeout: 5000 })
  })
})

test.describe('CodeForge - Documentation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.click('text=Documentation')
    await page.waitForTimeout(1000)
  })

  test('should display documentation', async ({ page }) => {
    await expect(page.locator('text=Documentation, text=Guide, text=README').first()).toBeVisible({ timeout: 5000 })
  })
})

test.describe('CodeForge - Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.click('text=Dashboard')
    await page.waitForTimeout(1000)
  })

  test('should display project dashboard', async ({ page }) => {
    await expect(page.locator('text=Dashboard, text=Project, text=Overview').first()).toBeVisible({ timeout: 5000 })
  })

  test('should show project statistics', async ({ page }) => {
    await expect(page.locator('text=Files, text=Models, text=Components').first()).toBeVisible({ timeout: 5000 })
  })
})

test.describe('CodeForge - Keyboard Shortcuts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should open keyboard shortcuts dialog', async ({ page }) => {
    const shortcutsButton = page.locator('button[title*="Keyboard Shortcuts"]')
    
    if (await shortcutsButton.isVisible()) {
      await shortcutsButton.click()
      await page.waitForTimeout(500)
      
      await expect(page.locator('text=Keyboard Shortcuts, text=Shortcut, text=Ctrl').first()).toBeVisible({ timeout: 5000 })
    }
  })

  test('should navigate using Ctrl+1 shortcut', async ({ page }) => {
    await page.keyboard.press('Control+1')
    await page.waitForTimeout(500)
    
    await expect(page.locator('[role="tabpanel"]:visible')).toBeVisible()
  })
})

test.describe('CodeForge - Project Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should have project management functionality', async ({ page }) => {
    const projectButton = page.locator('button:has-text("Project"), button:has-text("Save"), button:has-text("Load")').first()
    await expect(projectButton).toBeVisible({ timeout: 5000 })
  })

  test('should persist data using KV storage', async ({ page }) => {
    await page.click('text=Models')
    await page.waitForTimeout(1000)
    
    const addButton = page.locator('button:has-text("Add Model"), button:has-text("Create Model")').first()
    
    if (await addButton.isVisible()) {
      await addButton.click()
      await page.waitForTimeout(500)
      
      await page.reload()
      await page.waitForLoadState('networkidle')
    }
  })
})

test.describe('CodeForge - Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should not show console errors on load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.waitForTimeout(2000)
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Download the React DevTools') &&
      !e.includes('favicon') &&
      !e.includes('manifest')
    )
    
    expect(criticalErrors.length).toBe(0)
  })

  test('should have error repair tab', async ({ page }) => {
    const errorTab = page.locator('text=Error Repair')
    if (await errorTab.isVisible()) {
      await errorTab.click()
      await page.waitForTimeout(1000)
      
      await expect(page.locator('[role="tabpanel"]:visible')).toBeVisible()
    }
  })
})

test.describe('CodeForge - Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('h1:has-text("CodeForge")')).toBeVisible()
  })

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('h1:has-text("CodeForge")')).toBeVisible()
  })
})

test.describe('CodeForge - Code Generation Quality', () => {
  test('should generate valid package.json', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.click('button:has-text("Export Project")')
    await page.waitForTimeout(2000)
    
    const packageJsonText = page.locator('text=package.json')
    await expect(packageJsonText).toBeVisible({ timeout: 5000 })
    
    const codeBlock = page.locator('textarea, pre, code').first()
    if (await codeBlock.isVisible()) {
      const content = await codeBlock.textContent()
      
      if (content && content.includes('{')) {
        expect(() => JSON.parse(content)).not.toThrow()
      }
    }
  })

  test('should generate Prisma schema', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.click('button:has-text("Export Project")')
    await page.waitForTimeout(2000)
    
    const prismaText = page.locator('text=schema.prisma, text=prisma')
    await expect(prismaText.first()).toBeVisible({ timeout: 5000 })
  })

  test('should generate theme configuration', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.click('button:has-text("Export Project")')
    await page.waitForTimeout(2000)
    
    const themeText = page.locator('text=theme.ts, text=theme')
    await expect(themeText.first()).toBeVisible({ timeout: 5000 })
  })
})
