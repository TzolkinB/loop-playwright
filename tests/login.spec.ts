import { test, expect } from '@playwright/test'
import { LoginConstants } from '../types/loginData'

test('user can log in with valid credentials', async ({ page }) => {
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
  await loginForm.getByLabel(USERNAME_LABEL).fill(process.env.USER_NAME!)
  await loginForm.getByLabel(PASSWORD_LABEL).fill(process.env.PASSWORD!)
  await page.getByRole('button', { name: LOGIN_BUTTON }).click()

  // App defaults to "Web Application" heading after successful login
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: DEFAULT_HEADING,
    })
  ).toBeVisible()
})
