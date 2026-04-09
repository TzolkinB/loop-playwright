import { TestScenario } from '../types/testData'
import { LoginConstants } from '../types/loginData'
import taskBoardData from '../data/taskBoard.json'
import loginData from '../data/login.json'

export function getTaskBoardScenarios(): TestScenario {
  return taskBoardData as TestScenario
}

export function getLoginData(): LoginConstants {
  return loginData as LoginConstants
}
