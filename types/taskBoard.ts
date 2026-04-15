export enum AppType {
  MOBILE = 'Mobile Application',
  WEB = 'Web Application',
}

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

export interface TaskBoardTypes {
  appType: AppType
  requiresNavigation: boolean
  taskTitle: string
  tags: TagName[]
  column: ColumnName
  taskCount: number
}

export interface TestScenario {
  scenarios: TaskBoardTypes[]
}
