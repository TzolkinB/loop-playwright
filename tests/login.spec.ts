import { test, expect } from '@playwright/test'
import { getLoginData } from '../utils/dataLoader'

test('user can log in with valid credentials', async ({ page }) => {
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
  await loginForm.getByLabel(usernameLabel).fill(process.env.USER_NAME!)
  await loginForm.getByLabel(passwordLabel).fill(process.env.PASSWORD!)
  await page.getByRole('button', { name: loginButton }).click()

  // App defaults to "Web Application" heading after successful login
  await expect(
    page.getByRole('heading', { level: 1, name: defaultHeading })
  ).toBeVisible()
})
