import { createContext, useState, useEffect, useContext } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme ? JSON.parse(savedTheme) : false
  })

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDark))
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark')
      document.body.classList.add('dark-mode')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      document.body.classList.remove('dark-mode')
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook for using theme
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext