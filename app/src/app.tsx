import { useState } from 'react'
import { isSignedIn, signOut } from './auth'
import AppShell from './components/AppShell'
import Login from './components/Login'

export default function App() {
  const [signedIn, setSignedIn] = useState(isSignedIn)

  if (!signedIn) return <Login onSignedIn={() => setSignedIn(true)} />

  return (
    <AppShell
      onSignOut={() => {
        signOut()
        setSignedIn(false)
      }}
    />
  )
}
