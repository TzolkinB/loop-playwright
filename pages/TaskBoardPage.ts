import { Page, Locator, expect } from '@playwright/test'
import { AppHeading } from '../types/testData'

export default class TaskBoardPage {
  readonly page: Page
  readonly mobileNavHeading: Locator
  readonly mobileNavigationButton: Locator
  readonly mobileAppHeading: Locator

  constructor(page: Page) {
    this.page = page
    this.mobileAppHeading = this.page.getByRole('heading', {
      level: 1,
      name: AppHeading.MOBILE,
    })
    this.mobileNavHeading = this.page.getByRole('heading', {
      level: 2,
      name: AppHeading.MOBILE,
    })
    this.mobileNavigationButton = this.page
      .getByRole('button')
      .filter({ has: this.mobileNavHeading })
  }

  column(columnName: string): Locator {
    return this.page.locator('div').filter({
      has: this.page.getByRole('heading', {
        level: 2,
        name: columnName,
        exact: false,
      }),
    })
  }

  columnHeading(columnName: string, taskCount: number): Locator {
    return this.page.getByRole('heading', {
      level: 2,
      name: `${columnName} (${taskCount})`,
    })
  }

  taskInColumn(columnName: string, taskTitle: string): Locator {
    const col = this.column(columnName)
    return col.getByRole('heading', {
      level: 3,
      name: taskTitle,
    })
  }

  taskWithTags(
    columnName: string,
    taskTitle: string,
    ...tags: string[]
  ): Locator {
    const col = this.column(columnName)

    let taskLocator = col.locator('div').filter({ hasText: taskTitle })

    for (const tag of tags) {
      taskLocator = taskLocator.filter({ hasText: tag })
    }

    return taskLocator.last()
  }

  async navigateToMobileTasks() {
    await this.mobileNavigationButton.click()
    await expect(this.mobileAppHeading).toBeVisible()
  }
}
