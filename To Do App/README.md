# Todo List App

A clean, modern Todo List web app built with **React + Vite + JavaScript**.

## Features

- Add new todos
- Edit existing todos (click the pencil icon or double-click the text)
- Delete todos
- Mark todos as completed
- Filter view: **All / Active / Completed**
- Clear all completed todos at once
- Live count of remaining (active) tasks
- Todos persist across page refreshes via `localStorage`
- Responsive layout for mobile and desktop
- Empty state shown when there are no todos

## Tech Stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/) — dev server and build tool
- Plain JavaScript (JSX), no TypeScript
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react) for tests
- ESLint for linting

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm

### Install dependencies

```bash
cd "To Do App"
npm install
```

### Run the dev server

```bash
npm run dev
```

This starts Vite's dev server (usually at `http://localhost:5173`) with hot module reloading.

### Build for production

```bash
npm run build
```

Outputs an optimized production build to the `dist/` folder.

### Preview the production build

```bash
npm run preview
```

### Run the test suite

```bash
npm test
```

Runs the Vitest suite, which covers adding, editing, deleting, toggling, filtering, clearing completed todos, the disabled state of "Clear completed", and `localStorage` persistence across remounts.

### Lint

```bash
npm run lint
```

## Project Structure

```
To Do App/
├── src/
│   ├── App.jsx            # Main app: state, add/edit/delete/toggle/filter logic
│   ├── App.css             # App styling (responsive, light/dark aware)
│   ├── TodoItem.jsx        # Single todo row (checkbox, text, edit, delete)
│   ├── useLocalStorage.js  # Reusable hook that syncs state to localStorage
│   ├── App.test.jsx        # Test suite (Vitest + Testing Library)
│   ├── setupTests.js       # Test environment setup (jest-dom matchers)
│   ├── main.jsx            # React entry point
│   └── index.css           # Global reset/base styles
├── index.html
├── vite.config.js
└── package.json
```

## How data persistence works

Todos are stored under the `todos` key in the browser's `localStorage` as JSON. Every time the todo list changes (add, edit, delete, toggle, clear completed), the updated array is written to `localStorage`, and on load the app reads it back — so your list survives page refreshes and browser restarts on the same device.
