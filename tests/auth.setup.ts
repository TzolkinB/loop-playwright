import { test as setup, expect } from '@playwright/test'

setup('user authentication', async ({ page }) => {
  await page.goto('/')

  const loginForm = page.locator('form')
  await expect(loginForm).toBeVisible()
  await loginForm.getByLabel('Username').fill('admin')
  await loginForm.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign in' }).click()

  // App defaults to to "Web Application" heading after successful login
  await expect(
    page.getByRole('heading', { level: 1, name: 'Web Application' })
  ).toBeVisible()

  await page.context().storageState({ path: 'playwright/.auth.json' })
})
