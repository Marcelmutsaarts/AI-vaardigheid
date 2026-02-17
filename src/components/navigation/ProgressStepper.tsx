'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { useNiveau } from '@/contexts/NiveauContext'
import { kiesStructuur, isLetterComplete } from '@/lib/navigation'
import { cn } from '@/lib/utils'

interface ProgressStepperProps {
  activeLetter: 'kiezen' | 'instrueren' | 'evalueren' | 'spelregels'
  activeSubStep?: string // 'k1', 'k2', etc. - optional, not shown on overview pages
}

export default function ProgressStepper({ activeLetter, activeSubStep }: ProgressStepperProps) {
  const { progress } = useNiveau()

  return (
    <div className="w-full flex flex-col items-center py-3 sm:py-4">
      {/* Letter circles with connection lines */}
      <div className="flex items-center gap-0">
        {kiesStructuur.map((letter, index) => {
          const completed = isLetterComplete(letter.key, progress)
          const isActive = letter.key === activeLetter
          const previousCompleted = index > 0 ? isLetterComplete(kiesStructuur[index - 1].key, progress) : false

          return (
            <div key={letter.key} className="flex items-center">
              {/* Connection line before this circle (not for the first) */}
              {index > 0 && (
                <div
                  className={cn(
                    'h-0.5 w-6 sm:w-10',
                    previousCompleted ? 'bg-green-500' : 'bg-gray-200'
                  )}
                />
              )}

              {/* Letter circle + substep dots column */}
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={cn(
                    'flex items-center justify-center rounded-full font-semibold transition-transform duration-200',
                    // Size
                    'w-8 h-8 text-xs sm:w-10 sm:h-10 sm:text-sm',
                    // States
                    completed && 'bg-green-500 text-white',
                    isActive && !completed && 'text-white scale-110 ring-2 ring-offset-2',
                    !isActive && !completed && 'bg-gray-200 text-gray-400'
                  )}
                  style={
                    isActive && !completed
                      ? {
                          backgroundColor: letter.color,
                          '--tw-ring-color': letter.color,
                          boxShadow: `0 0 8px ${letter.color}40`,
                        } as React.CSSProperties
                      : undefined
                  }
                >
                  {completed ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
                  ) : (
                    letter.letter
                  )}
                </div>

                {/* Substep dots - only shown for the active letter */}
                {isActive && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {letter.subSteps.map((subStep) => {
                      const letterProgress = progress[letter.key] as Record<string, boolean>
                      const subCompleted = letterProgress[subStep.id]

                      return (
                        <div
                          key={subStep.id}
                          className={cn(
                            'w-2 h-2 rounded-full transition-colors',
                            subCompleted
                              ? '' // filled with letter color via style
                              : 'border border-gray-300 bg-transparent'
                          )}
                          style={subCompleted ? { backgroundColor: letter.color } : undefined}
                        />
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
