# Week 2

This app is a React task tracker built with smaller pieces called components.
The main page lives in `src/App.jsx`, and the task UI is split into
`TaskForm`, `TaskList`, and `TaskItem`.

## Components

Components are reusable functions that return UI. In this app, `App` is the
main component. It renders the page header, the task summary, the form, and the
task list.

The other components each have one job:

- `TaskForm` displays the form for creating a new task.
- `TaskList` receives the array of tasks and renders a list.
- `TaskItem` displays one task with its title, details, priority, due date, and
  completion status.

Splitting the app this way keeps each file focused and easier to update.

## Props

Props are values passed from one component to another. They let a parent
component share data or functions with child components.

In this app, `App` passes the `tasks` array into `TaskList`:

```jsx
<TaskList tasks={tasks} onToggleTask={toggleTask} />
```

`TaskList` then passes each individual `task` into `TaskItem`:

```jsx
<TaskItem key={task.id} task={task} onToggleTask={onToggleTask} />
```

`App` also passes the `addTask` function into `TaskForm` as `onAddTask`. That
lets the form send a new task back up to `App`.

## JSX

JSX is the HTML-like syntax used inside React components. It lets us describe
what should appear on the page while still using JavaScript values.

For example, `App` shows live task counts with JSX expressions:

```jsx
<strong>{tasks.length}</strong>
<strong>{completedCount}</strong>
```

The curly braces let JSX use JavaScript values inside the markup.

## useState

`useState` lets React remember values that can change over time. When state
changes, React updates the screen automatically.

In `App.jsx`, the tasks are stored in state:

```jsx
const [tasks, setTasks] = useState(initialTasks)
```

When a new task is submitted, `setTasks` adds it to the beginning of the list:

```jsx
setTasks((currentTasks) => [
  {
    id: Date.now(),
    completed: false,
    ...task,
  },
  ...currentTasks,
])
```

In `TaskForm.jsx`, `useState` also controls the form inputs:

```jsx
const [formData, setFormData] = useState(initialForm)
```

Each input uses a value from `formData`, and `handleChange` updates state when
the user types. This is called a controlled form because React controls the
input values.

Together, components, props, JSX, and `useState` make the task tracker work:
components organize the UI, props move data between components, JSX describes
the screen, and `useState` keeps the task list and form values updated.
