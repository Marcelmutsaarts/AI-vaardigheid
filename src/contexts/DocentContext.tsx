'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface DocentContextType {
  isLoggedIn: boolean
  login: (password: string) => boolean
  logout: () => void
}

const DocentContext = createContext<DocentContextType | undefined>(undefined)

// Simpel wachtwoord voor docenten - in productie zou je dit via env variabele doen
const DOCENT_PASSWORD = 'kies2024'

export function DocentProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check localStorage voor bestaande sessie
    const session = localStorage.getItem('docent-session')
    if (session === 'active') {
      setIsLoggedIn(true)
    }
  }, [])

  const login = (password: string): boolean => {
    if (password === DOCENT_PASSWORD) {
      setIsLoggedIn(true)
      localStorage.setItem('docent-session', 'active')
      return true
    }
    return false
  }

  const logout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('docent-session')
  }

  return (
    <DocentContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </DocentContext.Provider>
  )
}

export function useDocent() {
  const context = useContext(DocentContext)
  if (context === undefined) {
    throw new Error('useDocent must be used within a DocentProvider')
  }
  return context
}
