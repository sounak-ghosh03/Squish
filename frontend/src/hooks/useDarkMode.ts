import { useEffect, useState } from 'react'

export function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('theme') === 'dark'
    } catch {
      return false
    }
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    } catch {
      // ignore storage errors
    }
  }, [dark])

  return { dark, toggle: () => setDark((d) => !d) }
}
