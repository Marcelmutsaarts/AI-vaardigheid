'use client'

import { useRouter } from 'next/navigation'
import { getModuleById, getModulesByLetter, getLetterColor } from '@/lib/learning-path'

interface ProgressStepperProps {
  currentModuleId: string;
  completedModuleIds: string[];
}

export function ProgressStepper({ currentModuleId, completedModuleIds }: ProgressStepperProps) {
  const router = useRouter()

  const currentModule = getModuleById(currentModuleId)
  if (!currentModule) return null

  const letterModules = getModulesByLetter(currentModule.letter)
  const letterColor = getLetterColor(currentModule.letter)

  return (
    <div data-testid="progress-stepper" className="flex items-center justify-center gap-0 py-4 mb-2">
      {letterModules.map((mod, index) => {
        const isCompleted = completedModuleIds.includes(mod.id)
        const isCurrent = mod.id === currentModuleId

        // Connecting line before this dot (not for first item)
        const prevModule = index > 0 ? letterModules[index - 1] : null
        const prevCompleted = prevModule ? completedModuleIds.includes(prevModule.id) : false

        return (
          <div key={mod.id} className="flex items-center">
            {/* Connecting line */}
            {index > 0 && (
              <div
                className="h-0.5 w-8 sm:w-12"
                style={{
                  backgroundColor: prevCompleted ? '#10b981' : '#d1d5db',
                }}
              />
            )}

            {/* Dot + label container */}
            <div className="flex flex-col items-center">
              {/* Dot */}
              {isCompleted ? (
                <button
                  onClick={() => router.push(mod.path)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors hover:opacity-80 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 outline-none"
                  style={{ backgroundColor: '#10b981' }}
                  aria-label={`Ga naar ${mod.label} (afgerond)`}
                >
                  &#10003;
                </button>
              ) : isCurrent ? (
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{
                    backgroundColor: letterColor.bg,
                    boxShadow: `0 0 0 4px ${letterColor.bg}33`,
                  }}
                >
                  {mod.id.toUpperCase()}
                </div>
              ) : (
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: '#9ca3af' }}
                >
                  {mod.id.toUpperCase()}
                </div>
              )}

              {/* Label (only for current) */}
              {isCurrent && (
                <span
                  className="mt-1 text-xs sm:text-sm font-medium whitespace-nowrap"
                  style={{ color: letterColor.bg }}
                >
                  {mod.label}
                </span>
              )}

              {/* Invisible spacer for non-current to keep alignment */}
              {!isCurrent && (
                <span className="mt-1 text-xs sm:text-sm invisible whitespace-nowrap">
                  &nbsp;
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
