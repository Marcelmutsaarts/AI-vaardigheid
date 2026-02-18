'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNiveau } from '@/contexts/NiveauContext'
import { getTransitionTexts } from '@/lib/transition-texts'
import { getNiveauGroep, isTransitionSeen, markTransitionSeen } from '@/lib/transition-utils'
import TransitionScreen from '@/components/navigation/TransitionScreen'
import type { StepInfo } from '@/components/navigation/StepRoadmap'

const TRANSITION_ID = 'k1-complete'

const kSteps: StepInfo[] = [
  { id: 'k1', label: 'Ontdekken', shortLabel: 'K1' },
  { id: 'k2', label: 'Oefenen', shortLabel: 'K2' },
]

export default function K1Complete() {
  const router = useRouter()
  const { niveau, progress } = useNiveau()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
      return
    }

    // Alleen tonen als K1 daadwerkelijk afgerond is
    if (!progress.kiezen.k1) {
      router.replace('/leerpad/kiezen/k1')
      return
    }

    // Als dit scherm al gezien is, ga direct naar K2
    if (isTransitionSeen(TRANSITION_ID)) {
      router.replace('/leerpad/kiezen/k2')
      return
    }

    setReady(true)
  }, [niveau, progress, router])

  if (!ready) return null

  const niveauGroep = getNiveauGroep(niveau.schoolType)
  const texts = getTransitionTexts('k1-complete', niveauGroep)

  const handleContinue = () => {
    markTransitionSeen(TRANSITION_ID)
  }

  return (
    <TransitionScreen
      variant="step-complete"
      activeLetter="kiezen"
      heading={texts.heading}
      subtext={texts.subtext}
      buttonLabel={texts.buttonLabel}
      buttonHref="/leerpad/kiezen/k2"
      steps={kSteps}
      completedSteps={['k1']}
      activeStepId="k2"
      stepColor="#a15df5"
      onBeforeNavigate={handleContinue}
    />
  )
}
