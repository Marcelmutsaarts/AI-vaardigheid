'use client'

import { useState, useEffect, useCallback } from 'react'
import { useNiveau, Progress } from '@/contexts/NiveauContext'

const STORAGE_KEY = 'kies-module-progress'

/**
 * Hook that manages which modules have been completed.
 * Integrates with the existing NiveauContext progress system
 * and also maintains its own localStorage-based tracking.
 */
export function useModuleProgress() {
  const { progress } = useNiveau()
  const [localCompleted, setLocalCompleted] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount (SSR-safe)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setLocalCompleted(parsed)
        }
      }
    } catch (e) {
      console.error('Error loading module progress:', e)
    }
    setIsLoaded(true)
  }, [])

  // Derive completed modules from NiveauContext progress
  const getCompletedFromContext = useCallback((prog: Progress): string[] => {
    const completed: string[] = []
    if (prog.kiezen.k1) completed.push('k1')
    if (prog.kiezen.k2) completed.push('k2')
    if (prog.instrueren.i1) completed.push('i1')
    if (prog.instrueren.i2) completed.push('i2')
    if (prog.evalueren.e1) completed.push('e1')
    if (prog.evalueren.e2) completed.push('e2')
    if (prog.spelregels.s1) completed.push('s1')
    if (prog.spelregels.s2) completed.push('s2')
    if (prog.spelregels.s3) completed.push('s3')
    return completed
  }, [])

  // Merge both sources: NiveauContext progress + local progress
  const contextCompleted = getCompletedFromContext(progress)
  const completedModules = Array.from(
    new Set([...contextCompleted, ...localCompleted])
  )

  const markAsCompleted = useCallback((id: string) => {
    setLocalCompleted(prev => {
      if (prev.includes(id)) return prev
      const updated = [...prev, id]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error('Error saving module progress:', e)
      }
      return updated
    })
  }, [])

  const isCompleted = useCallback(
    (id: string) => completedModules.includes(id),
    [completedModules]
  )

  return {
    completedModules,
    markAsCompleted,
    isCompleted,
    isLoaded,
  }
}
