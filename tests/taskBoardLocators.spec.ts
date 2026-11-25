import { test, expect } from '@playwright/test'
import TaskBoardPage from '../pages/TaskBoardPage'
import { ColumnName, TagName } from '../types/taskBoard'

// Two Web board cards that sit in different columns. The Demo app is static,
// so the swap is done in the DOM: the card counts per column stay correct, but
// each card is now in the other column.
const first = {
  title: 'Harden login input validation',
  column: ColumnName.TODO,
  tags: [TagName.FEATURE, TagName.HIGH_PRIORITY],
}
const second = {
  title: 'Update glass theme tokens',
  column: ColumnName.IN_PROGRESS,
  tags: [TagName.DESIGN],
}

test.describe('Task board locators tell the columns apart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('each column is a region named by its heading', async ({ page }) => {
    for (const name of Object.values(ColumnName)) {
      await expect(
        page.getByRole('region', { name: new RegExp(`^${name} \\(\\d+\\)$`) })
      ).toHaveCount(1)
    }
  })

  test('a card is found in its own column and not in another', async ({
    page,
  }) => {
    const board = new TaskBoardPage(page)

    await expect(board.taskInColumn(first.column, first.title)).toBeVisible()
    await expect(board.taskInColumn(second.column, first.title)).toHaveCount(0)
    await expect(
      board.taskWithTags(second.column, first.title, ...first.tags)
    ).toHaveCount(0)
  })

  test('a card is found by its tags, and a wrong tag does not match', async ({
    page,
  }) => {
    const board = new TaskBoardPage(page)

    // Positive: every tag the card shows is accepted.
    await expect(
      board.taskWithTags(first.column, first.title, ...first.tags)
    ).toBeVisible()
    await expect(
      board.taskWithTags(second.column, second.title, ...second.tags)
    ).toBeVisible()

    // Negative: the card is in this column, so only the tag can rule it out.
    await expect(
      board.taskWithTags(first.column, first.title, TagName.DESIGN)
    ).toHaveCount(0)
    await expect(
      board.taskWithTags(
        first.column,
        first.title,
        ...first.tags,
        TagName.DESIGN
      )
    ).toHaveCount(0)
  })

  test('swapping two cards between columns makes their locators fail', async ({
    page,
  }) => {
    const board = new TaskBoardPage(page)

    // Swap the two cards' places, keeping every column's count the same.
    await page.evaluate(
      ([a, b]) => {
        const card = (title: string) =>
          [...document.querySelectorAll('h3')].find(
            h3 => h3.textContent === title
          )!.parentElement!
        const cardA = card(a)
        const cardB = card(b)
        const marker = document.createComment('swap')
        cardA.replaceWith(marker)
        cardB.replaceWith(cardA)
        marker.replaceWith(cardB)
      },
      [first.title, second.title]
    )

    await expect(board.taskInColumn(first.column, first.title)).toHaveCount(0)
    await expect(board.taskInColumn(second.column, second.title)).toHaveCount(0)
    await expect(
      board.taskWithTags(first.column, first.title, ...first.tags)
    ).toHaveCount(0)
    await expect(
      board.taskWithTags(second.column, second.title, ...second.tags)
    ).toHaveCount(0)

    // The cards are now where the swap put them.
    await expect(board.taskInColumn(second.column, first.title)).toBeVisible()
    await expect(board.taskInColumn(first.column, second.title)).toBeVisible()
  })
})
