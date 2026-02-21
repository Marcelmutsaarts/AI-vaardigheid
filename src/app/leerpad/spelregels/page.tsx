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
import RulesSidebar, { SectionKey } from '@/components/s/RulesSidebar'
import PrivacyExercise from '@/components/s/PrivacyExercise'
import TransparencyExercise from '@/components/s/TransparencyExercise'
import SustainabilityExercise from '@/components/s/SustainabilityExercise'

function getNiveauGroep(schoolType: string): 'vmbo' | 'havo' | 'vwo' {
  if (schoolType === 'vmbo') return 'vmbo'
  if (schoolType === 'havo' || schoolType === 'mbo') return 'havo'
  return 'vwo' // vwo, hbo
}

const introTeksten: Record<string, string> = {
  vmbo: 'AI is handig, maar je moet er wel goed mee omgaan. Drie dingen zijn belangrijk:',
  havo: 'AI is krachtig. Maar kracht vraagt verantwoordelijkheid. Er zijn drie dingen om over na te denken:',
  vwo: 'Met de kracht van AI komt verantwoordelijkheid. Drie dimensies verdienen je aandacht:',
}

const sectionHeaders: Record<SectionKey, { emoji: string; title: string }> = {
  privacy: { emoji: '\u{1F512}', title: 'Privacy \u2014 Wat stop je in AI?' },
  transparency: { emoji: '\u{1F50D}', title: 'Transparantie \u2014 Wanneer meld je AI-gebruik?' },
  sustainability: { emoji: '\u{1F331}', title: 'Duurzaamheid \u2014 AI en energie' },
}

export default function SpelregelsPage() {
  const router = useRouter()
  const { niveau, progress, updateProgress } = useNiveau()

  // ── State ─────────────────────────────────────────────────────────────────
  const [selectedSection, setSelectedSection] = useState<SectionKey | null>(null)
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())

  // ── Niveau guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
    }
  }, [niveau, router])

  // ── Load initial progress ─────────────────────────────────────────────────
  useEffect(() => {
    const initial = new Set<string>()
    if ((progress.spelregels as Record<string, boolean>).s1) initial.add('privacy')
    if ((progress.spelregels as Record<string, boolean>).s2) initial.add('transparency')
    if ((progress.spelregels as Record<string, boolean>).s3) initial.add('sustainability')
    if (initial.size > 0) setCompletedSections(initial)
  }, [progress])

  const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
  if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
    return null
  }

  // ── Callbacks ─────────────────────────────────────────────────────────────
  const handleSectionComplete = (section: SectionKey) => {
    setCompletedSections(prev => {
      const next = new Set(prev)
      next.add(section)
      return next
    })
    // Update progress for backward compat
    const progressMap: Record<SectionKey, string> = {
      privacy: 's1',
      transparency: 's2',
      sustainability: 's3',
    }
    updateProgress('spelregels', progressMap[section], true)
  }

  const handleFinish = () => {
    router.push('/dashboard')
  }

  const niveauGroep = getNiveauGroep(niveau.schoolType!)
  const introTekst = introTeksten[niveauGroep]

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <ProgressStepper activeLetter="spelregels" />

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
                style={{ backgroundColor: kiesKleuren.spelregels }}
              >
                S
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Spelregels</h1>
                <p className="text-sm text-gray-500">Wat mag en moet bij AI-gebruik?</p>
              </div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left column -- sticky on desktop */}
            <div className="w-full lg:w-[35%] flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <RulesSidebar
                  level={niveau.schoolType!}
                  selectedSection={selectedSection}
                  completedSections={completedSections}
                  onSelectSection={setSelectedSection}
                  onFinish={handleFinish}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="flex-1 min-w-0">
              {selectedSection === null && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Spelregels</h2>
                  <p className="text-sm text-gray-600 mb-6">{introTekst}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <button
                      onClick={() => setSelectedSection('privacy')}
                      className="bg-white rounded-xl border shadow-sm p-4 text-center cursor-pointer hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <span className="text-3xl block mb-2">{'\u{1F512}'}</span>
                      <span className="font-medium text-gray-900 block">Privacy</span>
                      <span className="text-xs text-gray-500">Wat deel je met AI?</span>
                    </button>
                    <button
                      onClick={() => setSelectedSection('transparency')}
                      className="bg-white rounded-xl border shadow-sm p-4 text-center cursor-pointer hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <span className="text-3xl block mb-2">{'\u{1F50D}'}</span>
                      <span className="font-medium text-gray-900 block">Transparantie</span>
                      <span className="text-xs text-gray-500">Wanneer vertel je het?</span>
                    </button>
                    <button
                      onClick={() => setSelectedSection('sustainability')}
                      className="bg-white rounded-xl border shadow-sm p-4 text-center cursor-pointer hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <span className="text-3xl block mb-2">{'\u{1F331}'}</span>
                      <span className="font-medium text-gray-900 block">Duurzaamheid</span>
                      <span className="text-xs text-gray-500">Wat kost AI eigenlijk?</span>
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 text-center">Kies een onderdeel om te beginnen.</p>
                </div>
              )}

              {selectedSection !== null && (
                <div>
                  {/* Section header */}
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {sectionHeaders[selectedSection].emoji} {sectionHeaders[selectedSection].title}
                  </h2>

                  {/* Exercise */}
                  {selectedSection === 'privacy' && (
                    <PrivacyExercise level={niveau.schoolType!} onComplete={() => handleSectionComplete('privacy')} />
                  )}
                  {selectedSection === 'transparency' && (
                    <TransparencyExercise level={niveau.schoolType!} onComplete={() => handleSectionComplete('transparency')} />
                  )}
                  {selectedSection === 'sustainability' && (
                    <SustainabilityExercise level={niveau.schoolType!} onComplete={() => handleSectionComplete('sustainability')} />
                  )}

                  {/* Completion message */}
                  {completedSections.has(selectedSection) && (
                    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-800">
                        Goed gedaan! Kies een ander onderdeel, of rond de module af.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
