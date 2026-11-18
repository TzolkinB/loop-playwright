// Minimal by design: the server checks credentials, and the browser only remembers that it signed in.
const SIGNED_IN_KEY = 'demo.signedIn'

export function isSignedIn(): boolean {
  try {
    return localStorage.getItem(SIGNED_IN_KEY) === 'true'
  } catch {
    return false
  }
}

export type SignInResult = 'signed-in' | 'invalid' | 'error'

export async function signIn(
  username: string,
  password: string
): Promise<SignInResult> {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (response.status === 401) return 'invalid'
    if (!response.ok) return 'error'

    localStorage.setItem(SIGNED_IN_KEY, 'true')
    return 'signed-in'
  } catch {
    return 'error'
  }
}

export function signOut(): void {
  try {
    localStorage.removeItem(SIGNED_IN_KEY)
  } catch {
    // Nothing stored, nothing to clear.
  }
}
