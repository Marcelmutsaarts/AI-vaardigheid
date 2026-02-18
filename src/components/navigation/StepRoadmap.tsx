'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StepInfo {
  id: string
  label: string
  shortLabel: string
}

interface StepRoadmapProps {
  steps: StepInfo[]
  completedSteps: string[]
  activeStepId?: string
  color?: string
}

export default function StepRoadmap({
  steps,
  completedSteps,
  activeStepId,
  color = '#a15df5',
}: StepRoadmapProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id)
        const isActive = step.id === activeStepId
        const previousCompleted = index > 0 && completedSteps.includes(steps[index - 1].id)

        return (
          <div key={step.id} className="flex items-center">
            {/* Connection line */}
            {index > 0 && (
              <div
                className={cn('h-0.5 w-10 sm:w-16 transition-colors')}
                style={{
                  backgroundColor: previousCompleted ? color : '#d1d5db',
                }}
              />
            )}

            {/* Step dot + label */}
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all',
                  isCompleted && 'text-white',
                  isActive && !isCompleted && 'border-2 bg-white',
                  !isCompleted && !isActive && 'border-2 border-gray-300 bg-white text-gray-400'
                )}
                style={{
                  ...(isCompleted
                    ? { backgroundColor: color }
                    : isActive
                      ? {
                          borderColor: color,
                          color: color,
                          boxShadow: `0 0 0 3px ${color}20`,
                        }
                      : {}),
                }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" strokeWidth={3} />
                ) : (
                  step.shortLabel
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-xs mt-1.5 font-medium',
                  isCompleted && 'text-gray-700',
                  isActive && !isCompleted && 'text-gray-700',
                  !isCompleted && !isActive && 'text-gray-400'
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
