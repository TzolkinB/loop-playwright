import { TestScenario } from '../types/testData'
import { LoginConstants } from '../types/loginData'
import loginData from '../data/login.json'
import webTaskData from '../data/webTaskBoard.json'
import mobileTaskData from '../data/mobileTaskBoard.json'

export function getWebTaskBoardScenarios(): TestScenario {
  return webTaskData as TestScenario
}

export function getMobileTaskBoardScenarios(): TestScenario {
  return mobileTaskData as TestScenario
}

export function getLoginData(): LoginConstants {
  return loginData as LoginConstants
}
