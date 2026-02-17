'use client'

import React from 'react'
import Link from 'next/link'
import { CheckCircle2, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SubStep } from '@/lib/navigation'

interface SubStepCardProps {
  subStep: SubStep
  index: number
  letterColor: string
  state: 'completed' | 'active' | 'locked'
}

export default function SubStepCard({ subStep, index, letterColor, state }: SubStepCardProps) {
  const isClickable = state === 'completed' || state === 'active'

  const cardClasses = cn(
    'flex items-center gap-4 p-4 rounded-xl border shadow-sm transition-all',
    state === 'completed' && 'bg-white border-gray-200 hover:shadow-md cursor-pointer',
    state === 'active' && 'bg-white border-gray-200 hover:shadow-md cursor-pointer',
    state === 'locked' && 'bg-gray-50 border-gray-100 cursor-not-allowed'
  )

  // Number circle
  const numberCircle = (
    <div
      className={cn(
        'flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold',
        state === 'completed' && 'bg-green-100 text-green-600',
        state === 'active' && 'bg-white text-white',
        state === 'locked' && 'bg-gray-200 text-gray-400'
      )}
      style={
        state === 'active'
          ? {
              backgroundColor: letterColor,
              boxShadow: `0 0 0 3px white, 0 0 0 5px ${letterColor}`,
            }
          : undefined
      }
    >
      {state === 'completed' ? (
        <CheckCircle2 className="w-5 h-5 text-green-500" />
      ) : (
        index + 1
      )}
    </div>
  )

  // Text content
  const textContent = (
    <div className="flex-1 min-w-0">
      <p
        className={cn(
          'font-semibold text-sm',
          state === 'completed' && 'text-gray-900',
          state === 'active' && 'text-gray-900',
          state === 'locked' && 'text-gray-400'
        )}
      >
        {subStep.title}
      </p>
      <p
        className={cn(
          'text-sm mt-0.5',
          state === 'completed' && 'text-gray-500',
          state === 'active' && 'text-gray-600',
          state === 'locked' && 'text-gray-300'
        )}
      >
        {subStep.description}
      </p>
    </div>
  )

  // Arrow icon (only for clickable states)
  const arrow = isClickable ? (
    <ChevronRight
      className={cn(
        'flex-shrink-0 w-5 h-5',
        state === 'completed' && 'text-gray-400',
        state === 'active' && 'text-gray-500'
      )}
    />
  ) : null

  // Left border stripe style
  const stripeStyle: React.CSSProperties =
    state === 'completed'
      ? { borderLeftWidth: '4px', borderLeftColor: '#22c55e' }
      : state === 'active'
        ? { borderLeftWidth: '4px', borderLeftColor: letterColor }
        : {}

  if (isClickable) {
    return (
      <Link href={subStep.href} className={cardClasses} style={stripeStyle}>
        {numberCircle}
        {textContent}
        {arrow}
      </Link>
    )
  }

  return (
    <div className={cardClasses} style={stripeStyle}>
      {numberCircle}
      {textContent}
      {arrow}
    </div>
  )
}
