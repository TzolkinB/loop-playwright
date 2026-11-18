import { test as setup, expect } from '@playwright/test'
import loginData from '../data/loginScenarios.json'
import { LoginTypes } from '../types/login'
import { credentials } from '../utils/credentials'

const { username, password } = credentials()
const login: LoginTypes = loginData

setup('user authentication', async ({ page }) => {
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

  await page.context().storageState({ path: process.env.AUTH_FILE! })
})
