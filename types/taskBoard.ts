export enum ColumnName {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export enum TagName {
  FEATURE = 'Feature',
  HIGH_PRIORITY = 'High Priority',
  BUG = 'Bug',
  DESIGN = 'Design',
}

export enum AppHeading {
  MOBILE = 'Mobile Application',
  WEB = 'Web Application',
}

export interface TaskTestCase {
  testName: string
  taskTitle: string
  tags: TagName[]
  column: ColumnName
  taskCount: number
}

export interface TestScenario {
  tasks: TaskTestCase[]
}
