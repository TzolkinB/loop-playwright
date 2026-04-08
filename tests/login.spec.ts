import { test, expect } from '@playwright/test'

test('user can log in with valid credentials', async ({ page }) => {
  await page.goto('/')

  const loginForm = page.locator('form')
  await expect(loginForm).toBeVisible()
  await loginForm.getByLabel('Username').fill(process.env.USER_NAME!)
  await loginForm.getByLabel('Password').fill(process.env.PASSWORD!)
  await page.getByRole('button', { name: 'Sign in' }).click()

  // App defaults to "Web Application" heading after successful login
  await expect(
    page.getByRole('heading', { level: 1, name: 'Web Application' })
  ).toBeVisible()
})
