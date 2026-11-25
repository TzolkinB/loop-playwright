import { useCallback, useRef, useState } from 'react'
import { webBoard } from '../data/boards'
import AppNav from './AppNav'
import Column from './Column'

type Props = { onSignOut: () => void }

// The Web Application board. Switching to the Mobile board arrives in a later ticket.
// Nothing here may wrap the board in a div: the page object finds columns as divs that contain the heading.
export default function AppShell({ onSignOut }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    menuButton.current?.focus()
  }, [])

  return (
    <main className="page shell">
      <header className="shell-header glass">
        <button
          ref={menuButton}
          type="button"
          className="menu-button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          aria-controls="app-nav"
          onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
        >
          <span aria-hidden="true">&#9776;</span>
        </button>
        <h1>Web Application</h1>
        <button type="button" onClick={onSignOut}>
          Sign out
        </button>
      </header>
      {menuOpen && (
        <button
          type="button"
          className="backdrop"
          aria-label="Close menu"
          tabIndex={-1}
          onClick={closeMenu}
        />
      )}
      <AppNav open={menuOpen} onClose={closeMenu} />
      <section className="board" aria-label="Task board" tabIndex={0}>
        {webBoard.columns.map(column => (
          <Column key={column.name} {...column} />
        ))}
      </section>
    </main>
  )
}
