import { test, expect } from '@playwright/test'
import TaskBoardPage from '../pages/TaskBoardPage'
import { getTaskBoardScenarios } from '../utils/dataLoader'

test.describe('Web Application Task Board', () => {
  let taskBoard: TaskBoardPage
  const testScenarios = getTaskBoardScenarios()

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    taskBoard = new TaskBoardPage(page)
  })

  testScenarios.tasks.forEach(taskData => {
    test(taskData.testName, async () => {
      // Step 1: Verify To Do column exists
      await expect(taskBoard.toDoHeading(taskData.taskCount)).toBeVisible()

      // Step 2: Find the task within To Do column
      await expect(
        taskBoard.taskInToDoColumn(taskData.taskCount, taskData.taskTitle)
      ).toBeVisible()

      // Step 3: Verify task has required tags
      const task = taskBoard.taskWithTags(
        taskData.taskCount,
        taskData.taskTitle,
        ...taskData.tags
      )
      await expect(task).toBeVisible()
    })
  })
})
