import { test, expect, Page } from '@playwright/test'

// Helper: set niveau in localStorage and navigate to target page
async function setupAndGoto(page: Page, path: string, progress?: Record<string, any>) {
  // Go to homepage first to initialize the app
  await page.goto('/')
  await page.waitForSelector('body div', { timeout: 10000 })

  // Set localStorage
  await page.evaluate((prog) => {
    localStorage.setItem('kies-niveau', JSON.stringify({ schoolType: 'havo', leerjaar: 3 }))
    if (prog) {
      localStorage.setItem('kies-progress', JSON.stringify(prog))
    } else {
      localStorage.setItem('kies-progress', JSON.stringify({
        kiezen: { k1: false, k2: false },
        instrueren: { i1: false, i2: false },
        evalueren: { e1: false, e2: false },
        spelregels: { s1: false, s2: false, s3: false },
      }))
    }
  }, progress)

  // Navigate to the actual page
  await page.goto(path)
  // Wait for React hydration
  await page.waitForSelector('body div', { timeout: 10000 })
}

// ===================== HOMEPAGE =====================

test.describe('Homepage', () => {
  test('homepage loads and shows niveau selection', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('main', { timeout: 10000 })
    await expect(page.getByText('Word')).toBeVisible()
    await expect(page.getByText('AI-vaardig')).toBeVisible()
  })
})

// ===================== DASHBOARD - Fresh user =====================

test.describe('Dashboard - Fresh user', () => {
  test('dashboard loads with all letters', async ({ page }) => {
    await setupAndGoto(page, '/dashboard')
    await expect(page.getByText('Welkom, HAVO 3!')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('iezen').first()).toBeVisible()
    await expect(page.getByText('nstrueren').first()).toBeVisible()
    await expect(page.getByText('valueren').first()).toBeVisible()
    await expect(page.getByText('pelregels').first()).toBeVisible()
  })

  test('dashboard shows "Begin met Kiezen" button', async ({ page }) => {
    await setupAndGoto(page, '/dashboard')
    await expect(page.getByText('Welkom, HAVO 3!')).toBeVisible({ timeout: 10000 })
    const button = page.getByRole('link', { name: /Begin met Kiezen/i })
    await expect(button).toBeVisible()
  })
})

// ===================== KIEZEN OVERVIEW =====================

test.describe('Kiezen overview page', () => {
  test('shows ProgressStepper and substep cards', async ({ page }) => {
    await setupAndGoto(page, '/leerpad/kiezen')
    await expect(page.getByRole('heading', { name: 'Kiezen' })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Drie manieren').first()).toBeVisible()
    await expect(page.getByText('Oefenen').first()).toBeVisible()
  })

  test('first substep is active (clickable), second is locked', async ({ page }) => {
    await setupAndGoto(page, '/leerpad/kiezen')
    await expect(page.getByRole('heading', { name: 'Kiezen' })).toBeVisible({ timeout: 10000 })

    // K1 SubStepCard should be a link (active state)
    const k1Card = page.locator('a[href="/leerpad/kiezen/k1"]').first()
    await expect(k1Card).toBeVisible()

    // K2 should be a div (locked state) - check there's no SubStepCard link for k2
    // The only link to k2 could be in the NextStepButton, but not in the cards
    const k2Div = page.locator('div.cursor-not-allowed')
    await expect(k2Div).toBeVisible()
  })

  test('shows NextStepButton with "Begin met Drie manieren"', async ({ page }) => {
    await setupAndGoto(page, '/leerpad/kiezen')
    await expect(page.getByRole('heading', { name: 'Kiezen' })).toBeVisible({ timeout: 10000 })
    const button = page.getByRole('link', { name: /Begin met Drie manieren/i })
    await expect(button).toBeVisible()
  })
})

// ===================== K1 SUBSTEP PAGE =====================

test.describe('K1 substep page', () => {
  test('shows page content with ProgressStepper', async ({ page }) => {
    await setupAndGoto(page, '/leerpad/kiezen/k1')
    await expect(page.getByText('Drie manieren om AI te gebruiken')).toBeVisible({ timeout: 10000 })
  })

  test('has complete button', async ({ page }) => {
    await setupAndGoto(page, '/leerpad/kiezen/k1')
    await expect(page.getByText('Drie manieren om AI te gebruiken')).toBeVisible({ timeout: 10000 })
    const nextBtn = page.getByRole('button', { name: /Volgende stap/i })
    await expect(nextBtn).toBeVisible()
  })
})

// ===================== AFTER K1 COMPLETED =====================

test.describe('After K1 completed', () => {
  const k1Progress = {
    kiezen: { k1: true, k2: false },
    instrueren: { i1: false, i2: false },
    evalueren: { e1: false, e2: false },
    spelregels: { s1: false, s2: false, s3: false },
  }

  test('kiezen overview shows K2 active (clickable)', async ({ page }) => {
    await setupAndGoto(page, '/leerpad/kiezen', k1Progress)
    await expect(page.getByRole('heading', { name: 'Kiezen' })).toBeVisible({ timeout: 10000 })

    // K2 SubStepCard should be a link now (active state)
    const k2Card = page.locator('a[href="/leerpad/kiezen/k2"]').first()
    await expect(k2Card).toBeVisible()

    // No locked cards anymore (both should be clickable)
    const lockedCards = page.locator('div.cursor-not-allowed')
    await expect(lockedCards).toHaveCount(0)
  })

  test('shows "Ga verder met Oefenen" button', async ({ page }) => {
    await setupAndGoto(page, '/leerpad/kiezen', k1Progress)
    await expect(page.getByRole('heading', { name: 'Kiezen' })).toBeVisible({ timeout: 10000 })
    const button = page.getByRole('link', { name: /Ga verder met Oefenen/i })
    await expect(button).toBeVisible()
  })

  test('dashboard shows "Ga verder met Kiezen"', async ({ page }) => {
    await setupAndGoto(page, '/dashboard', k1Progress)
    await expect(page.getByText('Welkom, HAVO 3!')).toBeVisible({ timeout: 10000 })
    const button = page.getByRole('link', { name: /Ga verder met Kiezen/i })
    await expect(button).toBeVisible()
  })
})

// ===================== AFTER K COMPLETED =====================

test.describe('After K completed', () => {
  const kCompleteProgress = {
    kiezen: { k1: true, k2: true },
    instrueren: { i1: false, i2: false },
    evalueren: { e1: false, e2: false },
    spelregels: { s1: false, s2: false, s3: false },
  }

  test('dashboard shows "Door naar Instrueren"', async ({ page }) => {
    await setupAndGoto(page, '/dashboard', kCompleteProgress)
    await expect(page.getByText('Welkom, HAVO 3!')).toBeVisible({ timeout: 10000 })
    const button = page.getByRole('link', { name: /Door naar Instrueren/i })
    await expect(button).toBeVisible()
  })

  test('instrueren overview shows I1 active', async ({ page }) => {
    await setupAndGoto(page, '/leerpad/instrueren', kCompleteProgress)
    await expect(page.getByRole('heading', { name: 'Instrueren' })).toBeVisible({ timeout: 10000 })
    const i1Card = page.locator('a[href="/leerpad/instrueren/i1"]').first()
    await expect(i1Card).toBeVisible()
  })
})

// ===================== ALL COMPLETED =====================

test.describe('All modules completed', () => {
  const allComplete = {
    kiezen: { k1: true, k2: true },
    instrueren: { i1: true, i2: true },
    evalueren: { e1: true, e2: true },
    spelregels: { s1: true, s2: true, s3: true },
  }

  test('dashboard shows completion message', async ({ page }) => {
    await setupAndGoto(page, '/dashboard', allComplete)
    await expect(page.getByText('Je hebt alle modules afgerond!')).toBeVisible({ timeout: 10000 })
  })

  test('spelregels overview shows "Terug naar dashboard"', async ({ page }) => {
    await setupAndGoto(page, '/leerpad/spelregels', allComplete)
    await expect(page.getByRole('heading', { name: 'Spelregels' })).toBeVisible({ timeout: 10000 })
    const button = page.getByRole('link', { name: /Terug naar dashboard/i })
    await expect(button).toBeVisible()
  })
})

// ===================== ALL OVERVIEW PAGES LOAD =====================

test.describe('All overview pages load', () => {
  for (const [path, title] of [
    ['/leerpad/kiezen', 'Kiezen'],
    ['/leerpad/instrueren', 'Instrueren'],
    ['/leerpad/evalueren', 'Evalueren'],
    ['/leerpad/spelregels', 'Spelregels'],
  ] as const) {
    test(`${title} overview loads`, async ({ page }) => {
      await setupAndGoto(page, path)
      await expect(page.getByRole('heading', { name: title })).toBeVisible({ timeout: 10000 })
    })
  }
})

// ===================== ALL SUBSTEP PAGES LOAD =====================

test.describe('All substep pages load', () => {
  for (const path of [
    '/leerpad/kiezen/k1',
    '/leerpad/kiezen/k2',
    '/leerpad/instrueren/i1',
    '/leerpad/instrueren/i2',
    '/leerpad/evalueren/e1',
    '/leerpad/evalueren/e2',
    '/leerpad/spelregels/s1',
    '/leerpad/spelregels/s2',
    '/leerpad/spelregels/s3',
  ]) {
    test(`${path} loads without errors`, async ({ page }) => {
      const pageErrors: string[] = []
      page.on('pageerror', err => pageErrors.push(err.message))

      await setupAndGoto(page, path)
      await expect(page.locator('main')).toBeVisible({ timeout: 10000 })

      // No critical JS errors
      expect(pageErrors.length).toBe(0)
    })
  }
})

// ===================== NAVIGATION FLOW =====================

test.describe('Navigation flow', () => {
  test('can navigate from dashboard to kiezen overview to K1', async ({ page }) => {
    await setupAndGoto(page, '/dashboard')
    await expect(page.getByText('Welkom, HAVO 3!')).toBeVisible({ timeout: 10000 })

    // Click Kiezen card
    await page.locator('a[href="/leerpad/kiezen"]').first().click()
    await expect(page.getByRole('heading', { name: 'Kiezen' })).toBeVisible({ timeout: 10000 })

    // Click K1 SubStepCard (first link to k1, not the NextStepButton)
    await page.locator('a[href="/leerpad/kiezen/k1"]').first().click()
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 })
  })

  test('back link from overview goes to dashboard', async ({ page }) => {
    await setupAndGoto(page, '/leerpad/kiezen')
    await expect(page.getByRole('heading', { name: 'Kiezen' })).toBeVisible({ timeout: 10000 })
    const backLink = page.locator('a[href="/dashboard"]').first()
    await expect(backLink).toBeVisible()
  })
})
