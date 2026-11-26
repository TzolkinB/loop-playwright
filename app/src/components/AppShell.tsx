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
    <main className="page shell" data-menu-open={menuOpen}>
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
          <span aria-hidden="true">{menuOpen ? '\u2715' : '\u2630'}</span>
        </button>
        <h1>Web Application</h1>
      </header>
      <AppNav open={menuOpen} onClose={closeMenu} onSignOut={onSignOut} />
      <section className="board" aria-label="Task board" tabIndex={0}>
        {webBoard.columns.map(column => (
          <Column key={column.name} {...column} />
        ))}
      </section>
    </main>
  )
}
