import { darkTheme, lightTheme } from './customTheme'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

const default_theme = 'light'

type appThemeProp = {
  children: React.ReactNode
}

type themeContextProp = {
  toggleTheme: () => void
}

const ThemeContext = createContext({} as themeContextProp)

export const useSetThemeContext = () => {
  const { toggleTheme } = useContext(ThemeContext)
  return toggleTheme
}

export const AppTheme = ({ children }: appThemeProp) => {
  const [themeMode, setThemeMode] = useState(default_theme)

  useEffect(() => {
    let initMode
    const localThemeMode = localStorage.getItem('theme-mode')
    switch (localThemeMode) {
      case 'dark':
        initMode = 'dark'
        break
      case 'light':
        initMode = 'light'
        break
      default:
        initMode = default_theme
    }
    setThemeMode(initMode)
    document.documentElement.classList.add(initMode)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeMode((prevThemeMode) => {
      const newThemeMode = prevThemeMode === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme-mode', newThemeMode)
      document.documentElement.classList.remove(prevThemeMode)
      document.documentElement.classList.add(newThemeMode)
      return newThemeMode
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
