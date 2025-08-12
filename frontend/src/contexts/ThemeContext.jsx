import { createContext, useState, useEffect } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('whatsapp-theme')
    if (saved !== null) {
      return saved === 'dark'
    }
    // Default to light theme
    return false
  })

  useEffect(() => {
    // Update body class when theme changes
    const body = document.body
    if (isDark) {
      body.classList.add('dark')
    } else {
      body.classList.remove('dark')
    }
    // Save preference to localStorage
    localStorage.setItem('whatsapp-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  const value = {
    isDark,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
