import { test, expect } from '@playwright/test'
import TaskBoardPage from '../pages/TaskBoardPage'

test.describe('Web Application Task Board', () => {
  let taskBoard: TaskBoardPage

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    taskBoard = new TaskBoardPage(page)
  })

  test('should display "Implement user authentication" in "To Do" column with correct tags', async () => {
    // Step 1: Verify To Do column exists
    await expect(taskBoard.toDoHeading(2)).toBeVisible()

    // Step 2: Find the authentication task within To Do column
    await expect(
      taskBoard.taskInToDoColumn(2, 'Implement user authentication')
    ).toBeVisible()

    // Step 3: Verify task has required tags - use first() to avoid strict mode violation
    const task = taskBoard.taskWithTags(
      2,
      'Implement user authentication',
      'Feature',
      'High Priority'
    )
    await expect(task).toBeVisible()
  })

  test('should display "Fix navigation bug" in "To Do" column with correct tags', async () => {
    // Step 1: Verify To Do column exists
    await expect(taskBoard.toDoHeading(2)).toBeVisible()

    // Step 2: Find the navigation bug task within To Do column
    await expect(
      taskBoard.taskInToDoColumn(2, 'Fix navigation bug')
    ).toBeVisible()

    // Step 3: Verify task has required tag
    const task = taskBoard.taskWithTags(2, 'Fix navigation bug', 'Bug')
    await expect(task).toBeVisible()
  })
})
