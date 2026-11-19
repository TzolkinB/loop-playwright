import type { ColumnData } from '../data/boards'
import TaskCard from './TaskCard'

// A div, not a section: the suite's page object finds columns as divs that contain the heading.
export default function Column({ name, tasks }: ColumnData) {
  return (
    <div className="column glass">
      <h2>
        {name} ({tasks.length})
      </h2>
      {tasks.length === 0 ? (
        <p className="empty">No tasks</p>
      ) : (
        tasks.map(task => <TaskCard key={task.title} {...task} />)
      )}
    </div>
  )
}
