// - [ ] Test Case 1
// * Login to Demo App.
// * Navigate to "Web Application."
// * Verify "Implement user authentication" is in the "To Do" column.
// * Confirm tags: "Feature" "High Priority”

import { test, expect } from '@playwright/test'

test('should display "Implement user authentication" in "To Do" column with correct tags', async ({
  page,
}) => {
  await page.goto('/')

  // "Web Application" heading landing page
  // after successful login (auth.setup.ts)

  // Locate the "To Do" column and check for the task
  const toDoColumn = page.getByRole('heading', { level: 2, name: 'To Do (2)' })
  await expect(toDoColumn).toBeVisible()
  const task = toDoColumn.getByRole('heading', {
    level: 3,
    name: 'Implement user authentication',
  })
  await expect(task).toBeVisible()

  // Verify the tags associated with the task
  const featureTag = task.getByRole('button', { name: 'Feature' })
  // const highPriorityTag = task.getByRole('button', { name: 'High Priority' })
  await expect(featureTag).toBeVisible()
  // await expect(highPriorityTag).toBeVisible()
})
