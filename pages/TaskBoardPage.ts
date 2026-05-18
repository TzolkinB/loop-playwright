import { Page, Locator, expect } from '@playwright/test'
import { AppType, ColumnName, TagName } from '../types/taskBoard'

export default class TaskBoardPage {
  readonly page: Page
  /** h1 heading for the Mobile app view */
  readonly mobileAppHeading: Locator
  /** h2 heading inside the Mobile navigation button */
  readonly mobileNavHeading: Locator
  /** Button that toggles the Mobile task board view */
  readonly mobileNavigationButton: Locator

  constructor(page: Page) {
    this.page = page
    this.mobileAppHeading = this.page.getByRole('heading', {
      level: 1,
      name: AppType.MOBILE,
    })
    this.mobileNavHeading = this.page.getByRole('heading', {
      level: 2,
      name: AppType.MOBILE,
    })
    this.mobileNavigationButton = this.page
      .getByRole('button')
      .filter({ has: this.mobileNavHeading })
  }

  /**
   * Returns a locator scoped to the board column with the given name.
   * Matches the wrapping `div` that contains the column's h2 heading.
   */
  column(columnName: ColumnName): Locator {
    return this.page.locator('div').filter({
      has: this.page.getByRole('heading', {
        level: 2,
        name: columnName,
        exact: false,
      }),
    })
  }

  /**
   * Returns a locator for the column's h2 heading including its task count badge.
   * @param columnName - The column to target.
   * @param taskCount - Expected number of tasks shown in the heading, e.g. "To Do (3)".
   */
  columnHeading(columnName: ColumnName, taskCount: number): Locator {
    return this.page.getByRole('heading', {
      level: 2,
      name: `${columnName} (${taskCount})`,
    })
  }

  /**
   * Returns the h3 heading locator for a specific task card within a column.
   * @param columnName - The column that contains the task.
   * @param taskTitle - Exact title of the task card.
   */
  taskInColumn(columnName: ColumnName, taskTitle: string): Locator {
    const col = this.column(columnName)
    return col.getByRole('heading', {
      level: 3,
      name: taskTitle,
    })
  }

  /**
   * Returns a locator for a task card that matches both a title and one or more tags.
   * Filters progressively so every supplied tag must be present on the same card.
   * Uses `.last()` to resolve ambiguity when multiple wrapper divs match.
   * @param columnName - The column to search within.
   * @param taskTitle - Text that appears in the task card.
   * @param tags - One or more tag labels that must all appear on the card.
   */
  taskWithTags(
    columnName: ColumnName,
    taskTitle: string,
    ...tags: TagName[]
  ): Locator {
    const col = this.column(columnName)

    let taskLocator = col.locator('div').filter({ hasText: taskTitle })

    for (const tag of tags) {
      taskLocator = taskLocator.filter({ hasText: tag })
    }

    return taskLocator.last()
  }

  /**
   * Returns the h1 heading locator for the given application type.
   * Use this to assert which app's task board is currently displayed.
   */
  appHeading(appType: AppType): Locator {
    return this.page.getByRole('heading', {
      level: 1,
      name: appType,
    })
  }

  /**
   * Clicks the Mobile navigation button and waits for the Mobile app heading to be visible.
   * Use this to switch the board view to Mobile tasks.
   */
  async navigateToMobileTasks() {
    await this.mobileNavigationButton.click()
    await expect(this.mobileAppHeading).toBeVisible()
  }
}
