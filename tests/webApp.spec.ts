import { test, expect } from '@playwright/test'
import TaskBoardPage from '../pages/TaskBoardPage'
import webTaskData from '../data/webTaskBoard.json'
import { TestScenario } from '../types/taskBoard'

test.describe('Web Application Task Board', () => {
  const testScenarios: TestScenario = webTaskData as TestScenario

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  testScenarios.tasks.forEach(taskData => {
    test(taskData.testName, async ({ page }) => {
      const taskBoard = new TaskBoardPage(page)
      // Step 1: Verify column heading (includes task count when provided)
      await expect(
        taskBoard.columnHeading(taskData.column, taskData.taskCount)
      ).toBeVisible()

      // Step 2: Find the task within the column
      await expect(
        taskBoard.taskInColumn(taskData.column, taskData.taskTitle)
      ).toBeVisible()

      // Step 3: Verify task has required tags
      const task = taskBoard.taskWithTags(
        taskData.column,
        taskData.taskTitle,
        ...taskData.tags
      )
      await expect(task).toBeVisible()
    })
  })
})
