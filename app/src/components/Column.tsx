import { useId } from 'react'
import type { ColumnData } from '../data/boards'
import TaskCard from './TaskCard'

// A labelled region named by its heading, so the suite finds a column by role and name.
export default function Column({ name, tasks }: ColumnData) {
  const headingId = useId()

  return (
    <section className="column glass" aria-labelledby={headingId}>
      <h2 id={headingId}>
        {name} ({tasks.length})
      </h2>
      {tasks.length === 0 ? (
        <p className="empty">No tasks</p>
      ) : (
        <ul className="cards">
          {tasks.map(task => (
            <TaskCard key={task.title} {...task} />
          ))}
        </ul>
      )}
    </section>
  )
}
