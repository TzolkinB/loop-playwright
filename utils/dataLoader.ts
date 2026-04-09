import { TestScenario } from '../types/testData'
import taskBoardData from '../data/taskBoard.json'

export function getTaskBoardScenarios(): TestScenario {
  return taskBoardData as TestScenario
}
