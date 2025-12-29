'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type SchoolType = 'vmbo' | 'havo' | 'vwo'

export interface NiveauSettings {
  schoolType: SchoolType | null
  leerjaar: number | null
}

export interface Progress {
  kiezen: { k1: boolean; k2: boolean }
  instrueren: { i1: boolean; i2: boolean; i3: boolean }
  evalueren: { e1: boolean; e2: boolean; e3: boolean }
  spelregels: { s1: boolean; s2: boolean; s3: boolean }
}

interface NiveauContextType {
  niveau: NiveauSettings
  progress: Progress
  setNiveau: (schoolType: SchoolType, leerjaar: number) => void
  updateProgress: (kiesLetter: keyof Progress, module: string, completed: boolean) => void
  resetProgress: () => void
  getNiveauLabel: () => string
  getLeerjaarOptions: () => number[]
}

const defaultProgress: Progress = {
  kiezen: { k1: false, k2: false },
  instrueren: { i1: false, i2: false, i3: false },
  evalueren: { e1: false, e2: false, e3: false },
  spelregels: { s1: false, s2: false, s3: false },
}

const NiveauContext = createContext<NiveauContextType | undefined>(undefined)

export function NiveauProvider({ children }: { children: ReactNode }) {
  const [niveau, setNiveauState] = useState<NiveauSettings>({
    schoolType: null,
    leerjaar: null,
  })
  const [progress, setProgress] = useState<Progress>(defaultProgress)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedNiveau = localStorage.getItem('kies-niveau')
    const savedProgress = localStorage.getItem('kies-progress')

    if (savedNiveau) {
      try {
        setNiveauState(JSON.parse(savedNiveau))
      } catch (e) {
        console.error('Error parsing saved niveau:', e)
      }
    }

    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress))
      } catch (e) {
        console.error('Error parsing saved progress:', e)
      }
    }

    setIsLoaded(true)
  }, [])

  // Save to localStorage when niveau changes
  useEffect(() => {
    if (isLoaded && niveau.schoolType && niveau.leerjaar) {
      localStorage.setItem('kies-niveau', JSON.stringify(niveau))
    }
  }, [niveau, isLoaded])

  // Save progress to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('kies-progress', JSON.stringify(progress))
    }
  }, [progress, isLoaded])

  const setNiveau = (schoolType: SchoolType, leerjaar: number) => {
    setNiveauState({ schoolType, leerjaar })
  }

  const updateProgress = (kiesLetter: keyof Progress, module: string, completed: boolean) => {
    setProgress(prev => ({
      ...prev,
      [kiesLetter]: {
        ...prev[kiesLetter],
        [module]: completed,
      },
    }))
  }

  const resetProgress = () => {
    setProgress(defaultProgress)
    localStorage.removeItem('kies-progress')
  }

  const getNiveauLabel = (): string => {
    if (!niveau.schoolType || !niveau.leerjaar) return ''
    return `${niveau.schoolType.toUpperCase()} ${niveau.leerjaar}`
  }

  const getLeerjaarOptions = (): number[] => {
    switch (niveau.schoolType) {
      case 'vmbo':
        return [1, 2, 3, 4]
      case 'havo':
        return [1, 2, 3, 4, 5]
      case 'vwo':
        return [1, 2, 3, 4, 5, 6]
      default:
        return []
    }
  }

  // Don't render children until localStorage is loaded to prevent hydration mismatch
  if (!isLoaded) {
    return null
  }

  return (
    <NiveauContext.Provider
      value={{
        niveau,
        progress,
        setNiveau,
        updateProgress,
        resetProgress,
        getNiveauLabel,
        getLeerjaarOptions,
      }}
    >
      {children}
    </NiveauContext.Provider>
  )
}

export function useNiveau() {
  const context = useContext(NiveauContext)
  if (context === undefined) {
    throw new Error('useNiveau must be used within a NiveauProvider')
  }
  return context
}
