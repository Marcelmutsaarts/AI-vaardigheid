'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bot, User } from 'lucide-react'
import { isTransitionSeen, markTransitionSeen, getNiveauGroep } from '@/lib/transition-utils'
import { getPersona, type AxisValue, type Persona } from '@/lib/persona-data'
import ProgressStepper from '@/components/navigation/ProgressStepper'

const TRANSITION_ID = 'e-intro'
const K2_STORAGE_KEY = 'kies-k2-state'

type Niveau = 'vmbo' | 'havo' | 'vwo'
type StepId = 'jij1' | 'ai' | 'jij2'

interface SliderValues {
  totaalLeren: AxisValue
  totaalKwaliteit: AxisValue
  totaalSnelheid: AxisValue
}

function readSliders(): SliderValues | null {
  try {
    const raw = localStorage.getItem(K2_STORAGE_KEY)
    if (!raw) return null
    const state = JSON.parse(raw)
    const l = state.totaalLeren
    const k = state.totaalKwaliteit
    const s = state.totaalSnelheid
    if (l !== -1 && l !== 0 && l !== 1) return null
    if (k !== -1 && k !== 0 && k !== 1) return null
    if (s !== -1 && s !== 0 && s !== 1) return null
    return { totaalLeren: l, totaalKwaliteit: k, totaalSnelheid: s }
  } catch {
    return null
  }
}

const teksten: Record<Niveau, {
  hookPre: string
  hookMain: string
  jij1: string
  ai: string
  jij2: string
  ctaTitle: string
  ctaBody: string
  ctaButton: string
}> = {
  vmbo: {
    hookPre: 'Hé, ik ben er weer.',
    hookMain: 'Klik hieronder op de drie poppetjes. Dan zie je waarom Evalueren belangrijk is.',
    jij1: 'Mooi werk! In Instrueren leerde je hoe je AI iets goed kan vragen.',
    ai: 'AI geeft een antwoord. Maar let op: AI klinkt soms heel zeker, terwijl het niet klopt. Of AI praat je naar de mond.',
    jij2: 'Hier moet jij weer aan de slag. Klopt het wel? Is het eerlijk? Dat ga je nu leren.',
    ctaTitle: 'Klaar voor de check-stap?',
    ctaBody: 'In drie korte rondes leer je de drie grootste AI-valkuilen herkennen.',
    ctaButton: 'Start Evalueren',
  },
  havo: {
    hookPre: 'Hé, ik ben er weer.',
    hookMain: 'Klik op de drie poppetjes hieronder. Ze laten zien waarom Evalueren onmisbaar is.',
    jij1: 'Goed gedaan! In Instrueren leerde je hoe je een sterke prompt bouwt.',
    ai: 'AI antwoordt — maar niet alles klopt. Soms verzint AI iets met overtuiging. Soms gaat AI mee met wat jij wil horen, ook als dat niet klopt.',
    jij2: 'Hier kom jij weer in actie. Klopt het? Is het volledig? Is het bias-vrij? Dat leer je nu.',
    ctaTitle: 'Klaar om die tweede stap te leren?',
    ctaBody: 'In drie korte rondes ontmasker je de drie meest voorkomende AI-valkuilen.',
    ctaButton: 'Start Evalueren',
  },
  vwo: {
    hookPre: 'Hé.',
    hookMain: 'Klik de drie poppetjes hieronder aan. Ze tonen waarom Evalueren niet optioneel is.',
    jij1: 'Sterk werk. In Instrueren heb je de bouwstenen van een effectieve prompt onder de knie gekregen.',
    ai: 'AI levert een output — maar die output is niet automatisch correct. AI hallucineert, draagt biases mee, en heeft een neiging tot bevestigend gedrag.',
    jij2: 'Hier neem jij weer over. Verifieer, bevraag, valideer. Pas dan wordt AI-werk betrouwbaar.',
    ctaTitle: 'Klaar voor de tegenkrachten?',
    ctaBody: 'In drie korte rondes ontleed je drie patronen waarmee AI je op het verkeerde been kan zetten.',
    ctaButton: 'Start Evalueren',
  },
}

function PersonaAvatar({ persona, size = 'sm' }: { persona: Persona | null; size?: 'sm' | 'md' | 'lg' }) {
  const [imageError, setImageError] = useState(false)
  const dim = size === 'lg' ? 'w-16 h-16' : size === 'md' ? 'w-12 h-12' : 'w-10 h-10'
  const iconSize = size === 'lg' ? 'h-8 w-8' : size === 'md' ? 'h-6 w-6' : 'h-5 w-5'

  if (!persona || imageError) {
    return (
      <div className={`flex-shrink-0 ${dim} rounded-full bg-primary text-white flex items-center justify-center`}>
        <Bot className={iconSize} />
      </div>
    )
  }

  return (
    <div className={`flex-shrink-0 ${dim} rounded-full overflow-hidden bg-primary-light border-2 border-primary/30`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={persona.imageFile}
        alt={persona.name}
        className="w-full h-full object-cover object-top"
        onError={() => setImageError(true)}
      />
    </div>
  )
}

export default function EvalueerIntro() {
  const router = useRouter()
  const { niveau } = useNiveau()
  const [ready, setReady] = useState(false)
  const [persona, setPersona] = useState<Persona | null>(null)
  const [revealed, setRevealed] = useState<Set<StepId>>(new Set())

  useEffect(() => {
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
      return
    }
    if (isTransitionSeen(TRANSITION_ID)) {
      router.replace('/leerpad/evalueren')
      return
    }
    const sliders = readSliders()
    if (sliders) {
      setPersona(getPersona(sliders.totaalLeren, sliders.totaalKwaliteit, sliders.totaalSnelheid))
    }
    setReady(true)
  }, [niveau, router])

  if (!ready) return null

  const niveauGroep = getNiveauGroep(niveau.schoolType)
  const t = teksten[niveauGroep]
  const personaInline = persona?.name?.replace(/^De\s+/i, '') ?? null

  const handleStepClick = (id: StepId) => {
    setRevealed(prev => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const allRevealed = revealed.size === 3

  const handleContinue = () => {
    markTransitionSeen(TRANSITION_ID)
    router.push('/leerpad/evalueren')
  }

  const stepConfig: Array<{ id: StepId; label: string; type: 'jij' | 'ai'; bubble: string }> = [
    { id: 'jij1', label: 'JIJ', type: 'jij', bubble: t.jij1 },
    { id: 'ai', label: 'AI', type: 'ai', bubble: t.ai },
    { id: 'jij2', label: 'JIJ', type: 'jij', bubble: t.jij2 },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-light/30 to-white">
      <Header />
      <ProgressStepper activeLetter="evalueren" />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Persona intro */}
          <div className="flex items-start gap-3 mb-8">
            <PersonaAvatar persona={persona} size="lg" />
            <div className="flex-1 bg-white rounded-2xl rounded-tl-sm border shadow-sm p-5 relative">
              <div className="absolute -left-2 top-3 w-3 h-3 bg-white border-l border-t rotate-[-45deg]" />
              {personaInline && (
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                  {persona?.name}
                </p>
              )}
              <p className="text-base md:text-lg text-gray-800 leading-relaxed">
                {t.hookPre} {t.hookMain}
              </p>
            </div>
          </div>

          {/* Mens-AI-Mens diagram */}
          <div className="bg-white rounded-2xl border shadow-sm p-6 md:p-8 mb-6">
            <div className="flex items-center justify-center gap-2 md:gap-4">
              {stepConfig.map((step, i) => {
                const opened = revealed.has(step.id)
                const isAi = step.type === 'ai'
                return (
                  <div key={step.id} className="flex items-center gap-2 md:gap-4">
                    <button
                      onClick={() => handleStepClick(step.id)}
                      className={`flex flex-col items-center gap-2 transition-all ${
                        opened ? 'scale-100' : 'hover:scale-105 animate-pulse-soft'
                      }`}
                    >
                      <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all overflow-hidden ${
                        opened
                          ? isAi
                            ? 'bg-primary text-white shadow-md ring-4 ring-primary/20'
                            : 'bg-primary-light shadow-md ring-4 ring-primary/20 border-2 border-primary/30'
                          : isAi
                            ? 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}>
                        {isAi ? (
                          <Bot className="h-8 w-8 md:h-10 md:w-10" />
                        ) : opened && persona ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={persona.imageFile}
                            alt={persona.name}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <User className="h-8 w-8 md:h-10 md:w-10" />
                        )}
                      </div>
                      <span className={`text-xs font-bold tracking-wide ${
                        opened
                          ? isAi ? 'text-primary' : 'text-primary'
                          : 'text-gray-400'
                      }`}>
                        {step.label}
                      </span>
                    </button>
                    {i < stepConfig.length - 1 && (
                      <ArrowRight className={`h-5 w-5 md:h-6 md:w-6 ${
                        revealed.has(stepConfig[i + 1].id) || opened ? 'text-primary' : 'text-gray-300'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>

            {!allRevealed && (
              <p className="text-center text-xs text-gray-500 mt-5 italic">
                Klik op {revealed.size === 0 ? 'de eerste' : revealed.size === 1 ? 'de volgende' : 'de laatste'} om te zien wat hier gebeurt.
              </p>
            )}
          </div>

          {/* Speech bubbles, in volgorde van clicks */}
          <div className="space-y-3 mb-8">
            {stepConfig.map((step) => {
              if (!revealed.has(step.id)) return null
              return (
                <div key={step.id} className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <PersonaAvatar persona={persona} size="sm" />
                  <div className="flex-1 bg-white rounded-2xl rounded-tl-sm border shadow-sm p-4 relative">
                    <div className="absolute -left-2 top-3 w-3 h-3 bg-white border-l border-t rotate-[-45deg]" />
                    <p className="text-sm md:text-base text-gray-800 leading-relaxed">
                      {step.bubble}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          {allRevealed && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-6 text-center">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t.ctaTitle}</h2>
                <p className="text-sm md:text-base text-gray-700">{t.ctaBody}</p>
              </div>
              <div className="text-center">
                <Button onClick={handleContinue} size="lg" className="px-8">
                  {t.ctaButton}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: 0.92; }
        }
        .animate-pulse-soft {
          animation: pulse-soft 2.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
