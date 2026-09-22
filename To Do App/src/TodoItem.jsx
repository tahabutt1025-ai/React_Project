import { useEffect, useRef, useState } from 'react'

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const startEdit = () => {
    setDraft(todo.text)
    setIsEditing(true)
  }

  const commitEdit = () => {
    const trimmed = draft.trim()
    if (trimmed.length === 0) {
      onDelete(todo.id)
    } else {
      onEdit(todo.id, trimmed)
    }
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setDraft(todo.text)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <label className="todo-checkbox-wrap">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`Mark "${todo.text}" as ${todo.completed ? 'active' : 'completed'}`}
        />
        <span className="checkmark" aria-hidden="true"></span>
      </label>

      {isEditing ? (
        <input
          ref={inputRef}
          className="todo-edit-input"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span className="todo-text" onDoubleClick={startEdit}>
          {todo.text}
        </span>
      )}

      <div className="todo-actions">
        {!isEditing && (
          <button
            type="button"
            className="icon-btn edit-btn"
            onClick={startEdit}
            aria-label="Edit todo"
            title="Edit"
          >
            ✎
          </button>
        )}
        <button
          type="button"
          className="icon-btn delete-btn"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete todo"
          title="Delete"
        >
          ✕
        </button>
      </div>
    </li>
  )
}

export default TodoItem
