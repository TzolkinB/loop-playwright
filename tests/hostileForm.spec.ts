import { test, expect } from '@playwright/test'
import hostileData from '../data/hostileInputScenarios.json'
import loginData from '../data/loginScenarios.json'
import { HostileInputTypes } from '../types/hostileInput'
import { LoginTypes } from '../types/login'

const hostile: HostileInputTypes = hostileData as HostileInputTypes
const login: LoginTypes = loginData

// Start signed out so the real login form is shown.
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('hostile values typed into the login form', () => {
  hostile.formPayloads.forEach(scenario => {
    test(`${scenario.category}: ${scenario.name}`, async ({ page }) => {
      const dialogs: string[] = []
      page.on('dialog', async dialog => {
        dialogs.push(dialog.message())
        await dialog.dismiss()
      })

      await page.goto('/')
      const form = page.locator('form')
      await form.getByLabel(login.usernameLabel).fill(scenario.username)
      await form.getByLabel(login.passwordLabel).fill(scenario.password)
      await page.getByRole('button', { name: login.loginButton }).click()

      // Only the fixed message is shown, never the typed value.
      const alert = page.getByRole('alert')
      await expect(alert).toHaveText(hostile.invalidMessage)

      // Nothing was injected into the page, no script ran, no dialog opened.
      await expect(page.locator('form img, form script')).toHaveCount(0)
      await expect(page.locator('body')).not.toContainText(scenario.username)
      expect(
        await page.evaluate(
          () => (window as unknown as { __pwned?: number }).__pwned
        )
      ).toBeUndefined()
      expect(dialogs).toEqual([])
    })
  })
})
