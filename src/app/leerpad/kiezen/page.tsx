'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft } from 'lucide-react'
import { kiesStructuur, getLetterByKey, isSubStepAccessible } from '@/lib/navigation'
import ProgressStepper from '@/components/navigation/ProgressStepper'
import SubStepCard from '@/components/navigation/SubStepCard'
import NextStepButton from '@/components/navigation/NextStepButton'
import { isTransitionSeen } from '@/lib/transition-utils'

export default function KiezenOverzicht() {
  const router = useRouter()
  const { niveau, progress } = useNiveau()

  useEffect(() => {
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
      return
    }

    // Bij eerste bezoek: toon intro-scherm
    if (!isTransitionSeen('k-intro')) {
      router.replace('/leerpad/kiezen/intro')
    }
  }, [niveau, router])

  const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
  if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
    return null
  }

  const letter = getLetterByKey('kiezen')!

  const getSubStepState = (subStepId: string, index: number): 'completed' | 'active' | 'locked' => {
    const letterProgress = progress.kiezen as Record<string, boolean>
    if (letterProgress[subStepId]) return 'completed'
    // First uncompleted substep that is accessible = active
    const isFirst = letter.subSteps.findIndex(s => {
      const lp = progress.kiezen as Record<string, boolean>
      return !lp[s.id]
    }) === index
    if (isFirst && isSubStepAccessible(subStepId, progress)) return 'active'
    return 'locked'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <ProgressStepper activeLetter="kiezen" />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Terug link */}
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Dashboard
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4"
              style={{ backgroundColor: letter.color }}
            >
              K
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Kiezen</h1>
            <p className="text-gray-600">
              Leer bewust kiezen wanneer en hoe je AI inzet
            </p>
          </div>

          {/* Modules */}
          <div className="space-y-3 mb-8">
            {letter.subSteps.map((subStep, index) => (
              <SubStepCard
                key={subStep.id}
                subStep={subStep}
                index={index}
                letterColor={letter.color}
                state={getSubStepState(subStep.id, index)}
              />
            ))}
          </div>

          {/* Volgende stap button */}
          <div className="text-center">
            <NextStepButton context="letter-overview" letterKey="kiezen" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
