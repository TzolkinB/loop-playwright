/** One viewport the Task board layout is checked at. */
export interface BoardLayoutScenario {
  /** Short description, used as the test title. */
  name: string
  width: number
  height: number
  /** `lanes`: columns scroll sideways and snap. `side-by-side`: all columns fit without scrolling. */
  layout: 'lanes' | 'side-by-side'
}

/** Shape of `data/boardLayoutScenarios.json`. */
export interface BoardLayoutTypes {
  /** Accessible name of the board region. */
  boardName: string
  /** Page padding in pixels that the first lane must sit at, flush to nothing. */
  edgePadding: number
  scenarios: BoardLayoutScenario[]
}
