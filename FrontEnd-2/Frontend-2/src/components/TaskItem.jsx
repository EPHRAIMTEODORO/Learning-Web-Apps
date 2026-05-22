function TaskItem({ task }) {
  const statusText = task.completed ? 'Complete' : 'Open'

  return (
    <li className={`task-item ${task.completed ? 'is-complete' : ''}`}>
      <div className="task-check" aria-hidden="true">
        {task.completed ? '✓' : ''}
      </div>

      <div className="task-content">
        <div className="task-title-row">
          <h3>{task.title}</h3>
          <span className={`priority priority-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
        </div>

        <p>{task.details}</p>

        <div className="task-meta">
          <span>{task.dueDate}</span>
          <span>{statusText}</span>
        </div>
      </div>
    </li>
  )
}

export default TaskItem
