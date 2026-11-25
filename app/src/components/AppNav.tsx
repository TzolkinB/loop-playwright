import { useEffect, useRef } from 'react'

export const APP_TYPES = ['Web Application', 'Mobile Application'] as const

type Props = { open: boolean; onClose: () => void }

// One list serves both layouts: CSS makes it a sidebar from desktop width and a
// slide-in drawer below it, so the page never holds two copies of the buttons.
// Closed on a phone it is visibility:hidden, which also takes it out of the tab order.
export default function AppNav({ open, onClose }: Props) {
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
      className="app-nav glass"
      aria-label="Application types"
      data-open={open}
    >
      {APP_TYPES.map((type, index) => (
        <button
          key={type}
          type="button"
          ref={index === 0 ? firstButton : undefined}
        >
          <h2>{type}</h2>
        </button>
      ))}
    </nav>
  )
}
