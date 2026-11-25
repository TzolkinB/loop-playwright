import { test, expect } from '@playwright/test'
import { credentials } from '../utils/credentials'

const { username, password } = credentials()

// Start signed out so the sign-in flow itself runs under the policy.
test.use({ storageState: { cookies: [], origins: [] } })

test('app loads and signs in under the Content-Security-Policy with no violations', async ({
  page,
}) => {
  const violations: string[] = []
  await page.exposeFunction('reportViolation', (detail: string) =>
    violations.push(detail)
  )
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', event =>
      (
        window as unknown as { reportViolation(detail: string): void }
      ).reportViolation(`${event.violatedDirective} ${event.blockedURI}`)
    )
  })
  const consoleErrors: string[] = []
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })

  await page.goto('/')
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()

  // Level 1: the navigation also lists "Web Application" as a level-2 heading.
  await expect(
    page.getByRole('heading', { level: 1, name: 'Web Application' })
  ).toBeVisible()
  expect(violations).toEqual([])
  expect(consoleErrors).toEqual([])
})
