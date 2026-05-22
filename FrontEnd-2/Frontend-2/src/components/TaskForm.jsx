import { useState } from 'react'

const initialForm = {
  title: '',
  dueDate: '',
  priority: 'Medium',
  details: '',
}

function TaskForm({ onAddTask }) {
  const [formData, setFormData] = useState(initialForm)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!formData.title.trim()) {
      return
    }

    onAddTask({
      title: formData.title.trim(),
      dueDate: formData.dueDate || 'No date',
      priority: formData.priority,
      details: formData.details.trim() || 'No extra details added.',
    })

    setFormData(initialForm)
  }

  return (
    <form
      className="task-form"
      aria-labelledby="task-form-title"
      onSubmit={handleSubmit}
    >
      <div className="panel-heading">
        <p className="eyebrow">New task</p>
        <h2 id="task-form-title">Add Task</h2>
      </div>

      <label htmlFor="task-title">Task name</label>
      <input
        id="task-title"
        name="title"
        type="text"
        placeholder="Write a task name"
        value={formData.title}
        onChange={handleChange}
      />

      <label htmlFor="task-date">Due date</label>
      <input
        id="task-date"
        name="dueDate"
        type="date"
        value={formData.dueDate}
        onChange={handleChange}
      />

      <label htmlFor="task-priority">Priority</label>
      <select
        id="task-priority"
        name="priority"
        value={formData.priority}
        onChange={handleChange}
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <label htmlFor="task-notes">Notes</label>
      <textarea
        id="task-notes"
        name="details"
        placeholder="Add details or reminders"
        rows="4"
        value={formData.details}
        onChange={handleChange}
      />

      <button type="submit">Add Task</button>
    </form>
  )
}

export default TaskForm
