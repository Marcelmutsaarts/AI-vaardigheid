'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft } from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'
import ProgressStepper from '@/components/navigation/ProgressStepper'
import EvalSidebar from '@/components/e/EvalSidebar'
import EvalWorkspace from '@/components/e/EvalWorkspace'

export default function EvaluerenPage() {
  const router = useRouter()
  const { niveau, updateProgress } = useNiveau()

  // ── State ─────────────────────────────────────────────────────────────────
  const [interests, setInterests] = useState<string[]>([])
  const [completedRounds, setCompletedRounds] = useState<Array<{ round: number; name: string; emoji: string }>>([])
  const [activeRound, setActiveRound] = useState<number | null>(null)

  // ── Niveau guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
    }
  }, [niveau, router])

  const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
  if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
    return null
  }

  // ── Callbacks ─────────────────────────────────────────────────────────────
  const handleInterestsSet = (newInterests: string[]) => {
    setInterests(newInterests)
    setActiveRound(1)
  }

  const handleRoundComplete = (round: number, name: string, emoji: string) => {
    setCompletedRounds(prev => [...prev, { round, name, emoji }])
    setActiveRound(round < 3 ? round + 1 : null)
  }

  const handleModuleComplete = () => {
    updateProgress('evalueren', 'e1', true)
    updateProgress('evalueren', 'e2', true)
    router.push('/leerpad/spelregels/s1')
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <ProgressStepper activeLetter="evalueren" />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back link */}
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Dashboard
          </Link>

          {/* Page header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: kiesKleuren.evalueren }}
              >
                E
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Evalueren</h1>
                <p className="text-sm text-gray-500">
                  Leer AI-output kritisch beoordelen
                </p>
              </div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left column -- sticky on desktop */}
            <div className="w-full lg:w-[35%] flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <EvalSidebar
                  level={niveau.schoolType!}
                  interests={interests}
                  completedRounds={completedRounds}
                  activeRound={activeRound}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="flex-1 min-w-0">
              <EvalWorkspace
                level={niveau.schoolType!}
                leerjaar={niveau.leerjaar}
                onInterestsSet={handleInterestsSet}
                onRoundComplete={handleRoundComplete}
                onModuleComplete={handleModuleComplete}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
