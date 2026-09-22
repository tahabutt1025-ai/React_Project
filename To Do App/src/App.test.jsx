import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
})

async function addTodo(user, text) {
  const input = screen.getByLabelText(/new todo text/i)
  await user.type(input, text)
  await user.click(screen.getByRole('button', { name: /^add$/i }))
}

describe('Todo app', () => {
  it('shows empty state when there are no todos', () => {
    render(<App />)
    expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument()
  })

  it('adds a todo and updates the remaining count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTodo(user, 'Buy milk')
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
    expect(screen.getByText(/1 item left/i)).toBeInTheDocument()
  })

  it('marks a todo as completed and updates count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTodo(user, 'Wash car')
    const checkbox = screen.getByLabelText(/mark "wash car" as completed/i)
    await user.click(checkbox)
    expect(screen.getByText(/0 items left/i)).toBeInTheDocument()
  })

  it('edits a todo via the edit button', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTodo(user, 'Old text')
    await user.click(screen.getByRole('button', { name: /edit todo/i }))
    const editInput = screen.getByDisplayValue('Old text')
    await user.clear(editInput)
    await user.type(editInput, 'New text{Enter}')
    expect(screen.getByText('New text')).toBeInTheDocument()
    expect(screen.queryByText('Old text')).not.toBeInTheDocument()
  })

  it('deletes a todo', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTodo(user, 'Delete me')
    await user.click(screen.getByRole('button', { name: /delete todo/i }))
    expect(screen.queryByText('Delete me')).not.toBeInTheDocument()
    expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument()
  })

  it('filters todos by Active and Completed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTodo(user, 'Active task')
    await addTodo(user, 'Completed task')
    const completedCheckbox = screen.getByLabelText(
      /mark "completed task" as completed/i
    )
    await user.click(completedCheckbox)

    await user.click(screen.getByRole('button', { name: /^active$/i }))
    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.queryByText('Completed task')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^completed$/i }))
    expect(screen.getByText('Completed task')).toBeInTheDocument()
    expect(screen.queryByText('Active task')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^all$/i }))
    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.getByText('Completed task')).toBeInTheDocument()
  })

  it('clears completed todos only', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTodo(user, 'Keep me')
    await addTodo(user, 'Clear me')
    await user.click(
      screen.getByLabelText(/mark "clear me" as completed/i)
    )
    await user.click(screen.getByRole('button', { name: /clear completed/i }))
    expect(screen.getByText('Keep me')).toBeInTheDocument()
    expect(screen.queryByText('Clear me')).not.toBeInTheDocument()
  })

  it('persists todos to localStorage and reloads them', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)
    await addTodo(user, 'Persisted task')
    unmount()

    const stored = JSON.parse(window.localStorage.getItem('todos'))
    expect(stored).toHaveLength(1)
    expect(stored[0].text).toBe('Persisted task')

    render(<App />)
    expect(screen.getByText('Persisted task')).toBeInTheDocument()
  })

  it('disables Clear completed when nothing is completed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTodo(user, 'Task one')
    const clearBtn = screen.getByRole('button', { name: /clear completed/i })
    expect(clearBtn).toBeDisabled()
  })
})
