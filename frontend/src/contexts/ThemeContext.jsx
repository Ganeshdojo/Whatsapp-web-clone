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

  // Debug logging
  console.log('ThemeContext - isDark:', isDark)

  useEffect(() => {
    // Update body class when theme changes
    const body = document.body
    console.log('ThemeContext useEffect - setting body class, isDark:', isDark)
    
    if (isDark) {
      body.classList.add('dark')
      console.log('Added dark class to body')
    } else {
      body.classList.remove('dark')
      console.log('Removed dark class from body')
    }
    // Save preference to localStorage
    localStorage.setItem('whatsapp-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => {
    console.log('ThemeContext toggleTheme called, current isDark:', isDark)
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
