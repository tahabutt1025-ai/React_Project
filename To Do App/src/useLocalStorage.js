import { useEffect, useState } from 'react'

/**
 * Persist state to localStorage under `key`.
 * Falls back gracefully if localStorage is unavailable or contains bad data.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch (err) {
      console.error(`Error reading localStorage key "${key}":`, err)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error(`Error writing localStorage key "${key}":`, err)
    }
  }, [key, value])

  return [value, setValue]
}
