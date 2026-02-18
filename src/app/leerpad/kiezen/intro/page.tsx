'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNiveau } from '@/contexts/NiveauContext'
import { getTransitionTexts } from '@/lib/transition-texts'
import { getNiveauGroep, isTransitionSeen, markTransitionSeen } from '@/lib/transition-utils'
import TransitionScreen from '@/components/navigation/TransitionScreen'
import type { StepInfo } from '@/components/navigation/StepRoadmap'

const TRANSITION_ID = 'k-intro'

const kSteps: StepInfo[] = [
  { id: 'k1', label: 'Ontdekken', shortLabel: 'K1' },
  { id: 'k2', label: 'Oefenen', shortLabel: 'K2' },
]

export default function KiezenIntro() {
  const router = useRouter()
  const { niveau } = useNiveau()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
      return
    }

    // Als de intro al gezien is, ga direct naar het kiezen-overzicht
    if (isTransitionSeen(TRANSITION_ID)) {
      router.replace('/leerpad/kiezen')
      return
    }

    setReady(true)
  }, [niveau, router])

  if (!ready) return null

  const niveauGroep = getNiveauGroep(niveau.schoolType)
  const texts = getTransitionTexts('k-intro', niveauGroep)

  const handleContinue = () => {
    markTransitionSeen(TRANSITION_ID)
  }

  return (
    <TransitionScreen
      variant="module-intro"
      activeLetter="kiezen"
      heading={texts.heading}
      subtext={texts.subtext}
      buttonLabel={texts.buttonLabel}
      buttonHref="/leerpad/kiezen/k1"
      steps={kSteps}
      completedSteps={[]}
      activeStepId="k1"
      stepColor="#a15df5"
      onBeforeNavigate={handleContinue}
    />
  )
}
