'use client'

import { User, Bot, CheckCircle2, ArrowRight, Pencil } from 'lucide-react'

interface CompletedRound {
  round: number
  name: string
  emoji: string
}

interface EvalSidebarProps {
  level: string // schoolType: 'vmbo' | 'havo' | 'vwo' | 'mbo' | 'hbo'
  interests: string[]
  completedRounds: CompletedRound[]
  activeRound: number | null // 1, 2, or 3
  onEditInterests?: () => void
}

function getOneLiner(level: string): string {
  if (level === 'vmbo') {
    return 'Jij checkt altijd wat de AI maakt.'
  }
  if (level === 'mbo' || level === 'havo') {
    return 'Jij checkt altijd. AI is een hulpmiddel, geen vervanging.'
  }
  // hbo, vwo
  return 'AI is een hulpmiddel, geen vervanging voor jouw denken.'
}

const TOTAL_ROUNDS = 3

export default function EvalSidebar({
  level,
  interests,
  completedRounds,
  activeRound,
  onEditInterests,
}: EvalSidebarProps) {
  const completedRoundNumbers = new Set(completedRounds.map((r) => r.round))

  function getCompletedRound(round: number): CompletedRound | undefined {
    return completedRounds.find((r) => r.round === round)
  }

  return (
    <div className="space-y-0">
      {/* 1. Mens-AI-Mens Mini-diagram */}
      <div className="bg-white rounded-xl border shadow-sm p-4 mb-4">
        {/* Diagram row */}
        <div className="flex items-center justify-center gap-2">
          {/* JIJ (start) */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <User className="h-4 w-4 text-purple-700" />
            </div>
            <span className="text-xs font-medium text-purple-700">JIJ</span>
          </div>

          <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />

          {/* AI */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot className="h-4 w-4 text-blue-700" />
            </div>
            <span className="text-xs font-medium text-blue-700">AI</span>
          </div>

          <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />

          {/* JIJ (check) */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-green-700" />
            </div>
            <span className="text-xs font-medium text-green-700">JIJ</span>
          </div>
        </div>

        {/* One-liner */}
        <p className="text-sm text-gray-600 text-center mt-3">
          {getOneLiner(level)}
        </p>
      </div>

      {/* 2. Interests Section */}
      {interests.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700">
              Jouw interesses:
            </span>
            {onEditInterests && (
              <button
                onClick={onEditInterests}
                className="text-gray-400 hover:text-purple-600 transition-colors"
                aria-label="Interesses bewerken"
              >
                <Pencil className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {interests.map((interest) => (
              <span
                key={interest}
                className="bg-green-50 text-green-700 rounded-full px-2 py-1 text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3. Rounds Progress */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex flex-col">
          {Array.from({ length: TOTAL_ROUNDS }, (_, i) => i + 1).map(
            (round) => {
              const completed = getCompletedRound(round)
              const isActive = activeRound === round
              const isCompleted = completedRoundNumbers.has(round)

              return (
                <div
                  key={round}
                  className="flex items-center gap-2 py-1.5"
                >
                  {isCompleted && completed ? (
                    <>
                      <span className="text-green-600 text-sm">&#10003;</span>
                      <span className="text-sm text-green-700">
                        Ronde {round}: {completed.emoji} {completed.name}
                      </span>
                    </>
                  ) : isActive ? (
                    <>
                      <span className="text-green-600 text-sm">&#9679;</span>
                      <span className="text-sm font-bold text-gray-900">
                        Ronde {round}: ???
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-400 text-sm">&#9679;</span>
                      <span className="text-sm text-gray-400">
                        Ronde {round}: ???
                      </span>
                    </>
                  )}
                </div>
              )
            }
          )}
        </div>
      </div>
    </div>
  )
}
