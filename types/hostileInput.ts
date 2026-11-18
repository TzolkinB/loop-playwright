/** One hostile request body for POST /api/login. */
export interface LoginPayloadScenario {
  /** Short description, used as the test title. */
  name: string
  /** What kind of attack this stands for. */
  category: string
  /** Exact bytes of the request body, so duplicate keys, NUL and `__proto__` survive. */
  rawBody: string
  /** 400 when the body is malformed, 401 when it parses but cannot match the Demo user. */
  expectedStatus: 400 | 401
  /** Fragments of the payload that must never appear in the response. */
  mustNotEcho: string[]
}

/** One hostile request path for static file serving. */
export interface PathScenario {
  name: string
  category: string
  /** Request path, percent-encoded as it is sent on the wire. */
  path: string
  /** Fragments of files outside the build that must never appear in the response. */
  mustNotContain: string[]
}

/** One hostile value typed into the real login form. */
export interface FormPayloadScenario {
  name: string
  category: string
  username: string
  password: string
}

/** Shape of `data/hostileInputScenarios.json`. */
export interface HostileInputTypes {
  /** The one fixed message the login form is allowed to show for a rejected sign-in. */
  invalidMessage: string
  loginPayloads: LoginPayloadScenario[]
  pathTraversal: PathScenario[]
  formPayloads: FormPayloadScenario[]
}
