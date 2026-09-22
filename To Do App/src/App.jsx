import { useMemo, useState } from 'react'
import TodoItem from './TodoItem.jsx'
import { useLocalStorage } from './useLocalStorage.js'
import './App.css'

const FILTERS = {
  all: () => true,
  active: (todo) => !todo.completed,
  completed: (todo) => todo.completed,
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function App() {
  const [todos, setTodos] = useLocalStorage('todos', [])
  const [filter, setFilter] = useState('all')
  const [text, setText] = useState('')

  const addTodo = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setTodos((prev) => [
      { id: makeId(), text: trimmed, completed: false },
      ...prev,
    ])
    setText('')
  }

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const editTodo = (id, newText) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    )
  }

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }

  const filteredTodos = useMemo(
    () => todos.filter(FILTERS[filter]),
    [todos, filter]
  )

  const remainingCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos]
  )
  const completedCount = todos.length - remainingCount

  return (
    <div className="app-shell">
      <div className="todo-card">
        <h1 className="app-title">Todo List</h1>

        <form className="add-form" onSubmit={addTodo}>
          <input
            type="text"
            className="add-input"
            placeholder="What needs to be done?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="New todo text"
          />
          <button type="submit" className="add-btn">
            Add
          </button>
        </form>

        {todos.length === 0 ? (
          <div className="empty-state">
            <p>Nothing here yet</p>
            <span>Add your first task above to get started.</span>
          </div>
        ) : (
          <>
            <ul className="todo-list">
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEdit={editTodo}
                />
              ))}
            </ul>

            {filteredTodos.length === 0 && (
              <div className="empty-filter-state">
                No {filter === 'all' ? '' : filter} tasks to show.
              </div>
            )}

            <div className="footer">
              <span className="count">
                {remainingCount} {remainingCount === 1 ? 'item' : 'items'} left
              </span>

              <div className="filters" role="group" aria-label="Filter todos">
                {Object.keys(FILTERS).map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`filter-btn${filter === key ? ' active' : ''}`}
                    onClick={() => setFilter(key)}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="clear-btn"
                onClick={clearCompleted}
                disabled={completedCount === 0}
              >
                Clear completed
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
