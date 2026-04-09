export interface TaskTestCase {
  testName: string
  taskTitle: string
  tags: string[]
  taskCount: number
}

export interface TestScenario {
  tasks: TaskTestCase[]
}
