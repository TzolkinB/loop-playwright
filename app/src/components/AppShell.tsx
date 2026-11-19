import TaskCard from './TaskCard'

type Props = { onSignOut: () => void }

// Placeholder shell: the Task board and navigation arrive in later tickets.
export default function AppShell({ onSignOut }: Props) {
  return (
    <main className="page">
      <header className="shell-header glass">
        <h1>Web Application</h1>
        <button type="button" onClick={onSignOut}>
          Sign out
        </button>
      </header>
      {/* Stand-in card: the Column component and real board data replace it in later tickets. */}
      <TaskCard
        title="Implement user authentication"
        tags={['Feature', 'High Priority']}
      />
    </main>
  )
}
