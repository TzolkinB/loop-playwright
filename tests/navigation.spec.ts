import { test, expect } from '@playwright/test'
import TaskBoardPage from '../pages/TaskBoardPage'
import navigationData from '../data/navigationScenarios.json'
import { AppType } from '../types/taskBoard'
import { NavigationTypes } from '../types/navigation'
import loginData from '../data/loginScenarios.json'

const spec = navigationData as NavigationTypes
const appTypes = spec.appTypes as AppType[]

const sidebars = spec.scenarios.filter(s => s.navigation === 'sidebar')
const drawers = spec.scenarios.filter(s => s.navigation === 'drawer')

test.describe('Application navigation', () => {
  sidebars.forEach(scenario => {
    test.describe(`${scenario.name} (${scenario.width}px)`, () => {
      test.use({
        viewport: { width: scenario.width, height: scenario.height },
      })

      test('shows the sidebar and no menu button', async ({ page }) => {
        const taskBoard = new TaskBoardPage(page)
        await page.goto('/')

        await expect(taskBoard.navigation).toBeVisible()
        await expect(taskBoard.menuButton).toHaveCount(0)
        for (const appType of appTypes) {
          await expect(taskBoard.appTypeButton(appType)).toBeVisible()
        }
      })

      test('Sign out in the sidebar returns to the login form', async ({
        page,
      }) => {
        const taskBoard = new TaskBoardPage(page)
        await page.goto('/')

        await taskBoard.signOutButton.click()

        await expect(page.getByLabel(loginData.usernameLabel)).toBeVisible()
        await expect(taskBoard.navigation).toHaveCount(0)
      })
    })
  })

  test('widening the window with the drawer open shows the sidebar and no menu button', async ({
    page,
  }) => {
    const taskBoard = new TaskBoardPage(page)
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    await taskBoard.menuButton.click()
    await expect(taskBoard.navigation).toBeVisible()

    await page.setViewportSize({ width: 1280, height: 800 })

    await expect(taskBoard.menuButton).toHaveCount(0)
    await expect(taskBoard.navigation).toBeVisible()
    await expect(taskBoard.appHeading(AppType.WEB)).toBeVisible()
  })

  drawers.forEach(scenario => {
    test.describe(`${scenario.name} (${scenario.width}px)`, () => {
      test.use({
        viewport: { width: scenario.width, height: scenario.height },
      })

      test('the menu button opens and closes the drawer', async ({ page }) => {
        const taskBoard = new TaskBoardPage(page)
        await page.goto('/')

        await expect(taskBoard.menuButton).toBeVisible()
        await expect(taskBoard.menuButton).toHaveAttribute(
          'aria-expanded',
          'false'
        )
        await expect(taskBoard.navigation).toBeHidden()

        await taskBoard.menuButton.click()
        await expect(taskBoard.navigation).toBeVisible()
        await expect(taskBoard.menuButton).toHaveAttribute(
          'aria-expanded',
          'true'
        )
        for (const appType of appTypes) {
          await expect(taskBoard.appTypeButton(appType)).toBeVisible()
        }

        await taskBoard.menuButton.click()
        await expect(taskBoard.navigation).toBeHidden()
        await expect(taskBoard.menuButton).toHaveAttribute(
          'aria-expanded',
          'false'
        )
      })

      test('Sign out is in the open menu and returns to the login form', async ({
        page,
      }) => {
        const taskBoard = new TaskBoardPage(page)
        await page.goto('/')
        await expect(taskBoard.signOutButton).toBeHidden()

        await taskBoard.menuButton.click()
        await expect(taskBoard.signOutButton).toBeVisible()
        await taskBoard.signOutButton.click()

        await expect(page.getByLabel(loginData.usernameLabel)).toBeVisible()
        await expect(taskBoard.navigation).toHaveCount(0)
      })

      test('the drawer works from the keyboard', async ({ page }) => {
        const taskBoard = new TaskBoardPage(page)
        await page.goto('/')

        await taskBoard.menuButton.focus()
        await page.keyboard.press('Enter')
        await expect(taskBoard.navigation).toBeVisible()

        // Focus moves into the drawer.
        await expect(taskBoard.appTypeButton(appTypes[0])).toBeFocused()

        // Escape closes it and hands focus back to the menu button.
        await page.keyboard.press('Escape')
        await expect(taskBoard.navigation).toBeHidden()
        await expect(taskBoard.menuButton).toBeFocused()
      })

      test('Tab walks the drawer buttons in order', async ({
        page,
        browserName,
      }) => {
        // Safari leaves buttons out of the Tab order unless a system setting is on; Linux WebKit (CI) does not.
        test.skip(
          browserName === 'webkit' && process.platform === 'darwin',
          'macOS WebKit does not Tab to buttons'
        )
        const taskBoard = new TaskBoardPage(page)
        await page.goto('/')
        await taskBoard.menuButton.focus()
        await page.keyboard.press('Enter')

        await expect(taskBoard.appTypeButton(appTypes[0])).toBeFocused()
        await page.keyboard.press('Tab')
        await expect(taskBoard.appTypeButton(appTypes[1])).toBeFocused()
      })
    })
  })
})
