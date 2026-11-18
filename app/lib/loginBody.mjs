export const MAX_FIELD_LENGTH = 256

/**
 * Checks that a parsed login request body has the expected shape: a string
 * `username` and a string `password`, each at most MAX_FIELD_LENGTH
 * characters. It never modifies the values, because
 * credentials are compared exactly as given.
 *
 * @param {unknown} body The parsed JSON body.
 * @returns {{ ok: true, username: string, password: string } | { ok: false }}
 */
export function validateLoginBody(body) {
  const { username, password } = /** @type {Record<string, unknown>} */ (
    body ?? {}
  )

  if (typeof username !== 'string' || typeof password !== 'string') {
    return { ok: false }
  }

  if (
    username.length > MAX_FIELD_LENGTH ||
    password.length > MAX_FIELD_LENGTH
  ) {
    return { ok: false }
  }

  return { ok: true, username, password }
}
