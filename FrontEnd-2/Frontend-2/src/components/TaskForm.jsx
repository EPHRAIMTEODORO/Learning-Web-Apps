function TaskForm() {
  return (
    <form className="task-form" aria-labelledby="task-form-title">
      <div className="panel-heading">
        <p className="eyebrow">New task</p>
        <h2 id="task-form-title">Add Task</h2>
      </div>

      <label htmlFor="task-title">Task name</label>
      <input id="task-title" type="text" placeholder="Write a task name" />

      <label htmlFor="task-date">Due date</label>
      <input id="task-date" type="date" />

      <label htmlFor="task-priority">Priority</label>
      <select id="task-priority" defaultValue="Medium">
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <label htmlFor="task-notes">Notes</label>
      <textarea
        id="task-notes"
        placeholder="Add details or reminders"
        rows="4"
      />

      <button type="button">Add Task</button>
    </form>
  )
}

export default TaskForm
