'use client'

import { getK2Phases, getLetterColor } from '@/lib/learning-path'

interface K2PhaseStepperProps {
  currentPhaseId: string;
  completedPhaseIds: string[];
  onPhaseClick?: (phaseId: string) => void;
}

export function K2PhaseStepper({ currentPhaseId, completedPhaseIds, onPhaseClick }: K2PhaseStepperProps) {
  const phases = getK2Phases()
  const letterColor = getLetterColor('K')

  return (
    <div data-testid="k2-phase-stepper" className="flex items-center justify-center gap-0 py-3 mb-2">
      {phases.map((phase, index) => {
        const isCompleted = completedPhaseIds.includes(phase.id)
        const isCurrent = phase.id === currentPhaseId
        const isFuture = !isCompleted && !isCurrent

        // Connecting line: green if previous phase is completed
        const prevPhase = index > 0 ? phases[index - 1] : null
        const prevCompleted = prevPhase ? completedPhaseIds.includes(prevPhase.id) : false

        return (
          <div key={phase.id} className="flex items-center">
            {/* Connecting line (thinner than ProgressStepper) */}
            {index > 0 && (
              <div
                className="h-px w-5 sm:w-8"
                style={{
                  backgroundColor: prevCompleted ? '#10b981' : '#d1d5db',
                }}
              />
            )}

            {/* Dot + label container */}
            <div className="flex flex-col items-center">
              {/* Dot (smaller than ProgressStepper) */}
              {isCompleted ? (
                <button
                  onClick={() => onPhaseClick?.(phase.id)}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white font-bold transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: '#10b981',
                    fontSize: '10px',
                  }}
                  aria-label={`${phase.label} (afgerond)`}
                >
                  &#10003;
                </button>
              ) : isCurrent ? (
                <div
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{
                    backgroundColor: letterColor.bg,
                    fontSize: '10px',
                    boxShadow: `0 0 0 3px ${letterColor.bg}33`,
                  }}
                >
                  {index + 1}
                </div>
              ) : (
                <div
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white font-medium"
                  style={{
                    backgroundColor: '#9ca3af',
                    fontSize: '10px',
                  }}
                >
                  {index + 1}
                </div>
              )}

              {/* Label (smaller text than ProgressStepper) */}
              {isCurrent && (
                <span
                  className="mt-0.5 text-xs font-medium whitespace-nowrap"
                  style={{ color: letterColor.bg }}
                >
                  {phase.label}
                </span>
              )}

              {/* Invisible spacer for alignment */}
              {!isCurrent && (
                <span className="mt-0.5 text-xs invisible whitespace-nowrap">
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
