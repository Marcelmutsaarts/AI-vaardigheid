'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Bot, Check, Download, Users } from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'
import { getNiveauGroep } from '@/lib/transition-utils'
import { getPersona, type AxisValue, type Persona } from '@/lib/persona-data'
import {
  casusPerNiveau,
  themasInVolgorde,
  type ThemaId,
} from '@/lib/spelregels-cases'
import ProgressStepper from '@/components/navigation/ProgressStepper'

const STORAGE_KEY = 'kies-spelregels-state'
const K2_STORAGE_KEY = 'kies-k2-state'
const MIN_CONCLUSIE_LEN = 20

type Phase = 'infographic' | 'casussen' | 'rapport' | 'klaar'
type Niveau = 'vmbo' | 'havo' | 'vwo'

interface SavedState {
  phase: Phase
  conclusies: Record<ThemaId, string>
}

const defaultConclusies: Record<ThemaId, string> = {
  privacy: '',
  transparantie: '',
  duurzaamheid: '',
}

const themaKleuren: Record<ThemaId, { soft: string; border: string; text: string; accent: string }> = {
  privacy: { soft: '#fef2f2', border: '#fca5a5', text: '#b91c1c', accent: '#ef4444' },
  transparantie: { soft: '#fffbeb', border: '#fcd34d', text: '#b45309', accent: '#f59e0b' },
  duurzaamheid: { soft: '#f0fdf4', border: '#86efac', text: '#15803d', accent: '#22c55e' },
}

const niveauTeksten: Record<Niveau, {
  introBubble: string
  introButton: string
  casussenHeading: string
  casussenIntro: string
  besprekenLabel: string
  conclusieLabel: string
  conclusiePlaceholder: string
  conclusieMinHint: string
  naarRapportButton: string
  rapportPersonaBubble: string
  rapportTitel: string
  rapportSubtitle: string
  downloadButton: string
  afrondenButton: string
  klaarHeading: string
  klaarBody: string
}> = {
  vmbo: {
    introBubble: 'Bekijk eerst dit plaatje goed. Daarna doe je drie casussen samen met een klasgenoot. Aan het eind krijg je een eigen rapport.',
    introButton: 'Verder met de casussen',
    casussenHeading: 'Drie casussen',
    casussenIntro: 'Bespreek elke casus met een klasgenoot of in een groepje. Schrijf daarna kort op wat jij ervan vindt.',
    besprekenLabel: 'Bespreek dit met je buurman of in je groepje',
    conclusieLabel: 'Mijn conclusie',
    conclusiePlaceholder: 'Wat vind jij na het gesprek? Schrijf je conclusie hier op.',
    conclusieMinHint: 'Schrijf minstens een paar zinnen.',
    naarRapportButton: 'Bekijk mijn rapport',
    rapportPersonaBubble: 'Mooi werk! Hier is jouw rapport over de drie thema\'s. Je kunt het downloaden.',
    rapportTitel: 'Mijn AI-rapport',
    rapportSubtitle: 'Drie thema\'s, drie conclusies',
    downloadButton: 'Download als afbeelding',
    afrondenButton: 'Module afronden',
    klaarHeading: 'Klaar!',
    klaarBody: 'Je hebt alle vier de KIES-onderdelen gedaan. Tof. Bekijk je overzicht of ga terug naar het dashboard.',
  },
  havo: {
    introBubble: 'Bekijk eerst de infographic. Daarna ga je drie casussen bespreken met een klasgenoot of in een groepje. Aan het eind krijg je je eigen rapport.',
    introButton: 'Verder met de casussen',
    casussenHeading: 'Drie casussen',
    casussenIntro: 'Bespreek elke casus met een klasgenoot of in een groepje. Schrijf daarna jouw conclusie op — wat neem je mee uit het gesprek?',
    besprekenLabel: 'Bespreek met een klasgenoot of in je groepje',
    conclusieLabel: 'Mijn conclusie na het gesprek',
    conclusiePlaceholder: 'Wat vind jij na het gesprek? Wat neem je mee?',
    conclusieMinHint: 'Schrijf minstens een paar zinnen.',
    naarRapportButton: 'Bekijk mijn rapport',
    rapportPersonaBubble: 'Mooi werk. Hier is jouw rapport — drie thema\'s, drie conclusies. Je kunt het downloaden om te bewaren.',
    rapportTitel: 'Mijn AI-rapport',
    rapportSubtitle: 'Drie thema\'s, drie conclusies',
    downloadButton: 'Download als afbeelding',
    afrondenButton: 'Module afronden',
    klaarHeading: 'KIES afgerond.',
    klaarBody: 'Je hebt alle vier de onderdelen doorlopen. Bekijk je overzicht of ga terug naar het dashboard.',
  },
  vwo: {
    introBubble: 'Bekijk eerst de infographic. Daarna bespreek je drie casussen met een klasgenoot of in een groepje. Aan het eind formuleer je per thema je conclusie en krijg je een rapport.',
    introButton: 'Verder met de casussen',
    casussenHeading: 'Drie casussen',
    casussenIntro: 'Bespreek elke casus met een klasgenoot of in een groepje. Formuleer daarna je eigen conclusie — wat is jouw positie na het gesprek?',
    besprekenLabel: 'Bespreek met een klasgenoot of in je groepje',
    conclusieLabel: 'Mijn conclusie na het gesprek',
    conclusiePlaceholder: 'Wat is jouw positie na het gesprek? Welke argumenten wegen voor jou het zwaarst?',
    conclusieMinHint: 'Geef je redenering kort weer.',
    naarRapportButton: 'Genereer mijn rapport',
    rapportPersonaBubble: 'Mooi werk. Hier is jouw rapport — drie thema\'s, drie geformuleerde posities. Je kunt het bewaren of delen.',
    rapportTitel: 'Mijn AI-rapport',
    rapportSubtitle: 'Drie thema\'s, drie posities',
    downloadButton: 'Download als afbeelding',
    afrondenButton: 'Module afronden',
    klaarHeading: 'KIES afgerond.',
    klaarBody: 'Vier onderdelen doorlopen. Bekijk je overzicht of keer terug naar het dashboard.',
  },
}

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

export default function SpelregelsPage() {
  const router = useRouter()
  const { niveau, updateProgress } = useNiveau()
  const [ready, setReady] = useState(false)
  const [persona, setPersona] = useState<Persona | null>(null)
  const [phase, setPhase] = useState<Phase>('infographic')
  const [conclusies, setConclusies] = useState<Record<ThemaId, string>>(defaultConclusies)
  const [downloading, setDownloading] = useState(false)
  const rapportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
      return
    }

    const sliders = readSliders()
    if (sliders) {
      setPersona(getPersona(sliders.totaalLeren, sliders.totaalKwaliteit, sliders.totaalSnelheid))
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: SavedState = JSON.parse(saved)
        setPhase(parsed.phase ?? 'infographic')
        setConclusies({ ...defaultConclusies, ...(parsed.conclusies ?? {}) })
      }
    } catch { /* graceful fail */ }

    setReady(true)
  }, [niveau, router])

  useEffect(() => {
    if (!ready) return
    const state: SavedState = { phase, conclusies }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch { /* graceful fail */ }
  }, [phase, conclusies, ready])

  if (!ready) return null

  const niveauGroep = getNiveauGroep(niveau.schoolType)
  const t = niveauTeksten[niveauGroep]
  const allCasussen = casusPerNiveau[niveauGroep]

  const handleConclusieChange = (thema: ThemaId, value: string) => {
    setConclusies(prev => ({ ...prev, [thema]: value.slice(0, 600) }))
  }

  const allConclusiesFilled = themasInVolgorde.every(
    thema => conclusies[thema].trim().length >= MIN_CONCLUSIE_LEN
  )

  const handleDownloadRapport = async () => {
    if (!rapportRef.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(rapportRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        allowTaint: false,
      })
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      const cleanName = (persona?.name?.replace(/^De\s+/i, '') ?? 'spelregels').replace(/[^a-z0-9]+/gi, '-').toLowerCase()
      link.download = `mijn-ai-rapport-${cleanName}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Rapport download error:', err)
    } finally {
      setDownloading(false)
    }
  }

  const handleAfronden = () => {
    updateProgress('spelregels', 's1', true)
    updateProgress('spelregels', 's2', true)
    updateProgress('spelregels', 's3', true)
    setPhase('klaar')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <ProgressStepper activeLetter="spelregels" />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Dashboard
          </Link>

          <div className="mb-6">
            <div className="flex items-center gap-3">
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

          {/* === FASE 1: INFOGRAPHIC === */}
          {phase === 'infographic' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-start gap-3 mb-6">
                <PersonaAvatar persona={persona} size="md" />
                <div className="flex-1 bg-white rounded-2xl rounded-tl-sm border shadow-sm p-4 relative">
                  <div className="absolute -left-2 top-3 w-3 h-3 bg-white border-l border-t rotate-[-45deg]" />
                  <p className="text-sm md:text-base text-gray-800 leading-relaxed">
                    {t.introBubble}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-6">
                <Image
                  src="/infographic-spelregels.png"
                  alt="AI op school? Praat mee! Infographic over privacy, transparantie en duurzaamheid bij AI-gebruik"
                  width={1200}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
              </div>

              <div className="text-center">
                <Button onClick={() => setPhase('casussen')} size="lg" className="px-8">
                  {t.introButton}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* === FASE 2: CASUSSEN OP 1 PAGINA === */}
          {phase === 'casussen' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-start gap-3 mb-6">
                <PersonaAvatar persona={persona} size="md" />
                <div className="flex-1 bg-white rounded-2xl rounded-tl-sm border shadow-sm p-4 relative">
                  <div className="absolute -left-2 top-3 w-3 h-3 bg-white border-l border-t rotate-[-45deg]" />
                  <h2 className="font-bold text-gray-900 mb-1">{t.casussenHeading}</h2>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    {t.casussenIntro}
                  </p>
                </div>
              </div>

              <div className="space-y-6 mb-6">
                {themasInVolgorde.map((thema, i) => {
                  const c = allCasussen[thema]
                  const k = themaKleuren[thema]
                  const conclusieLen = conclusies[thema].trim().length
                  const minMet = conclusieLen >= MIN_CONCLUSIE_LEN

                  return (
                    <div key={thema} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                      {/* Thema header strip */}
                      <div
                        className="px-5 py-3 flex items-center justify-between"
                        style={{ backgroundColor: k.soft, borderBottom: `2px solid ${k.border}` }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{c.emoji}</span>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Casus {i + 1}
                            </p>
                            <h3 className="font-bold text-base" style={{ color: k.text }}>
                              {c.themaLabel}
                            </h3>
                          </div>
                        </div>
                        {minMet && (
                          <Check className="h-5 w-5 text-green-600" />
                        )}
                      </div>

                      <div className="p-5">
                        <p className="text-sm md:text-base text-gray-800 leading-relaxed mb-4">
                          {c.scenario}
                        </p>

                        {/* Bespreken hint */}
                        <div className="flex items-center gap-2 text-xs text-primary bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 mb-4">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium">{t.besprekenLabel}</span>
                        </div>

                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          {t.conclusieLabel}
                        </label>
                        <textarea
                          value={conclusies[thema]}
                          onChange={(e) => handleConclusieChange(thema, e.target.value)}
                          placeholder={t.conclusiePlaceholder}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                          maxLength={600}
                        />
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs ${minMet ? 'text-green-600' : 'text-gray-400'}`}>
                            {minMet ? '✓ klaar' : t.conclusieMinHint}
                          </span>
                          <span className="text-xs text-gray-400">{conclusieLen}/600</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="text-center">
                <Button
                  onClick={() => setPhase('rapport')}
                  disabled={!allConclusiesFilled}
                  size="lg"
                  className="px-8"
                >
                  {t.naarRapportButton}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                {!allConclusiesFilled && (
                  <p className="text-xs text-gray-500 mt-2">
                    Vul alle drie de conclusies in om je rapport te zien.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* === FASE 3: RAPPORT === */}
          {phase === 'rapport' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-start gap-3 mb-6">
                <PersonaAvatar persona={persona} size="md" />
                <div className="flex-1 bg-white rounded-2xl rounded-tl-sm border shadow-sm p-4 relative">
                  <div className="absolute -left-2 top-3 w-3 h-3 bg-white border-l border-t rotate-[-45deg]" />
                  <p className="text-sm md:text-base text-gray-800 leading-relaxed">
                    {t.rapportPersonaBubble}
                  </p>
                </div>
              </div>

              {/* === HET RAPPORT === */}
              <div className="overflow-x-auto mb-4">
                <div
                  ref={rapportRef}
                  className="mx-auto"
                  style={{
                    width: 720,
                    background: 'linear-gradient(180deg, #ffffff 0%, #faf5ff 100%)',
                    borderRadius: 20,
                    padding: '40px 44px',
                    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                    border: '1px solid #e9d5ff',
                    boxShadow: '0 4px 24px rgba(139, 92, 246, 0.08)',
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 24,
                      marginBottom: 28,
                      paddingBottom: 18,
                      borderBottom: '2px solid #c4b5fd',
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>
                        KIES — Spelregels
                      </p>
                      <h1 style={{ fontSize: 30, fontWeight: 800, color: '#1f2937', margin: '4px 0 4px 0', letterSpacing: '-0.02em' }}>
                        {t.rapportTitel}
                      </h1>
                      <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                        {t.rapportSubtitle}
                      </p>
                    </div>
                    {persona && (
                      <div style={{ flexShrink: 0, textAlign: 'center' }}>
                        <div
                          style={{
                            width: 96,
                            height: 96,
                            borderRadius: 16,
                            overflow: 'hidden',
                            border: '3px solid #a15df5',
                            backgroundColor: '#f3e8ff',
                            boxShadow: '0 4px 12px rgba(161, 93, 245, 0.15)',
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={persona.imageFile}
                            alt={persona.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            crossOrigin="anonymous"
                          />
                        </div>
                        <p style={{ fontSize: 10, color: '#6b7280', marginTop: 6, marginBottom: 0, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          door
                        </p>
                        <p style={{ fontSize: 13, color: '#1f2937', fontWeight: 700, margin: 0 }}>
                          {persona.name}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Drie thema-secties */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                    {themasInVolgorde.map(thema => {
                      const c = allCasussen[thema]
                      const k = themaKleuren[thema]
                      return (
                        <div
                          key={thema}
                          style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 12,
                            padding: '16px 20px',
                            borderLeft: `5px solid ${k.accent}`,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                backgroundColor: k.soft,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 18,
                              }}
                            >
                              {c.emoji}
                            </div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: k.text, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                              {c.themaLabel}
                            </p>
                          </div>
                          <p style={{ fontSize: 14, color: '#1f2937', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                            {conclusies[thema]}
                          </p>
                        </div>
                      )
                    })}
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      borderTop: '1px solid #c4b5fd',
                      paddingTop: 14,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 11,
                      color: '#7c3aed',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>AI voor Docenten · KIES Leeromgeving</span>
                    <span>{new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleDownloadRapport}
                  disabled={downloading}
                  variant="outline"
                  size="lg"
                  className="px-6"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {downloading ? 'Bezig...' : t.downloadButton}
                </Button>
                <Button onClick={handleAfronden} size="lg" className="px-6">
                  {t.afrondenButton}
                  <Check className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* === FASE 4: KLAAR === */}
          {phase === 'klaar' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                <Check className="h-10 w-10 text-green-600 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-green-900 mb-2">{t.klaarHeading}</h2>
                <p className="text-sm md:text-base text-green-700 mb-5">{t.klaarBody}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/diploma"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-white font-medium transition-all hover:opacity-90"
                    style={{ backgroundColor: kiesKleuren.spelregels }}
                  >
                    Bekijk je KIES-overzicht
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                  >
                    Naar dashboard
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
