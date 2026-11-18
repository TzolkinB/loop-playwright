/** The Demo user's credentials, read from the environment. Fails fast with a clear message if either is missing. */
export function credentials(): { username: string; password: string } {
  const username = process.env.USER_NAME
  const password = process.env.PASSWORD

  if (!username || !password) {
    throw new Error(
      'Missing USER_NAME or PASSWORD. Copy .env.example to .env and set both values.'
    )
  }

  return { username, password }
}
