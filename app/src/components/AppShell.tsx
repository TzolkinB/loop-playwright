import { webBoard } from '../data/boards'
import Column from './Column'

type Props = { onSignOut: () => void }

// The Web Application board. Switching to the Mobile board arrives in a later ticket.
export default function AppShell({ onSignOut }: Props) {
  return (
    <main className="page">
      <header className="shell-header glass">
        <h1>Web Application</h1>
        <button type="button" onClick={onSignOut}>
          Sign out
        </button>
      </header>
      <section className="board" aria-label="Task board" tabIndex={0}>
        {webBoard.columns.map(column => (
          <Column key={column.name} {...column} />
        ))}
      </section>
    </main>
  )
}
