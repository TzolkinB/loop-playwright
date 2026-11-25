import { test, expect } from '@playwright/test'
import TaskBoardPage from '../pages/TaskBoardPage'
import navigationData from '../data/navigationScenarios.json'
import { AppType } from '../types/taskBoard'
import { NavigationTypes } from '../types/navigation'

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
    })
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

      test('choosing the backdrop closes the drawer', async ({ page }) => {
        const taskBoard = new TaskBoardPage(page)
        await page.goto('/')
        await taskBoard.menuButton.click()
        await expect(taskBoard.navigation).toBeVisible()

        // Click the strip right of the drawer, so the click lands on the backdrop itself.
        await taskBoard.backdrop.click({
          position: { x: scenario.width - 10, y: scenario.height / 2 },
        })

        await expect(taskBoard.navigation).toBeHidden()
        await expect(taskBoard.backdrop).toHaveCount(0)
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
