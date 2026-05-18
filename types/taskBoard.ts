/** The application whose task board is under test. */
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

/** Shape of a single test scenario entry in `data/taskBoardScenarios.json`. */
export interface TaskBoardTypes {
  /** Maps to the h1 heading on the page. */
  appType: AppType
  /** When `true`, the test clicks the Mobile navigation button before asserting. */
  requiresNavigation: boolean
  taskTitle: string
  /** All supplied tags must be present on the task card. */
  tags: TagName[]
  column: ColumnName
  /** Expected number shown in the column heading badge, e.g. "To Do (2)". */
  taskCount: number
}

/** Root shape of `data/taskBoardScenarios.json`. */
export interface TestScenario {
  scenarios: TaskBoardTypes[]
}
