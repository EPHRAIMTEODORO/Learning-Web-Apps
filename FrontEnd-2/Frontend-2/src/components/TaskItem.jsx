function TaskItem({ task, onToggleTask }) {
  const statusText = task.completed ? 'Complete' : 'Open'

  return (
    <li className={`task-item ${task.completed ? 'is-complete' : ''}`}>
      <button
        type="button"
        className="task-check"
        aria-label={`Mark ${task.title} as ${
          task.completed ? 'open' : 'complete'
        }`}
        onClick={() => onToggleTask(task.id)}
      >
        {task.completed ? '✓' : ''}
      </button>

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
