import { test as setup, expect } from '@playwright/test'
import { LoginConstants } from '../types/loginData'

const username = process.env.USER_NAME
const password = process.env.PASSWORD

if (!username || !password) {
  throw new Error(
    'Missing required environment variables for authentication setup: USER_NAME and PASSWORD.'
  )
}

setup('user authentication', async ({ page }) => {
  await page.goto('/')

  //prettier-ignore
  const {
    USERNAME_LABEL,
    PASSWORD_LABEL,
    LOGIN_BUTTON,
    DEFAULT_HEADING
  } = LoginConstants
  const loginForm = page.locator('form')
  await expect(loginForm).toBeVisible()
  await loginForm.getByLabel(USERNAME_LABEL).fill(username)
  await loginForm.getByLabel(PASSWORD_LABEL).fill(password)
  await page.getByRole('button', { name: LOGIN_BUTTON }).click()

  // App defaults to "Web Application" heading after successful login
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: DEFAULT_HEADING,
    })
  ).toBeVisible()

  await page.context().storageState({ path: process.env.AUTH_FILE! })
})
