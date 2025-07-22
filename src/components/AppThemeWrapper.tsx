'use client'
import { useEffect } from 'react'

export default function AppThemeWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Auto-detect system theme preference
    const applySystemTheme = () => {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      if (systemPrefersDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    // Apply theme on initial load
    applySystemTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    mediaQuery.addEventListener('change', handleThemeChange)
    return () => mediaQuery.removeEventListener('change', handleThemeChange)
  }, [])

  return <>{children}</>
}