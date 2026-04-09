export interface TaskTestCase {
  testName: string
  taskTitle: string
  tags: string[]
  column: string
  taskCount: number
}

export interface TestScenario {
  tasks: TaskTestCase[]
}
