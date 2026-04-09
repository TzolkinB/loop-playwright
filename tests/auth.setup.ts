import { test as setup, expect } from '@playwright/test'
import { getLoginData } from '../utils/dataLoader'

const username = process.env.USER_NAME
const password = process.env.PASSWORD

if (!username || !password) {
  throw new Error(
    'Missing required environment variables for authentication setup: USER_NAME and PASSWORD.'
  )
}

setup('user authentication', async ({ page }) => {
  await page.goto('/')

  // prettier-ignore
  const {
    usernameLabel,
    passwordLabel,
    loginButton,
    defaultHeading,
  } = getLoginData()
  const loginForm = page.locator('form')
  await expect(loginForm).toBeVisible()
  await loginForm.getByLabel(usernameLabel).fill(username)
  await loginForm.getByLabel(passwordLabel).fill(password)
  await page.getByRole('button', { name: loginButton }).click()

  // App defaults to "Web Application" heading after successful login
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: defaultHeading,
    })
  ).toBeVisible()

  await page.context().storageState({ path: process.env.AUTH_FILE! })
})
