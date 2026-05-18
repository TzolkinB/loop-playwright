/** Shape of `data/loginScenarios.json`. Fields are used as accessible text selectors in login tests. */
export interface LoginTypes {
  usernameLabel: string
  passwordLabel: string
  /** Accessible name of the submit button. */
  loginButton: string
  /** h1 heading text expected after a successful login. */
  defaultHeading: string
}
