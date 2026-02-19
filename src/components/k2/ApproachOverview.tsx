'use client'

import { StepApproach } from './ApproachDropdown'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ApproachOverviewProps {
  taskName: string
  steps: Array<{
    text: string
    approach: StepApproach | null
  }>
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function truncateLabel(text: string, maxLen: number = 10): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen - 1) + '.'
}

function renderPillContent(approach: StepApproach | null): string {
  if (approach === null) {
    return '\u2013' // en-dash
  }
  if (approach.type === 'zelf') {
    return '\u270B Zelf'
  }
  // roles
  const roles = approach.roles
  if (roles.length === 1) {
    return `${roles[0].emoji} ${truncateLabel(roles[0].name)}`
  }
  // 2+ roles: only emojis
  return roles.map((r) => r.emoji).join(' ')
}

function getPillTitle(approach: StepApproach | null): string | undefined {
  if (
    approach !== null &&
    approach.type === 'roles' &&
    approach.roles.length >= 2
  ) {
    return approach.roles.map((r) => r.name).join(', ')
  }
  return undefined
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ApproachOverview({ taskName, steps }: ApproachOverviewProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Title */}
      <h3 className="mb-3">
        <span className="font-bold">{taskName}</span>
        <span className="font-normal text-gray-600"> — jouw aanpak:</span>
      </h3>

      {/* Step rows */}
      <div>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          const hasSelection = step.approach !== null

          return (
            <div
              key={index}
              className={`flex items-center justify-between py-3${
                !isLast ? ' border-b border-gray-100' : ''
              }`}
            >
              {/* Left: number circle + step text */}
              <div className="flex items-center gap-2 min-w-0 mr-3">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-medium flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <span className="text-gray-700 truncate">{step.text}</span>
              </div>

              {/* Right: approach pill */}
              <span
                title={getPillTitle(step.approach)}
                className={`rounded-full px-3 py-1 text-sm shrink-0 ${
                  hasSelection
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'text-gray-400'
                }`}
              >
                {renderPillContent(step.approach)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ApproachOverview
