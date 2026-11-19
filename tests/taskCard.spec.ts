import { test, expect } from '@playwright/test'
import taskData from '../data/taskBoardScenarios.json'
import { TestScenario } from '../types/taskBoard'

const [scenario] = (taskData as TestScenario).scenarios

test('a task card shows its title as a heading and every tag', async ({
  page,
}) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { level: 3, name: scenario.taskTitle })
  ).toBeVisible()
  for (const tag of scenario.tags) {
    await expect(page.getByText(tag, { exact: true })).toBeVisible()
  }
})
