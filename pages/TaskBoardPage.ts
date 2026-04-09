import { Page, Locator } from '@playwright/test'

export default class TaskBoardPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  column(columnName: string): Locator {
    return this.page.locator('div').filter({
      has: this.page.getByRole('heading', {
        level: 2,
        name: new RegExp(`^${columnName}`),
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
}
