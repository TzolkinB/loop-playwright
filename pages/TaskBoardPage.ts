import { Page, Locator, expect } from '@playwright/test'
import navigationData from '../data/navigationScenarios.json'
import { AppType, ColumnName, TagName } from '../types/taskBoard'

export default class TaskBoardPage {
  readonly page: Page
  /** h1 heading for the Mobile app view */
  readonly mobileAppHeading: Locator
  /** h2 heading inside the Mobile navigation button */
  readonly mobileNavHeading: Locator
  /** Button that toggles the Mobile task board view */
  readonly mobileNavigationButton: Locator

  /** Landmark that lists the Application types: the sidebar, or the drawer on narrow screens */
  readonly navigation: Locator
  /** Button that opens and closes the drawer; absent when the sidebar shows */
  readonly menuButton: Locator
  /** Backdrop behind the open drawer; choosing it closes the drawer */
  readonly backdrop: Locator

  constructor(page: Page) {
    this.page = page
    this.navigation = this.page.getByRole('navigation', {
      name: navigationData.navigationName,
    })
    this.menuButton = this.page.getByRole('button', {
      name: navigationData.menuButtonName,
      exact: true,
    })
    this.backdrop = this.page.getByRole('button', {
      name: navigationData.backdropName,
      exact: true,
    })
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
   * Returns the navigation button for an Application type: a button that wraps
   * the type's level-2 heading.
   */
  appTypeButton(appType: AppType): Locator {
    return this.navigation.getByRole('button').filter({
      has: this.page.getByRole('heading', { level: 2, name: appType }),
    })
  }

  /**
   * Returns a locator scoped to the board column with the given name.
   * Each column is a region named by its heading, e.g. "To Do (2)", so the
   * count is matched loosely and the column name exactly.
   */
  column(columnName: ColumnName): Locator {
    return this.page.getByRole('region', {
      name: new RegExp(`^${columnName} \\(\\d+\\)$`),
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
    return this.column(columnName).getByRole('heading', {
      level: 3,
      name: taskTitle,
      exact: true,
    })
  }

  /**
   * Returns a locator for the task card (a list item) in a column whose title
   * heading matches and that shows every supplied tag.
   * @param columnName - The column to search within.
   * @param taskTitle - Exact title of the task card.
   * @param tags - One or more tag labels that must all appear on the card.
   */
  taskWithTags(
    columnName: ColumnName,
    taskTitle: string,
    ...tags: TagName[]
  ): Locator {
    let card = this.column(columnName)
      .getByRole('listitem')
      .filter({
        has: this.page.getByRole('heading', {
          level: 3,
          name: taskTitle,
          exact: true,
        }),
      })

    for (const tag of tags) {
      card = card.filter({ has: this.page.getByText(tag, { exact: true }) })
    }

    return card
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
