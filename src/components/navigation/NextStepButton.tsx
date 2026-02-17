'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNiveau } from '@/contexts/NiveauContext'
import {
  kiesStructuur,
  getNextSubStep,
  getNextSubStepInLetter,
  isLetterComplete,
  getLetterByKey,
} from '@/lib/navigation'

interface NextStepButtonProps {
  context: 'dashboard' | 'letter-overview'
  letterKey?: 'kiezen' | 'instrueren' | 'evalueren' | 'spelregels'
  className?: string
}

export default function NextStepButton({ context, letterKey, className }: NextStepButtonProps) {
  const { progress } = useNiveau()

  if (context === 'dashboard') {
    return <DashboardButton progress={progress} className={className} />
  }

  if (context === 'letter-overview' && letterKey) {
    return <LetterOverviewButton progress={progress} letterKey={letterKey} className={className} />
  }

  return null
}

// ---- Dashboard context ----

function DashboardButton({
  progress,
  className,
}: {
  progress: Parameters<typeof getNextSubStep>[0]
  className?: string
}) {
  const next = getNextSubStep(progress)

  // Everything completed
  if (!next) return null

  const { letter, subStep } = next

  // Check if anything at all has been completed
  const anythingCompleted = kiesStructuur.some((l) =>
    l.subSteps.some((s) => {
      const lp = progress[l.key] as Record<string, boolean>
      return lp[s.id]
    })
  )

  // Check if we're in the middle of a letter or starting a new one
  const isFirstInLetter = letter.subSteps[0].id === subStep.id

  let label: string
  let href: string

  if (!anythingCompleted) {
    // Nothing completed at all
    label = `Begin met ${letter.title}`
    href = subStep.href
  } else if (!isFirstInLetter) {
    // In the middle of a letter
    label = `Ga verder met ${letter.title}`
    href = subStep.href
  } else {
    // First substep of a new letter = previous letter was just completed
    label = `Door naar ${letter.title}`
    href = subStep.href
  }

  return (
    <Button asChild size="lg" className={className}>
      <Link href={href}>
        {label}
        <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    </Button>
  )
}

// ---- Letter-overview context ----

function LetterOverviewButton({
  progress,
  letterKey,
  className,
}: {
  progress: Parameters<typeof getNextSubStep>[0]
  letterKey: string
  className?: string
}) {
  const letter = getLetterByKey(letterKey)
  if (!letter) return null

  const letterComplete = isLetterComplete(letterKey, progress)

  if (!letterComplete) {
    // Letter is not yet complete - find the next substep within this letter
    const nextSubStep = getNextSubStepInLetter(letterKey, progress)
    if (!nextSubStep) return null

    // Check if nothing has been done yet in this letter
    const letterProgress = progress[letter.key] as Record<string, boolean>
    const nothingDone = letter.subSteps.every((s) => !letterProgress[s.id])

    const label = nothingDone
      ? `Begin met ${nextSubStep.title}`
      : `Ga verder met ${nextSubStep.title}`

    return (
      <Button asChild size="lg" className={className}>
        <Link href={nextSubStep.href}>
          {label}
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </Button>
    )
  }

  // Letter is complete - check for next letter
  const currentIndex = kiesStructuur.findIndex((l) => l.key === letterKey)
  const nextLetter = currentIndex < kiesStructuur.length - 1
    ? kiesStructuur[currentIndex + 1]
    : null

  if (nextLetter) {
    return (
      <Button asChild size="lg" className={className}>
        <Link href={nextLetter.href}>
          Door naar {nextLetter.title}
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </Button>
    )
  }

  // Everything done - link back to dashboard
  return (
    <Button asChild size="lg" className={className}>
      <Link href="/dashboard">
        Terug naar dashboard
        <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    </Button>
  )
}
