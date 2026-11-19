import { describe, expect, it } from 'vitest'
import scenarioData from '../data/taskBoardScenarios.json'
import { webBoard } from '../app/src/data/boards'

// The Demo app's task data is invented for the demo. The Scenario data is what
// the suite expects to see, so the two must say the same thing.
const webScenarios = scenarioData.scenarios.filter(
  scenario => scenario.appType === 'Web Application'
)

describe('Web Application board data matches the Scenarios', () => {
  it.each(webScenarios)(
    'has "$taskTitle" in $column with its tags and the right count',
    scenario => {
      const column = webBoard.columns.find(
        candidate => candidate.name === scenario.column
      )
      const task = column?.tasks.find(
        candidate => candidate.title === scenario.taskTitle
      )

      expect(column?.tasks).toHaveLength(scenario.taskCount)
      expect(task?.tags).toEqual(scenario.tags)
    }
  )

  it('has no task the Scenarios do not cover', () => {
    const appTitles = webBoard.columns.flatMap(column =>
      column.tasks.map(task => task.title)
    )

    expect(appTitles.sort()).toEqual(
      webScenarios.map(scenario => scenario.taskTitle).sort()
    )
  })

  it('has the three columns in order, including the empty one', () => {
    expect(webBoard.columns.map(column => column.name)).toEqual([
      'To Do',
      'In Progress',
      'Done',
    ])
  })
})
