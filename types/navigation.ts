/** One viewport the Application navigation is checked at. */
export interface NavigationScenario {
  /** Short description, used as the test title. */
  name: string
  width: number
  height: number
  /** `sidebar`: always shown, no menu button. `drawer`: opened from the menu button. */
  navigation: 'sidebar' | 'drawer'
}

/** Shape of `data/navigationScenarios.json`. */
export interface NavigationTypes {
  /** Accessible name of the navigation landmark. */
  navigationName: string
  /** Accessible name of the button that opens and closes the drawer. */
  menuButtonName: string
  /** Accessible name of the backdrop behind the open drawer. */
  backdropName: string
  /** The Application types listed, in order. */
  appTypes: string[]
  scenarios: NavigationScenario[]
}
