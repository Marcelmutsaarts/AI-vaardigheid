'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { isTransitionSeen, markTransitionSeen, getNiveauGroep } from '@/lib/transition-utils'
import { getPersona, type AxisValue, type Persona } from '@/lib/persona-data'

const TRANSITION_ID = 'k-complete'
const K2_STORAGE_KEY = 'kies-k2-state'

type Phase = 'input' | 'loading' | 'reveal'

interface SliderValues {
  totaalLeren: AxisValue
  totaalKwaliteit: AxisValue
  totaalSnelheid: AxisValue
}

const reflectiePromptPerNiveau = {
  vmbo: 'Schrijf in een paar zinnen op: wanneer is AI handig voor jou en wanneer juist niet?',
  havo: 'Schrijf in een paar zinnen op: voor welke taken kies je AI bewust wel — en voor welke juist niet, en waarom?',
  vwo: 'Schrijf een korte reflectie: in welke situaties zet jij AI in en in welke niet, en welk principe stuurt die keuze aan?',
} as const

const placeholderPerNiveau = {
  vmbo: 'Bijvoorbeeld: "Ik gebruik AI vooral als ik vastloop met een opdracht, maar nooit voor toetsen want…"',
  havo: 'Bijvoorbeeld: "Ik zet AI in voor brainstormen en feedback, maar niet voor schrijfwerk waar ik beter in wil worden, omdat…"',
  vwo: 'Bijvoorbeeld: "Ik delegeer aan AI wanneer efficiëntie zwaarder weegt dan eigen leerwinst; wanneer het leerdoel zelf het denken is, doe ik het zelf…"',
} as const

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

export default function KComplete() {
  const router = useRouter()
  const { niveau, progress } = useNiveau()
  const [ready, setReady] = useState(false)
  const [phase, setPhase] = useState<Phase>('input')
  const [reflectionText, setReflectionText] = useState('')
  const [aiDescription, setAiDescription] = useState('')
  const [sliders, setSliders] = useState<SliderValues | null>(null)
  const [persona, setPersona] = useState<Persona | null>(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
      return
    }

    if (!progress.kiezen.k2) {
      router.replace('/leerpad/kiezen')
      return
    }

    if (isTransitionSeen(TRANSITION_ID)) {
      router.replace('/leerpad/instrueren')
      return
    }

    const s = readSliders()
    if (!s) {
      router.replace('/leerpad/kiezen/k2')
      return
    }
    setSliders(s)
    setPersona(getPersona(s.totaalLeren, s.totaalKwaliteit, s.totaalSnelheid))
    setReady(true)
  }, [niveau, progress, router])

  if (!ready || !sliders || !persona) return null

  const niveauGroep = getNiveauGroep(niveau.schoolType)
  const reflectiePrompt = reflectiePromptPerNiveau[niveauGroep]
  const placeholder = placeholderPerNiveau[niveauGroep]

  const handleSubmit = async () => {
    setPhase('loading')
    try {
      const res = await fetch('/api/k-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaName: persona.name,
          personaBaseDescription: persona.baseDescription,
          niveau: niveau.schoolType,
          leerjaar: niveau.leerjaar,
          reflectionText: reflectionText.trim(),
        }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setAiDescription(data.description?.trim() || persona.baseDescription)
    } catch {
      setAiDescription(persona.baseDescription)
    }
    setPhase('reveal')
  }

  const handleContinue = () => {
    markTransitionSeen(TRANSITION_ID)
    router.push('/leerpad/instrueren')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-light/30 to-white">
      <Header />

      <main className="flex-1 py-10 md:py-14">
        <div className="container mx-auto px-4 max-w-2xl">
          {phase === 'input' && (
            <div className="animate-in fade-in duration-300">
              <div className="text-center mb-6">
                <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">K — Kiezen</p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Goed bezig.</h1>
                <p className="text-gray-600">
                  Op basis van jouw inschattingen ontvang je zo een persoonlijk profiel.
                  Eerst nog één ding: schrijf zelf even op hoe je AI inzet.
                </p>
              </div>

              <div className="bg-white rounded-2xl border shadow-sm p-6 md:p-8">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  {reflectiePrompt}
                </label>
                <textarea
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder={placeholder}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  maxLength={600}
                />
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>{reflectionText.length}/600</span>
                  <span className="italic">Geen perfect antwoord — schrijf wat eerlijk klopt voor jou.</span>
                </div>
              </div>

              <div className="text-center mt-6">
                <Button onClick={handleSubmit} size="lg" className="px-8">
                  Onthul mijn profiel
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {phase === 'loading' && (
            <div className="text-center py-20 animate-in fade-in duration-300">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-gray-600 text-sm">Je profiel wordt gemaakt…</p>
            </div>
          )}

          {phase === 'reveal' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="text-center mb-6">
                <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-1">Jouw K-profiel</p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{persona.name}</h1>
              </div>

              <div className="bg-white rounded-2xl border shadow-sm p-6 md:p-8 text-center">
                <div className="mx-auto mb-5 w-40 h-40 md:w-52 md:h-52 rounded-2xl bg-primary-light/40 flex items-center justify-center overflow-hidden">
                  {!imageError ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={persona.imageFile}
                      alt={persona.name}
                      className="w-full h-full object-contain"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="text-center px-3">
                      <Sparkles className="h-10 w-10 text-primary mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Plaatje volgt</p>
                    </div>
                  )}
                </div>

                <p className="text-base md:text-lg text-gray-800 leading-relaxed mb-3">
                  {aiDescription}
                </p>
                <p className="text-xs text-gray-500 italic">
                  {persona.baseDescription}
                </p>
              </div>

              <div className="text-center mt-8">
                <Button onClick={handleContinue} size="lg" className="px-8">
                  Door naar Instrueren
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
