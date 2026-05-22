import TaskItem from './TaskItem.jsx'

function TaskList({ tasks, onToggleTask }) {
  return (
    <section className="task-list-panel" aria-labelledby="task-list-title">
      <div className="panel-heading">
        <p className="eyebrow">Current work</p>
        <h2 id="task-list-title">Tasks</h2>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggleTask={onToggleTask} />
        ))}
      </ul>
    </section>
  )
}

export default TaskList
