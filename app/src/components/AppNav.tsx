import { useEffect, useRef } from 'react'

export const APP_TYPES = ['Web Application', 'Mobile Application'] as const

// Only the Web board exists until switching arrives in a later ticket.
const CURRENT_TYPE: (typeof APP_TYPES)[number] = 'Web Application'

type Props = { open: boolean; onClose: () => void; onSignOut: () => void }

// One list serves both layouts: CSS makes it a sidebar from desktop width and a
// full-screen menu below it, so the page never holds two copies of the buttons.
// Closed on a phone it is visibility:hidden, which also takes it out of the tab order.
export default function AppNav({ open, onClose, onSignOut }: Props) {
  const firstButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    firstButton.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [open, onClose])

  return (
    <nav
      id="app-nav"
      className="app-nav"
      aria-label="Application types"
      data-open={open}
    >
      {APP_TYPES.map((type, index) => (
        <button
          key={type}
          type="button"
          ref={index === 0 ? firstButton : undefined}
          aria-current={type === CURRENT_TYPE ? 'page' : undefined}
        >
          {type}
        </button>
      ))}
      <button type="button" className="sign-out" onClick={onSignOut}>
        Sign out
      </button>
    </nav>
  )
}
