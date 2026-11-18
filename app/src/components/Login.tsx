import { useState, type FormEvent } from 'react'
import { signIn } from '../auth'

const MESSAGES = {
  invalid: 'Invalid username or password.',
  error: 'Something went wrong. Please try again.',
}

type Props = { onSignedIn: () => void }

export default function Login({ onSignedIn }: Props) {
  const [message, setMessage] = useState<string>()
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setPending(true)
    setMessage(undefined)

    const result = await signIn(
      String(data.get('username')),
      String(data.get('password'))
    )

    setPending(false)
    if (result === 'signed-in') onSignedIn()
    else setMessage(MESSAGES[result])
  }

  return (
    <main className="page">
      <form className="login" onSubmit={handleSubmit}>
        <h1>Task Board Demo</h1>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" autoComplete="username" required />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        {message && <p role="alert">{message}</p>}
        <button type="submit" disabled={pending}>
          Sign in
        </button>
      </form>
    </main>
  )
}
