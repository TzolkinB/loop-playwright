import { test, expect } from '@playwright/test'
import loginData from '../data/loginScenarios.json'
import { LoginTypes } from '../types/login'
import { credentials } from '../utils/credentials'

const login: LoginTypes = loginData

test('user can log in with valid credentials', async ({ page }) => {
  const { username, password } = credentials()
  await page.goto('/')

  const loginForm = page.locator('form')
  await expect(loginForm).toBeVisible()
  await loginForm.getByLabel(login.usernameLabel).fill(username)
  await loginForm.getByLabel(login.passwordLabel).fill(password)
  await page.getByRole('button', { name: login.loginButton }).click()

  // App defaults to "Web Application" heading after successful login
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: login.defaultHeading,
    })
  ).toBeVisible()
})
