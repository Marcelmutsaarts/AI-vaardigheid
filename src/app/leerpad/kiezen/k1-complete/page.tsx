'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNiveau } from '@/contexts/NiveauContext'
import { getTransitionTexts } from '@/lib/transition-texts'
import { getNiveauGroep, isTransitionSeen, markTransitionSeen } from '@/lib/transition-utils'
import { k2VoorbeeldPerNiveau } from '@/lib/kiezen-content'
import ProgressStepper from '@/components/navigation/ProgressStepper'
import StepRoadmap, { type StepInfo } from '@/components/navigation/StepRoadmap'

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

    if (!progress.kiezen.k1) {
      router.replace('/leerpad/kiezen/k1')
      return
    }

    if (isTransitionSeen(TRANSITION_ID)) {
      router.replace('/leerpad/kiezen/k2')
      return
    }

    setReady(true)
  }, [niveau, progress, router])

  if (!ready) return null

  const niveauGroep = getNiveauGroep(niveau.schoolType)
  const texts = getTransitionTexts('k1-complete', niveauGroep)
  const voorbeeld = k2VoorbeeldPerNiveau[niveauGroep]

  const handleContinue = () => {
    markTransitionSeen(TRANSITION_ID)
    router.push('/leerpad/kiezen/k2')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f5ff]">
      <ProgressStepper activeLetter="kiezen" />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center fade-in">
          {/* Mini-roadmap */}
          <div className="mb-8">
            <StepRoadmap
              steps={kSteps}
              completedSteps={['k1']}
              activeStepId="k2"
              color="#a15df5"
            />
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-3">
            {texts.heading}
          </h1>

          {/* Subtext */}
          <p className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed">
            {texts.subtext}
          </p>

          {/* Voorbeeld blok */}
          <div className="text-left mb-6">
            <p className="text-sm text-gray-600 mb-3">
              {voorbeeld.intro}
            </p>
            <div className="bg-white rounded-xl border shadow-sm p-3">
              <div className="space-y-1.5">
                {voorbeeld.stappen.map((stap, index) => (
                  <div key={index} className="flex items-center gap-2.5 py-1">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: '#a15df5' }}
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700">{stap}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {voorbeeld.outro}
            </p>
          </div>

          {/* Button */}
          <button
            onClick={handleContinue}
            className="w-full py-3 px-8 rounded-xl font-semibold text-white transition-colors text-base hover:opacity-90"
            style={{ backgroundColor: '#a15df5' }}
          >
            {texts.buttonLabel}
          </button>
        </div>
      </main>

      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
