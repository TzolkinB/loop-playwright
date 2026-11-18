/** One sign-in attempt the Demo app must reject. */
export interface InvalidLoginScenario {
  /** Short description, used as the test title. */
  name: string
  /** Typed as given. When omitted, the Demo user's username is used so only the password is wrong. */
  username?: string
  password: string
  /** Exact text of the alert the form must show. */
  expectedAlert: string
}

/** Shape of `data/loginScenarios.json`. Fields are used as accessible text selectors in login tests. */
export interface LoginTypes {
  usernameLabel: string
  passwordLabel: string
  /** Accessible name of the submit button. */
  loginButton: string
  /** h1 heading text expected after a successful login. */
  defaultHeading: string
  /** Sign-in attempts that must be rejected, one test each. */
  invalidLogins: InvalidLoginScenario[]
}
