/**
 * Checks that a parsed login request body has the expected shape: a string
 * `username` and a string `password`. It never modifies the values, because
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

  return { ok: true, username, password }
}
