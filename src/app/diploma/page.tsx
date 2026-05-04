'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Bot, Download } from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'
import { getNiveauGroep } from '@/lib/transition-utils'
import { getPersona, type AxisValue, type Persona } from '@/lib/persona-data'
import {
  casusPerNiveau,
  themasInVolgorde,
  type ThemaId,
} from '@/lib/spelregels-cases'
import { samenRollen, aiDoetRollen } from '@/lib/k1-roles-data'

const K2_STORAGE_KEY = 'kies-k2-state'
const K1_ROLES_KEY = 'kies-k1-roles-tried'
const S_STORAGE_KEY = 'kies-spelregels-state'
const PERSONA_DESC_KEY = 'kies-persona-description'

interface SliderValues {
  totaalLeren: AxisValue
  totaalKwaliteit: AxisValue
  totaalSnelheid: AxisValue
}

interface K2Stap {
  id: string
  titel: string
  approach: { type: 'zelf' } | { type: 'roles'; roles: Array<{ id: string; category: 'aihelpt' | 'aidoet'; name: string; emoji: string }> } | null
}

interface K2State {
  gekozenOpdracht?: { titel?: string } | null
  stappen?: K2Stap[]
  totaalLeren?: AxisValue
  totaalKwaliteit?: AxisValue
  totaalSnelheid?: AxisValue
}

interface K1RolesState {
  triedRoles?: string[]
}

interface SpelregelsState {
  conclusies?: Record<ThemaId, string>
}

function readK2State(): K2State | null {
  try {
    const raw = localStorage.getItem(K2_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function readK1Tried(): string[] {
  try {
    const raw = localStorage.getItem(K1_ROLES_KEY)
    if (!raw) return []
    const parsed: K1RolesState = JSON.parse(raw)
    return parsed.triedRoles ?? []
  } catch {
    return []
  }
}

function readSConclusies(): Record<ThemaId, string> | null {
  try {
    const raw = localStorage.getItem(S_STORAGE_KEY)
    if (!raw) return null
    const parsed: SpelregelsState = JSON.parse(raw)
    return parsed.conclusies ?? null
  } catch {
    return null
  }
}

function readPersonaDescription(): string | null {
  try {
    return localStorage.getItem(PERSONA_DESC_KEY)
  } catch {
    return null
  }
}

function getSliderValues(state: K2State | null): SliderValues | null {
  if (!state) return null
  const l = state.totaalLeren
  const k = state.totaalKwaliteit
  const s = state.totaalSnelheid
  if (l !== -1 && l !== 0 && l !== 1) return null
  if (k !== -1 && k !== 0 && k !== 1) return null
  if (s !== -1 && s !== 0 && s !== 1) return null
  return { totaalLeren: l, totaalKwaliteit: k, totaalSnelheid: s }
}

const themaKleuren: Record<ThemaId, { soft: string; border: string; text: string; accent: string }> = {
  privacy: { soft: '#fef2f2', border: '#fca5a5', text: '#b91c1c', accent: '#ef4444' },
  transparantie: { soft: '#fffbeb', border: '#fcd34d', text: '#b45309', accent: '#f59e0b' },
  duurzaamheid: { soft: '#f0fdf4', border: '#86efac', text: '#15803d', accent: '#22c55e' },
}

const promptOnderdelen = [
  { nummer: 1, titel: 'Rol', vraag: 'Wie is de AI?' },
  { nummer: 2, titel: 'Context', vraag: 'Wat is de situatie?' },
  { nummer: 3, titel: 'Instructies', vraag: 'Wat moet AI doen?' },
  { nummer: 4, titel: 'Voorbeeld', vraag: 'Hoe moet het eruitzien?' },
]

const eValkuilen = [
  { emoji: '🎭', naam: 'Vooroordelen', tip: 'AI maakt aannames over mensen' },
  { emoji: '🌀', naam: 'Verzinsels', tip: 'AI geeft zelfverzekerd onjuiste feiten' },
  { emoji: '😊', naam: 'Ja-knikken', tip: 'AI is het te snel met je eens' },
]

const eMensAiMens = [
  { label: 'Begrijpen', icon: '🧑', sub: 'Jij weet wat je wil weten' },
  { label: 'Checken', icon: '🤖', sub: 'AI doet een poging' },
  { label: 'Aanpassen', icon: '🧑', sub: 'Jij beoordeelt en bewerkt' },
]

function findRoleById(id: string) {
  return samenRollen.find(r => r.id === id) ?? aiDoetRollen.find(r => r.id === id) ?? null
}

export default function DiplomaPage() {
  const router = useRouter()
  const { niveau } = useNiveau()
  const [naam, setNaam] = useState('')
  const [persona, setPersona] = useState<Persona | null>(null)
  const [personaDescription, setPersonaDescription] = useState<string | null>(null)
  const [k2State, setK2State] = useState<K2State | null>(null)
  const [k1Tried, setK1Tried] = useState<string[]>([])
  const [sConclusies, setSConclusies] = useState<Record<ThemaId, string> | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [ready, setReady] = useState(false)
  const rapportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
      return
    }

    const k2 = readK2State()
    setK2State(k2)
    setK1Tried(readK1Tried())
    setSConclusies(readSConclusies())

    const sliders = getSliderValues(k2)
    if (sliders) {
      const p = getPersona(sliders.totaalLeren, sliders.totaalKwaliteit, sliders.totaalSnelheid)
      setPersona(p)
      const stored = readPersonaDescription()
      setPersonaDescription(stored && stored.length > 0 ? stored : p.baseDescription)
    }

    setReady(true)
  }, [niveau, router])

  if (!ready) return null

  const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
  if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) return null

  const niveauLabel = niveau.leerjaar
    ? `${niveau.schoolType.toUpperCase()} ${niveau.leerjaar}`
    : niveau.schoolType.toUpperCase()
  const niveauGroep = getNiveauGroep(niveau.schoolType)
  const sCasussen = casusPerNiveau[niveauGroep]

  const triedSamen = k1Tried.filter(id => samenRollen.some(r => r.id === id))
  const triedAiDoet = k1Tried.filter(id => aiDoetRollen.some(r => r.id === id))
  const opdrachtTitel = k2State?.gekozenOpdracht?.titel ?? null
  const stappen = k2State?.stappen ?? []
  const stappenIngevuld = stappen.filter(s => s.titel?.trim().length > 0)

  const handleDownload = async () => {
    if (!rapportRef.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(rapportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: false,
      })
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      const cleanName = (naam.trim() || persona?.name?.replace(/^De\s+/i, '') || 'kies-overzicht')
        .replace(/[^a-z0-9]+/gi, '-')
        .toLowerCase()
      link.download = `kies-overzicht-${cleanName}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Download error:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Terug naar dashboard
          </Link>
        </div>
      </div>

      {/* Intro / settings */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white rounded-2xl border shadow-sm p-5 md:p-6 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Mijn KIES-overzicht</h1>
          <p className="text-sm text-gray-600 mb-4">Een persoonlijke samenvatting van wat jij hebt gedaan in KIES.</p>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Wil je je naam op je rapport? (optioneel)
              </label>
              <input
                type="text"
                value={naam}
                onChange={(e) => setNaam(e.target.value)}
                placeholder="Je naam..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <Button onClick={handleDownload} disabled={downloading} size="lg" className="sm:w-auto w-full">
              <Download className="h-4 w-4 mr-2" />
              {downloading ? 'Bezig...' : 'Download als afbeelding'}
            </Button>
          </div>
        </div>

        {/* === HET RAPPORT === */}
        <div className="overflow-x-auto">
          <div
            ref={rapportRef}
            className="mx-auto"
            style={{
              width: 820,
              background: 'linear-gradient(180deg, #ffffff 0%, #faf5ff 100%)',
              borderRadius: 24,
              padding: '40px 44px',
              fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
              border: '1px solid #e9d5ff',
              boxShadow: '0 4px 24px rgba(139, 92, 246, 0.08)',
            }}
          >
            {/* Header strip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 16,
                borderBottom: '2px solid #c4b5fd',
                marginBottom: 28,
              }}
            >
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>
                  KIES — AI-vaardigheid voor docenten
                </p>
                <h1 style={{ fontSize: 30, fontWeight: 800, color: '#1f2937', margin: '4px 0 0 0', letterSpacing: '-0.02em' }}>
                  Mijn KIES-overzicht
                </h1>
              </div>
              <div style={{ textAlign: 'right' }}>
                {naam.trim() && (
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#1f2937', margin: 0 }}>{naam.trim()}</p>
                )}
                <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>
                  {niveauLabel} · {new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* HERO — Persona */}
            <div
              style={{
                display: 'flex',
                gap: 24,
                alignItems: 'center',
                padding: '20px 22px',
                background: 'linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%)',
                border: '1px solid #e9d5ff',
                borderRadius: 18,
                marginBottom: 28,
              }}
            >
              {/* Persona portret */}
              <div style={{ flexShrink: 0 }}>
                {persona ? (
                  <div
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: 18,
                      overflow: 'hidden',
                      border: '4px solid #a15df5',
                      boxShadow: '0 6px 16px rgba(161, 93, 245, 0.2)',
                      backgroundColor: '#f3e8ff',
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
                ) : (
                  <div
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: 18,
                      backgroundColor: '#f3e8ff',
                      border: '4px solid #a15df5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Bot style={{ width: 64, height: 64, color: '#7c3aed' }} />
                  </div>
                )}
              </div>

              {/* Persona tekst */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
                  Jouw KIES-profiel
                </p>
                <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1f2937', margin: '4px 0 8px 0', letterSpacing: '-0.01em' }}>
                  {persona ? persona.name : 'Nog geen profiel'}
                </h2>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.55, margin: 0 }}>
                  {personaDescription ?? 'Maak K-Kiezen af om je persoonlijk profiel te ontdekken.'}
                </p>
              </div>
            </div>

            {/* === K - Kiezen === */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: kiesKleuren.kiezen,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  K
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1f2937', margin: 0 }}>
                  Kiezen — wat jij koos
                </h3>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 14,
                  padding: '16px 18px',
                  borderLeft: `5px solid ${kiesKleuren.kiezen}`,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                {/* K1: rollen die je probeerde */}
                {k1Tried.length > 0 ? (
                  <div style={{ marginBottom: opdrachtTitel ? 16 : 0 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px 0' }}>
                      AI-rollen die jij hebt geprobeerd
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {[...triedSamen, ...triedAiDoet].map(id => {
                        const role = findRoleById(id)
                        if (!role) return null
                        return (
                          <span
                            key={id}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              fontSize: 12,
                              fontWeight: 600,
                              backgroundColor: '#f3e8ff',
                              color: '#6b21a8',
                              padding: '4px 10px',
                              borderRadius: 999,
                              border: '1px solid #d8b4fe',
                            }}
                          >
                            <span>{role.emoji}</span> {role.titel}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                ) : null}

                {/* K2: opdracht + stappen-aanpak */}
                {opdrachtTitel ? (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px 0' }}>
                      Jouw opdracht in K2
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1f2937', margin: '0 0 10px 0' }}>
                      {opdrachtTitel}
                    </p>
                    {stappenIngevuld.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {stappenIngevuld.map((stap, i) => (
                          <div
                            key={stap.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              padding: '8px 10px',
                              backgroundColor: '#faf5ff',
                              borderRadius: 8,
                              border: '1px solid #e9d5ff',
                            }}
                          >
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', minWidth: 22 }}>{i + 1}.</span>
                            <span style={{ fontSize: 13, color: '#1f2937', flex: 1, minWidth: 0 }}>{stap.titel}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                              {stap.approach?.type === 'zelf' && (
                                <span style={{ fontSize: 11, fontWeight: 600, color: '#374151', backgroundColor: '#e5e7eb', padding: '3px 8px', borderRadius: 999 }}>
                                  ✋ Zelf
                                </span>
                              )}
                              {stap.approach?.type === 'roles' && stap.approach.roles.map(r => (
                                <span
                                  key={r.id}
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: '#6b21a8',
                                    backgroundColor: '#f3e8ff',
                                    padding: '3px 8px',
                                    borderRadius: 999,
                                    border: '1px solid #d8b4fe',
                                  }}
                                >
                                  {r.emoji} {r.name}
                                </span>
                              ))}
                              {!stap.approach && (
                                <span style={{ fontSize: 11, color: '#9ca3af' }}>—</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}

                {!opdrachtTitel && k1Tried.length === 0 && (
                  <p style={{ fontSize: 13, color: '#9ca3af', margin: 0, fontStyle: 'italic' }}>
                    Nog geen K-werk gevonden.
                  </p>
                )}
              </div>
            </div>

            {/* === I - Instrueren === */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: kiesKleuren.instrueren,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  I
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1f2937', margin: 0 }}>
                  Instrueren — vier delen van een sterke prompt
                </h3>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 14,
                  padding: '14px 18px',
                  borderLeft: `5px solid ${kiesKleuren.instrueren}`,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 10,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                {promptOnderdelen.map(o => (
                  <div key={o.nummer} style={{ textAlign: 'center', padding: '8px 4px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        borderRadius: 999,
                        backgroundColor: kiesKleuren.instrueren,
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 700,
                        marginBottom: 6,
                      }}
                    >
                      {o.nummer}
                    </span>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#1f2937', margin: 0 }}>{o.titel}</p>
                    <p style={{ fontSize: 11, color: '#6b7280', margin: '2px 0 0 0' }}>{o.vraag}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* === E - Evalueren === */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: kiesKleuren.evalueren,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  E
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1f2937', margin: 0 }}>
                  Evalueren — Mens-AI-Mens checken
                </h3>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 14,
                  padding: '14px 18px',
                  borderLeft: `5px solid ${kiesKleuren.evalueren}`,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                {/* Mens-AI-Mens flow */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 14 }}>
                  {eMensAiMens.map((step, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                      <div style={{ flex: 1, textAlign: 'center', padding: '10px 6px', backgroundColor: '#faf5ff', borderRadius: 10, border: '1px solid #e9d5ff' }}>
                        <div style={{ fontSize: 22 }}>{step.icon}</div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#1f2937', margin: '2px 0 0 0' }}>{step.label}</p>
                        <p style={{ fontSize: 10, color: '#6b7280', margin: '2px 0 0 0' }}>{step.sub}</p>
                      </div>
                      {i < eMensAiMens.length - 1 && (
                        <span style={{ fontSize: 18, color: '#a15df5', flexShrink: 0 }}>→</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Drie valkuilen */}
                <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px 0' }}>
                  Drie valkuilen die jij leert herkennen
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {eValkuilen.map(v => (
                    <div
                      key={v.naam}
                      style={{
                        padding: '10px 12px',
                        backgroundColor: '#fffbeb',
                        borderRadius: 10,
                        border: '1px solid #fcd34d',
                      }}
                    >
                      <div style={{ fontSize: 18, marginBottom: 4 }}>{v.emoji}</div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#1f2937', margin: 0 }}>{v.naam}</p>
                      <p style={{ fontSize: 11, color: '#6b7280', margin: '2px 0 0 0', lineHeight: 1.4 }}>{v.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* === S - Spelregels — eigen conclusies === */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: kiesKleuren.spelregels,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  S
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1f2937', margin: 0 }}>
                  Spelregels — jouw conclusies
                </h3>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 14,
                  padding: '14px 18px',
                  borderLeft: `5px solid ${kiesKleuren.spelregels}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                {themasInVolgorde.map(thema => {
                  const c = sCasussen[thema]
                  const k = themaKleuren[thema]
                  const eigenConclusie = sConclusies?.[thema]?.trim()
                  return (
                    <div
                      key={thema}
                      style={{
                        backgroundColor: k.soft,
                        border: `1px solid ${k.border}`,
                        borderRadius: 10,
                        padding: '10px 14px',
                        display: 'flex',
                        gap: 12,
                        alignItems: 'flex-start',
                      }}
                    >
                      <div style={{ fontSize: 22, flexShrink: 0 }}>{c.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: k.text, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '2px 0 4px 0' }}>
                          {c.themaLabel}
                        </p>
                        <p style={{ fontSize: 13, color: '#1f2937', lineHeight: 1.55, margin: 0, whiteSpace: 'pre-wrap' }}>
                          {eigenConclusie && eigenConclusie.length > 0
                            ? eigenConclusie
                            : <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Nog geen conclusie ingevuld.</span>
                          }
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
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
              <span>aivoordocenten.nl</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
