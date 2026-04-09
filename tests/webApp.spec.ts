import { test, expect, Page } from '@playwright/test'

test.describe('Web Application Task Board', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  const toDoHeading = async (page: Page, number: number) => {
    const heading = page.getByRole('heading', {
      level: 2,
      name: `To Do (${number})`,
    })
    await expect(heading).toBeVisible()
    return heading
  }

  test('should display "Implement user authentication" in "To Do" column with correct tags', async ({
    page,
  }) => {
    // Step 1: Verify To Do column exists
    const columnHeading = await toDoHeading(page, 2)

    // Step 2: Find the authentication task within To Do column
    const todoColumn = page.locator('div').filter({ has: columnHeading })

    const taskHeading = todoColumn.getByRole('heading', {
      level: 3,
      name: 'Implement user authentication',
    })
    await expect(taskHeading).toBeVisible()

    // Step 3: Verify task has required tags - use first() to avoid strict mode violation
    const taskCard = todoColumn
      .locator('div')
      .filter({ hasText: 'Implement user authentication' })
      .filter({ hasText: 'Feature' })
      .filter({ hasText: 'High Priority' })
      .last()

    await expect(taskCard).toBeVisible()
  })

  test('should display "Fix navigation bug" in "To Do" column with correct tags', async ({
    page,
  }) => {
    // Step 1: Verify To Do column exists
    const columnHeading = await toDoHeading(page, 2)

    // Step 2: Find the navigation bug task within To Do column
    const todoColumn = page.locator('div').filter({ has: columnHeading })

    const taskHeading = todoColumn.getByRole('heading', {
      level: 3,
      name: 'Fix navigation bug',
    })
    await expect(taskHeading).toBeVisible()

    // Step 3: Verify task has required tag
    const taskCard = todoColumn
      .locator('div')
      .filter({ hasText: 'Fix navigation bug' })
      .filter({ hasText: 'Bug' })
      .last()

    await expect(taskCard).toBeVisible()
  })
})
