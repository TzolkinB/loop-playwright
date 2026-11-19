import { test, expect } from '@playwright/test'
import layoutData from '../data/boardLayoutScenarios.json'
import { BoardLayoutTypes } from '../types/boardLayout'

const layoutSpec: BoardLayoutTypes = layoutData as BoardLayoutTypes

// The board's direct children are its columns, so measure those boxes.
const columnBoxes = (board: import('@playwright/test').Locator) =>
  board.evaluate(el => ({
    scrolls: el.scrollWidth > el.clientWidth,
    columns: [...el.children].map(column => {
      const { left, right, top, width } = column.getBoundingClientRect()
      return { left, right, top, width }
    }),
  }))

const lanes = layoutSpec.scenarios.filter(s => s.layout === 'lanes')
const sideBySide = layoutSpec.scenarios.filter(s => s.layout === 'side-by-side')

test.describe('Task board layout', () => {
  lanes.forEach(scenario => {
    test.describe(`${scenario.name} (${scenario.width}px)`, () => {
      test.use({
        viewport: { width: scenario.width, height: scenario.height },
      })

      test('columns are lanes that scroll and snap', async ({ page }) => {
        await page.goto('/')
        const board = page.getByRole('region', { name: layoutSpec.boardName })
        await expect(board).toBeVisible()

        // A scroll area only a mouse can scroll fails keyboard users, so it must take focus.
        await board.focus()
        await expect(board).toBeFocused()

        const { scrolls, columns } = await columnBoxes(board)

        // Side by side and wider than the screen, so the lanes scroll.
        expect(scrolls).toBe(true)
        expect(new Set(columns.map(c => Math.round(c.top))).size).toBe(1)
        // The first lane is not flush to the screen edge.
        expect(columns[0].left).toBeCloseTo(layoutSpec.edgePadding, 0)

        // After a scroll, the browser snaps a lane back to the padded edge.
        await board.evaluate(el =>
          el.scrollTo({ left: el.clientWidth * 0.6, behavior: 'instant' })
        )
        await expect
          .poll(async () => (await columnBoxes(board)).columns[1].left)
          .toBeCloseTo(layoutSpec.edgePadding, 0)
      })
    })
  })

  sideBySide.forEach(scenario => {
    test.describe(`${scenario.name} (${scenario.width}px)`, () => {
      test.use({
        viewport: { width: scenario.width, height: scenario.height },
      })

      test('all columns are visible side by side without scrolling', async ({
        page,
      }) => {
        await page.goto('/')
        const board = page.getByRole('region', { name: layoutSpec.boardName })
        await expect(board).toBeVisible()

        const { scrolls, columns } = await columnBoxes(board)

        // Every column is on screen at once, in one row, evenly sized.
        expect(scrolls).toBe(false)
        expect(new Set(columns.map(c => Math.round(c.top))).size).toBe(1)
        for (const column of columns) {
          expect(column.left).toBeGreaterThanOrEqual(0)
          expect(column.right).toBeLessThanOrEqual(scenario.width)
        }
        const widths = columns.map(c => c.width)
        expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1)
      })
    })
  })
})
