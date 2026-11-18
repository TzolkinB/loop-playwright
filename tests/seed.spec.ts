import { test, expect } from '@playwright/test'
import loginData from '../data/loginScenarios.json'
import { LoginTypes } from '../types/login'
import { credentials } from '../utils/credentials'

const login: LoginTypes = loginData

// Seed test for the Playwright planner, generator and healer agents.
// Agents run this first to prepare the page, so it leaves the browser signed in
// as the Demo user on the Web Application board. The signed-in state comes from
// the `setup` project through `storageState`, as for every other test.
test.describe('Signed-in Demo user', () => {
  // The signed-in state only exists if setup could sign in. Checking the
  // credentials here gives the clear "copy .env.example" message instead of an
  // obscure missing-auth-file error.
  test.beforeAll(() => {
    credentials()
  })

  test('seed', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { level: 1, name: login.defaultHeading })
    ).toBeVisible()
    await expect(page.getByLabel(login.usernameLabel)).toHaveCount(0)
  })
})
