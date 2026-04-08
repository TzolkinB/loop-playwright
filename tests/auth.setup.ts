import { test as setup, expect } from '@playwright/test'

const username = process.env.USER_NAME
const password = process.env.PASSWORD

if (!username || !password) {
  throw new Error(
    'Missing required environment variables for authentication setup: USER_NAME and PASSWORD.'
  )
}

setup('user authentication', async ({ page }) => {
  await page.goto('/')

  const loginForm = page.locator('form')
  await expect(loginForm).toBeVisible()
  await loginForm.getByLabel('Username').fill(username)
  await loginForm.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()

  // App defaults to "Web Application" heading after successful login
  await expect(
    page.getByRole('heading', { level: 1, name: 'Web Application' })
  ).toBeVisible()

  await page.context().storageState({ path: process.env.AUTH_FILE! })
})
