import { test, expect } from '@playwright/test'
import TaskBoardPage from '../pages/TaskBoardPage'
import taskData from '../data/taskBoardScenarios.json'
import { TestScenario } from '../types/taskBoard'

test.describe('Web/Mobile Application Task Board', () => {
  const testScenarios: TestScenario = taskData as TestScenario

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  testScenarios.scenarios.forEach(taskData => {
    test(`should display ${taskData.taskTitle} in ${taskData.column} column with ${taskData.tags.join(', ')} tags`, async ({
      page,
    }) => {
      const taskBoard = new TaskBoardPage(page)

      // Navigate to the mobile tasks view if required by the scenario
      if (taskData.requiresNavigation) {
        await taskBoard.navigateToMobileTasks()
      }

      // Step 1: Assert user is on correct app view
      await expect(taskBoard.appHeading(taskData.appType)).toBeVisible()

      // Step 2: Verify column heading (includes task count when provided)
      await expect(
        taskBoard.columnHeading(taskData.column, taskData.taskCount)
      ).toBeVisible()

      // Step 3: Find the task within the column
      await expect(
        taskBoard.taskInColumn(taskData.column, taskData.taskTitle)
      ).toBeVisible()

      // Step 4: Verify task has required tags
      const task = taskBoard.taskWithTags(
        taskData.column,
        taskData.taskTitle,
        ...taskData.tags
      )
      await expect(task).toBeVisible()
    })
  })
})
