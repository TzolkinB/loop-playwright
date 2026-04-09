import { Page, Locator } from '@playwright/test'

export default class TaskBoardPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  toDoHeading(taskCount: number): Locator {
    return this.page.getByRole('heading', {
      level: 2,
      name: `To Do (${taskCount})`,
    })
  }

  toDoColumn(taskCount: number): Locator {
    const heading = this.toDoHeading(taskCount)
    return this.page.locator('div').filter({ has: heading })
  }

  taskInToDoColumn(taskCount: number, taskTitle: string): Locator {
    const todoColumn = this.toDoColumn(taskCount)
    return todoColumn.getByRole('heading', {
      level: 3,
      name: taskTitle,
    })
  }

  taskWithTags(
    taskCount: number,
    taskTitle: string,
    ...tags: string[]
  ): Locator {
    const todoColumn = this.toDoColumn(taskCount)

    let taskLocator = todoColumn.locator('div').filter({ hasText: taskTitle })

    for (const tag of tags) {
      taskLocator = taskLocator.filter({ hasText: tag })
    }

    return taskLocator.last()
  }
}
