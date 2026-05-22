import { useState } from 'react'
import TaskForm from './components/TaskForm.jsx'
import TaskList from './components/TaskList.jsx'
import './App.css'

const initialTasks = [
  {
    id: 1,
    title: 'Review project brief',
    details: 'Confirm scope, note open questions, and flag dependencies.',
    dueDate: 'Today',
    priority: 'High',
    completed: false,
  },
  {
    id: 2,
    title: 'Build task tracker layout',
    details: 'Split the UI into TaskList, TaskItem, and TaskForm components.',
    dueDate: 'Tomorrow',
    priority: 'Medium',
    completed: false,
  },
  {
    id: 3,
    title: 'Polish responsive styles',
    details: 'Check spacing, type scale, and mobile wrapping.',
    dueDate: 'Friday',
    priority: 'Low',
    completed: true,
  },
]

function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const completedCount = tasks.filter((task) => task.completed).length

  function addTask(task) {
    setTasks((currentTasks) => [
      {
        id: Date.now(),
        completed: false,
        ...task,
      },
      ...currentTasks,
    ])
  }

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  return (
    <main className="app-shell">
      <section className="tracker-header" aria-labelledby="tracker-title">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 id="tracker-title">Task Tracker</h1>
          <p className="intro">
            Keep priorities, due dates, and next steps visible in one focused
            view.
          </p>
        </div>

        <div className="summary" aria-label="Task summary">
          <span>
            <strong>{tasks.length}</strong>
            Total
          </span>
          <span>
            <strong>{completedCount}</strong>
            Done
          </span>
          <span>
            <strong>{tasks.length - completedCount}</strong>
            Open
          </span>
        </div>
      </section>

      <section className="tracker-grid" aria-label="Task workspace">
        <TaskForm onAddTask={addTask} />
        <TaskList tasks={tasks} onToggleTask={toggleTask} />
      </section>
    </main>
  )
}

export default App
