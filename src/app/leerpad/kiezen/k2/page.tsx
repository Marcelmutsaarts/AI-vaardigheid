'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, ChevronDown, Plus, X, MessageCircle, Send, Loader2, CheckCircle2 } from 'lucide-react'
import ApproachDropdown, { StepApproach } from '@/components/k2/ApproachDropdown'
import { kiesKleuren } from '@/lib/utils'
import {
  getOpdrachtenVoorNiveau,
  OpdrachtOptie,
  aiHelptRollen,
  aiDoetRollen,
  Aanpak,
  k2Teksten
} from '@/lib/kiezen-content'
import { getNiveauGroep } from '@/lib/transition-utils'
import ProgressStepper from '@/components/navigation/ProgressStepper'

interface Stap {
  id: string
  titel: string
  approach: StepApproach | null  // new multi-select approach
  // Backward compat fields (derived from approach, used by S2 and localStorage)
  aanpak?: Aanpak | null
  rol?: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

type Phase = 'kiezen' | 'aanpak' | 'resultaat' | 'experimenteren'

const STORAGE_KEY = 'kies-k2-state'
const DEFAULT_VELDEN = 5
const MAX_VELDEN = 8

interface K2State {
  phase: Phase
  gekozenOpdracht: OpdrachtOptie | null
  stapVelden: string[]
  stappen: Stap[]
  totaalLeren: number | null
  totaalKwaliteit: number | null
  totaalSnelheid: number | null
}

export default function K2Page() {
  const router = useRouter()
  const { niveau, updateProgress } = useNiveau()
  const [phase, setPhase] = useState<Phase>('kiezen')
  const [gekozenOpdracht, setGekozenOpdracht] = useState<OpdrachtOptie | null>(null)
  const [stapVelden, setStapVelden] = useState<string[]>(Array(DEFAULT_VELDEN).fill(''))
  const [stappen, setStappen] = useState<Stap[]>([])
  const [totaalLeren, setTotaalLeren] = useState<number | null>(null)
  const [totaalKwaliteit, setTotaalKwaliteit] = useState<number | null>(null)
  const [totaalSnelheid, setTotaalSnelheid] = useState<number | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Two-column specific state
  const [pendingOpdracht, setPendingOpdracht] = useState<OpdrachtOptie | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const rightColumnRef = useRef<HTMLDivElement>(null)

  // Chat state
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatStreamingContent, setChatStreamingContent] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Samenvatting state
  const [strategieSamenvatting, setStrategieSamenvatting] = useState('')
  const [samenvattingLoading, setSamenvattingLoading] = useState(false)

  // Experimenteer state
  const [wilVerbeteren, setWilVerbeteren] = useState(false)
  const [verbeterOptie, setVerbeterOptie] = useState<'leren' | 'kwaliteit' | 'snelheid' | null>(null)
  const [isAanpassen, setIsAanpassen] = useState(false)

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const state = JSON.parse(saved)
        // Backward compat: 'onderdelen' phase maps to 'kiezen'
        const loadedPhase = state.phase === 'onderdelen' ? 'kiezen' : state.phase
        if (loadedPhase) setPhase(loadedPhase as Phase)
        if (state.gekozenOpdracht) setGekozenOpdracht(state.gekozenOpdracht)
        if (state.stapVelden?.length) {
          setStapVelden(state.stapVelden)
        } else if (state.stappen?.length && (loadedPhase === 'kiezen')) {
          // Migrate old stappen to stapVelden
          const velden = state.stappen.map((s: Stap) => s.titel)
          while (velden.length < DEFAULT_VELDEN) velden.push('')
          setStapVelden(velden)
        }
        if (state.stappen) {
          // Migrate old format (aanpak/rol) to new format (approach) if needed
          const migratedStappen = state.stappen.map((s: any) => {
            if (s.approach !== undefined) return s  // Already new format
            // Migrate from old format
            let approach: StepApproach | null = null
            if (s.aanpak === 'zelf') {
              approach = { type: 'zelf' }
            } else if (s.aanpak && s.rol) {
              const rollen = s.aanpak === 'aihelpt' ? aiHelptRollen : aiDoetRollen
              const rolInfo = rollen.find((r: any) => r.id === s.rol)
              if (rolInfo) {
                approach = {
                  type: 'roles',
                  roles: [{ id: rolInfo.id, category: s.aanpak, name: rolInfo.titel, emoji: rolInfo.emoji }]
                }
              }
            }
            return { ...s, approach }
          })
          setStappen(migratedStappen)
        }
        if (state.totaalLeren !== undefined) setTotaalLeren(state.totaalLeren)
        if (state.totaalKwaliteit !== undefined) setTotaalKwaliteit(state.totaalKwaliteit)
        if (state.totaalSnelheid !== undefined) setTotaalSnelheid(state.totaalSnelheid)
      } catch (e) {
        console.error('Error loading K2 state:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save state to localStorage when it changes
  useEffect(() => {
    if (isLoaded) {
      const state: K2State = { phase, gekozenOpdracht, stapVelden, stappen, totaalLeren, totaalKwaliteit, totaalSnelheid }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [phase, gekozenOpdracht, stapVelden, stappen, totaalLeren, totaalKwaliteit, totaalSnelheid, isLoaded])

  useEffect(() => {
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
    }
  }, [niveau, router])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, chatStreamingContent])

  // Genereer samenvatting wanneer we naar resultaat fase gaan
  useEffect(() => {
    if (phase === 'resultaat' && !strategieSamenvatting && !samenvattingLoading && stappen.length > 0) {
      generateStrategieSamenvatting()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const generateStrategieSamenvatting = async () => {
    setSamenvattingLoading(true)
    const stappenBeschrijving = stappen.map(stap => {
      let aanpakTekst = ''
      if (!stap.approach) {
        aanpakTekst = 'nog niet gekozen'
      } else if (stap.approach.type === 'zelf') {
        aanpakTekst = 'zelf doen'
      } else {
        const names = stap.approach.roles.map(r => r.name).join(', ')
        aanpakTekst = `met AI (${names})`
      }
      return `- ${stap.titel}: ${aanpakTekst}`
    }).join('\n')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Vat mijn strategie samen',
          context: {
            niveau: niveau.schoolType,
            leerjaar: niveau.leerjaar,
            currentModule: 'kiezen',
            moduleContext: `Je bent een coach die een leerling helpt reflecteren op hun AI-strategie.\n\nOpdracht: ${gekozenOpdracht?.titel}\n\nGekozen aanpak per stap:\n${stappenBeschrijving}\n\nSchrijf in 2-3 korte, directe zinnen wat deze strategie inhoudt.\nGebruik "je" en spreek de leerling aan.\nWees neutraal - geen oordeel over goed of fout.\nFocus op WAT de leerling gaat doen, niet of het slim is.\nHoud het heel kort en concreet.`,
            aiMode: 'doet',
            conversationHistory: []
          }
        })
      })
      if (response.ok) {
        const data = await response.json()
        setStrategieSamenvatting(data.reply)
      } else {
        setStrategieSamenvatting('Je hebt je strategie bepaald. Bekijk hieronder wat dit betekent voor je leren en het eindresultaat.')
      }
    } catch {
      setStrategieSamenvatting('Je hebt je strategie bepaald. Bekijk hieronder wat dit betekent voor je leren en het eindresultaat.')
    } finally {
      setSamenvattingLoading(false)
    }
  }

  // MBO/HBO hebben geen leerjaar, VO niveaus wel
  const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
  if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
    return null
  }

  if (!isLoaded) {
    return null
  }

  const opdrachten = getOpdrachtenVoorNiveau(niveau.schoolType, niveau.leerjaar)
  const niveauGroep = getNiveauGroep(niveau.schoolType)
  const teksten = k2Teksten[niveauGroep]

  // Count filled fields
  const gevuldeVelden = stapVelden.filter(v => v.trim()).length
  const hasStappenIngevuld = gevuldeVelden > 0

  // ===== HANDLERS =====

  const handleKiesOpdracht = (opdracht: OpdrachtOptie) => {
    // If fields have content and switching opdracht, ask confirmation
    if (hasStappenIngevuld && gekozenOpdracht && gekozenOpdracht.id !== opdracht.id) {
      setPendingOpdracht(opdracht)
      return
    }
    selectOpdracht(opdracht)
  }

  const selectOpdracht = (opdracht: OpdrachtOptie) => {
    setGekozenOpdracht(opdracht)
    if (!hasStappenIngevuld) {
      setStapVelden(Array(DEFAULT_VELDEN).fill(''))
    }
    setChatMessages([{
      role: 'assistant',
      content: `Je hebt gekozen voor "${opdracht.titel}". Welke stappen denk je dat je moet zetten om dit te maken? Typ je ideeën, of vraag mij om suggesties!`
    }])
    // Auto-scroll and focus on mobile
    setTimeout(() => {
      if (window.innerWidth < 768) {
        rightColumnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      inputRefs.current[0]?.focus()
    }, 100)
  }

  const handleConfirmWissel = () => {
    if (pendingOpdracht) {
      setStapVelden(Array(DEFAULT_VELDEN).fill(''))
      selectOpdracht(pendingOpdracht)
      setPendingOpdracht(null)
    }
  }

  const handleCancelWissel = () => {
    setPendingOpdracht(null)
  }

  const handleStapVeldChange = (index: number, value: string) => {
    setStapVelden(prev => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleStapKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (index < stapVelden.length - 1) {
        inputRefs.current[index + 1]?.focus()
      } else if (stapVelden.length < MAX_VELDEN) {
        handleVoegVeldToe()
        setTimeout(() => inputRefs.current[stapVelden.length]?.focus(), 50)
      }
    }
  }

  const handleVoegVeldToe = () => {
    if (stapVelden.length < MAX_VELDEN) {
      setStapVelden(prev => [...prev, ''])
      setTimeout(() => inputRefs.current[stapVelden.length]?.focus(), 50)
    }
  }

  const handleVerder = () => {
    // Convert non-empty velden to Stap objects, preserving existing selections
    const nieuweStappen = stapVelden
      .filter(v => v.trim())
      .map((titel, i) => {
        const trimmed = titel.trim()
        // Preserve approach/aanpak/rol if the step title matches an existing step
        const existing = stappen.find(s => s.titel === trimmed)
        return {
          id: existing?.id || `stap-${Date.now()}-${i}`,
          titel: trimmed,
          approach: existing?.approach ?? null,
          // Backward compat
          aanpak: existing?.aanpak ?? null as Aanpak | null,
          rol: existing?.rol,
        }
      })
    setStappen(nieuweStappen)
    setPhase('aanpak')
  }

  const handleBackToKiezen = () => {
    // Restore stapVelden from stappen
    const velden = stappen.map(s => s.titel)
    while (velden.length < DEFAULT_VELDEN) velden.push('')
    setStapVelden(velden)
    setPhase('kiezen')
  }

  const deriveBackcompat = (approach: StepApproach | null): { aanpak: Aanpak | null; rol?: string } => {
    if (!approach) return { aanpak: null, rol: undefined }
    if (approach.type === 'zelf') return { aanpak: 'zelf', rol: undefined }
    // For multi-role, use the first role's category for backward compat
    const firstRole = approach.roles[0]
    return { aanpak: firstRole.category as Aanpak, rol: firstRole.id }
  }

  const handleSelectApproach = (stapId: string, approach: StepApproach | null) => {
    setStappen(prev => prev.map(s =>
      s.id === stapId ? { ...s, approach, ...deriveBackcompat(approach) } : s
    ))
    // Don't close dropdown here - the component handles that
  }

  const handleFinish = () => {
    updateProgress('kiezen', 'k2', true)
    setWilVerbeteren(false)
    setVerbeterOptie(null)
    setIsAanpassen(false)
    setPhase('experimenteren')
  }

  const handleBackToDashboard = () => {
    router.push('/leerpad/kiezen/k-complete')
  }

  const handleStartOver = () => {
    localStorage.removeItem(STORAGE_KEY)
    setPhase('kiezen')
    setGekozenOpdracht(null)
    setStapVelden(Array(DEFAULT_VELDEN).fill(''))
    setStappen([])
    setTotaalLeren(null)
    setTotaalKwaliteit(null)
    setTotaalSnelheid(null)
    setChatMessages([])
    setStrategieSamenvatting('')
    setWilVerbeteren(false)
    setVerbeterOptie(null)
    setIsAanpassen(false)
  }

  // Chat handler met streaming
  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return
    const userMessage = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setChatLoading(true)
    setChatStreamingContent('')

    const ingevuldeStappen = stapVelden.filter(v => v.trim())
    const bestaandeStappen = ingevuldeStappen.length > 0
      ? `\n\nAl ingevoerde stappen:\n${ingevuldeStappen.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
      : ''

    try {
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: {
            niveau: niveau.schoolType,
            leerjaar: niveau.leerjaar,
            currentModule: 'kiezen',
            moduleContext: `Opdracht: ${gekozenOpdracht?.titel}.${bestaandeStappen}\n\nDe leerling bepaalt zelf welke stappen nodig zijn. Help met suggesties voor stappen die nog missen. Geef maximaal 3-4 concrete suggesties per keer zoals "Onderwerp kiezen", "Informatie verzamelen", "Structuur maken". Houd het kort en praktisch. Als er al stappen zijn, bouw daarop voort.`,
            aiMode: 'helpt',
            conversationHistory: chatMessages
          }
        })
      })
      if (!response.ok) throw new Error('API error')
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader')
      const decoder = new TextDecoder()
      let fullContent = ''
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.content) {
                fullContent += data.content
                setChatStreamingContent(fullContent)
              }
            } catch { /* skip invalid JSON */ }
          }
        }
      }
      if (fullContent) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: fullContent }])
      }
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, er ging iets mis. Probeer het opnieuw.' }])
    } finally {
      setChatLoading(false)
      setChatStreamingContent('')
    }
  }

  // Helpers
  const alleStappenIngevuld = stappen.every(s => s.approach !== null)
  const totaalIngevuld = totaalLeren !== null && totaalKwaliteit !== null && totaalSnelheid !== null

  // ============ FASE 1: TWEE-KOLOM LAYOUT ============
  if (phase === 'kiezen') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <ProgressStepper activeLetter="kiezen" activeSubStep="k2" />
        <main className="flex-1 py-6">
          <div className="container mx-auto px-4 max-w-5xl">
            <Link
              href="/leerpad/kiezen/k1"
              className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Drie manieren
            </Link>

            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: kiesKleuren.kiezen }}
              >
                K2
              </div>
              <h1 className="text-xl font-bold text-gray-900">Taak-Ontleder</h1>
            </div>

            {/* Twee-kolom layout */}
            <div className="flex flex-col md:flex-row gap-5">
              {/* Linkerkolom — Opdrachtskeuze */}
              <div className="w-full md:w-[40%] flex-shrink-0">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Kies een opdracht</h2>
                <div className="space-y-2">
                  {opdrachten.map(opdracht => {
                    const isSelected = gekozenOpdracht?.id === opdracht.id
                    return (
                      <button
                        key={opdracht.id}
                        onClick={() => handleKiesOpdracht(opdracht)}
                        className={`w-full rounded-xl border-2 transition-all p-3 flex items-center gap-3 text-left ${
                          isSelected
                            ? 'border-purple-400 bg-purple-50 shadow-sm'
                            : 'border-transparent bg-white shadow-sm hover:shadow-md hover:border-gray-200'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                          {opdracht.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm">{opdracht.titel}</h3>
                          <p className="text-xs text-gray-500 truncate">{opdracht.beschrijving}</p>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Rechterkolom — Stappen invullen */}
              <div ref={rightColumnRef} className="w-full md:w-[60%] relative">
                {!gekozenOpdracht ? (
                  // Disabled state
                  <div className="opacity-40 pointer-events-none select-none">
                    <div className="bg-gray-100 rounded-xl p-5 mb-3">
                      <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
                      <div className="h-4 w-64 bg-gray-200 rounded" />
                    </div>
                    <div className="space-y-2">
                      {[1, 2].map(i => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-gray-200 flex-shrink-0" />
                          <div className="flex-1 h-10 bg-gray-100 border border-gray-200 rounded-lg" />
                        </div>
                      ))}
                      {[3, 4, 5].map(i => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-gray-100 flex-shrink-0" />
                          <div className="flex-1 h-10 bg-gray-50 border border-dashed border-gray-200 rounded-lg" />
                        </div>
                      ))}
                    </div>
                    <p className="text-center text-gray-400 mt-6 text-sm">Kies eerst een opdracht</p>
                  </div>
                ) : (
                  // Active state
                  <div className="animate-in fade-in duration-300">
                    {/* Opdrachtkaart */}
                    <div className="bg-purple-50 rounded-xl p-5 mb-3">
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{gekozenOpdracht.titel}</h2>
                      <p className="text-gray-600 text-sm">{teksten.opdelenInstructie}</p>
                    </div>

                    {/* Invulvelden */}
                    <div className="space-y-2 mb-3">
                      {stapVelden.map((waarde, index) => {
                        const isBasis = index < 2
                        return (
                          <div key={index} className="flex items-center gap-2">
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                isBasis
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-purple-200 text-purple-600'
                              }`}
                            >
                              {index + 1}
                            </span>
                            <input
                              ref={el => { inputRefs.current[index] = el }}
                              type="text"
                              value={waarde}
                              onChange={(e) => handleStapVeldChange(index, e.target.value)}
                              onKeyDown={(e) => handleStapKeyDown(index, e)}
                              placeholder={`Stap ${index + 1}...`}
                              className={`flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                                isBasis
                                  ? 'border border-gray-300 bg-white'
                                  : 'border border-dashed border-gray-200 bg-white'
                              }`}
                            />
                          </div>
                        )
                      })}
                    </div>

                    {/* Nog een stap */}
                    {stapVelden.length < MAX_VELDEN && (
                      <button
                        onClick={handleVoegVeldToe}
                        className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 mb-4"
                      >
                        <Plus className="h-4 w-4" />
                        Nog een stap
                      </button>
                    )}

                    {/* Hulp nodig */}
                    <button
                      onClick={() => {
                        const ingevuld = stapVelden.filter(v => v.trim())
                        const stappenInfo = ingevuld.length > 0
                          ? `\n\nJe hebt al deze stappen:\n${ingevuld.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nWil je meer stappen toevoegen of heb je andere vragen?`
                          : ''
                        setChatMessages([{
                          role: 'assistant',
                          content: `Je werkt aan "${gekozenOpdracht?.titel}".${stappenInfo || ' Welke stappen denk je dat je moet zetten? Typ je ideeën, of vraag mij om suggesties!'}`
                        }])
                        setChatOpen(true)
                      }}
                      className="w-full bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3 transition-colors mb-4"
                    >
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-primary">Hulp nodig? Vraag de AI om suggesties</span>
                    </button>

                    {/* Verder knop */}
                    <div>
                      <Button
                        onClick={handleVerder}
                        disabled={gevuldeVelden < 2}
                        size="lg"
                        className="w-full"
                      >
                        Verder
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      {gevuldeVelden < 2 && (
                        <p className="text-sm text-gray-400 text-center mt-2">
                          Vul minstens 2 stappen in
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />

        {/* Bevestigingsdialoog opdracht wisselen */}
        {pendingOpdracht && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Andere opdracht kiezen?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Je hebt al stappen ingevuld. Als je een andere opdracht kiest, worden deze gewist.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancelWissel} className="flex-1">
                  Annuleren
                </Button>
                <Button onClick={handleConfirmWissel} className="flex-1">
                  Doorgaan
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Panel */}
        {chatOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
            <div className="bg-white w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl h-[75vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-gray-900">AI Hulp</h3>
                <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                      msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && chatStreamingContent && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl px-4 py-2 text-sm bg-gray-100 text-gray-700 whitespace-pre-wrap">
                      {chatStreamingContent}
                    </div>
                  </div>
                )}
                {chatLoading && !chatStreamingContent && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    placeholder="Vraag om suggesties..."
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    disabled={chatLoading}
                  />
                  <Button onClick={handleSendChat} size="sm" disabled={chatLoading || !chatInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Tip: Vraag &quot;Geef me suggesties voor stappen&quot;
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ============ FASE 2: AANPAK KIEZEN (geïntegreerd in twee-kolom layout) ============
  if (phase === 'aanpak') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <ProgressStepper activeLetter="kiezen" activeSubStep="k2" />
        <main className="flex-1 py-6">
          <div className="container mx-auto px-4 max-w-5xl">
            <Link
              href="/leerpad/kiezen/k1"
              className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Drie manieren
            </Link>

            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: kiesKleuren.kiezen }}
              >
                K2
              </div>
              <h1 className="text-xl font-bold text-gray-900">Taak-Ontleder</h1>
            </div>

            {/* Twee-kolom layout */}
            <div className="flex flex-col md:flex-row gap-5">
              {/* Linkerkolom — Locked opdrachten */}
              <div className="w-full md:w-[40%] flex-shrink-0">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Kies een opdracht</h2>
                <div className="space-y-2 opacity-60 pointer-events-none">
                  {opdrachten.map(opdracht => {
                    const isSelected = gekozenOpdracht?.id === opdracht.id
                    return (
                      <div
                        key={opdracht.id}
                        className={`w-full rounded-xl border-2 p-3 flex items-center gap-3 ${
                          isSelected
                            ? 'border-purple-400 bg-purple-50'
                            : 'border-transparent bg-white shadow-sm'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                          {opdracht.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm">{opdracht.titel}</h3>
                          <p className="text-xs text-gray-500 truncate">{opdracht.beschrijving}</p>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Rechterkolom — Stappen met dropdown */}
              <div className="w-full md:w-[60%]">
                <div className="animate-in fade-in duration-300">
                  {/* Opdrachtkaart met aangepaste instructie */}
                  <div className="bg-purple-50 rounded-xl p-5 mb-3">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{gekozenOpdracht?.titel}</h2>
                    <p className="text-gray-600 text-sm">{teksten.aanpakInstructie}</p>
                  </div>

                  {/* Stap-rijen met dropdown */}
                  <div className="space-y-2 mb-4">
                    {stappen.map((stap, index) => (
                      <div key={stap.id} className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="flex-1 text-sm text-gray-900">{stap.titel}</span>
                        <ApproachDropdown
                          value={stap.approach}
                          onChange={(val) => handleSelectApproach(stap.id, val)}
                          isOpen={openDropdown === stap.id}
                          onToggle={() => setOpenDropdown(openDropdown === stap.id ? null : stap.id)}
                          onClose={() => setOpenDropdown(null)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Navigatie onderaan */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleBackToKiezen}
                      className="inline-flex items-center text-sm text-gray-600 hover:text-primary"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Stappen aanpassen
                    </button>
                    <div className="text-right">
                      <Button
                        onClick={() => setPhase('resultaat')}
                        disabled={!alleStappenIngevuld}
                        size="lg"
                      >
                        Verder
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      {!alleStappenIngevuld && (
                        <p className="text-xs text-gray-400 mt-1">
                          Kies voor elke stap een aanpak
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ============ FASE 3: REFLECTIE ============
  if (phase === 'resultaat') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <ProgressStepper activeLetter="kiezen" activeSubStep="k2" />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: kiesKleuren.kiezen }}
                >
                  K2
                </div>
                <h1 className="text-xl font-bold text-gray-900">Stap 3: Inschatten</h1>
              </div>
              <p className="text-gray-600">
                <span className="font-medium">{gekozenOpdracht?.titel}</span>
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-700">
                Denk na over je gekozen aanpak. Wat betekent dit voor hoeveel je leert, de kwaliteit van het resultaat en hoe snel je klaar bent?
              </p>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-5 mb-6">
              {samenvattingLoading ? (
                <div className="flex items-center gap-3 text-gray-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">Even kijken naar je strategie...</span>
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed">{strategieSamenvatting}</p>
              )}
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
              <h3 className="font-medium text-gray-900 mb-4">Wat denk jij?</h3>

              <div className="mb-6">
                <p className="text-sm text-gray-700 mb-3">
                  Wat doet deze aanpak met je <strong>leren</strong>, vergeleken met alles zelf doen?
                </p>
                <div className="flex gap-2">
                  {[{ val: -1, label: 'Minder' }, { val: 0, label: 'Evenveel' }, { val: 1, label: 'Meer' }].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setTotaalLeren(opt.val)}
                      className={`flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all border ${
                        totaalLeren === opt.val ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-700 mb-3">
                  Wat doet deze aanpak met de <strong>kwaliteit</strong> van het eindresultaat?
                </p>
                <div className="flex gap-2">
                  {[{ val: -1, label: 'Lager' }, { val: 0, label: 'Hetzelfde' }, { val: 1, label: 'Hoger' }].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setTotaalKwaliteit(opt.val)}
                      className={`flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all border ${
                        totaalKwaliteit === opt.val ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-700 mb-3">
                  Wat doet deze aanpak met de <strong>snelheid</strong> waarmee je klaar bent?
                </p>
                <div className="flex gap-2">
                  {[{ val: -1, label: 'Langzamer' }, { val: 0, label: 'Hetzelfde' }, { val: 1, label: 'Sneller' }].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setTotaalSnelheid(opt.val)}
                      className={`flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all border ${
                        totaalSnelheid === opt.val ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleFinish}
              disabled={!totaalIngevuld}
              size="lg"
              className="w-full"
            >
              {totaalIngevuld ? (
                <>
                  Klaar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                'Beantwoord alle vragen'
              )}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ============ FASE 4: EXPERIMENTEREN ============
  if (phase === 'experimenteren') {
    const getStapLabel = (stap: Stap) => {
      if (!stap.approach || stap.approach.type === 'zelf') {
        if (stap.approach?.type === 'zelf') {
          return { emoji: '👤', titel: 'Zelf', kleur: 'border-gray-200 bg-gray-50' }
        }
        return { emoji: '❓', titel: 'Onbekend', kleur: 'border-gray-200 bg-gray-50' }
      }
      const roles = stap.approach.roles
      if (roles.length === 1) {
        const r = roles[0]
        const kleur = r.category === 'aihelpt' ? 'border-primary/30 bg-primary/5' : 'border-purple-200 bg-purple-50'
        return { emoji: r.emoji, titel: r.name, kleur }
      }
      // Multi-role
      const emojis = roles.map(r => r.emoji).join(' ')
      const names = roles.map(r => r.name).join(', ')
      return { emoji: emojis, titel: names, kleur: 'border-primary/30 bg-primary/5' }
    }

    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <ProgressStepper activeLetter="kiezen" activeSubStep="k2" />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: kiesKleuren.kiezen }}
                >
                  K2
                </div>
                <h1 className="text-xl font-bold text-gray-900">Jouw strategie</h1>
              </div>
              <p className="text-sm text-gray-600">
                Bekijk je plan. Tevreden? Of wil je nog iets aanpassen?
              </p>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              <div className="bg-white rounded-lg border shadow-sm px-3 py-2 flex items-center gap-2">
                <span>📚</span>
                <span className="text-sm text-gray-500">Leren:</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {totaalLeren === -1 ? 'Minder' : totaalLeren === 0 ? 'Evenveel' : 'Meer'}
                </span>
              </div>
              <div className="bg-white rounded-lg border shadow-sm px-3 py-2 flex items-center gap-2">
                <span>⭐</span>
                <span className="text-sm text-gray-500">Kwaliteit:</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {totaalKwaliteit === -1 ? 'Lager' : totaalKwaliteit === 0 ? 'Hetzelfde' : 'Hoger'}
                </span>
              </div>
              <div className="bg-white rounded-lg border shadow-sm px-3 py-2 flex items-center gap-2">
                <span>⚡</span>
                <span className="text-sm text-gray-500">Snelheid:</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {totaalSnelheid === -1 ? 'Langzamer' : totaalSnelheid === 0 ? 'Hetzelfde' : 'Sneller'}
                </span>
              </div>
            </div>

            <h2 className="text-sm font-medium text-gray-500 mb-3">{gekozenOpdracht?.titel}</h2>

            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                {stappen.map((stap) => {
                  const label = getStapLabel(stap)
                  return (
                    <div
                      key={stap.id}
                      className={`rounded-lg border-2 ${label.kleur} px-3 py-2 transition-all ${isAanpassen ? 'cursor-pointer hover:shadow-md' : ''}`}
                      onClick={isAanpassen ? () => setOpenDropdown(openDropdown === stap.id ? null : stap.id) : undefined}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{label.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">{stap.titel}</div>
                          <div className="text-xs font-semibold text-gray-500">{label.titel.toUpperCase()}</div>
                        </div>
                        {isAanpassen && <ChevronDown className="h-4 w-4 text-gray-400" />}
                      </div>
                      {isAanpassen && (
                        <div className="mt-2 pt-2 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                          <ApproachDropdown
                            value={stap.approach}
                            onChange={(val) => handleSelectApproach(stap.id, val)}
                            isOpen={openDropdown === stap.id}
                            onToggle={() => setOpenDropdown(openDropdown === stap.id ? null : stap.id)}
                            onClose={() => setOpenDropdown(null)}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="flex-1">
                {!wilVerbeteren && !isAanpassen ? (
                  <div className="bg-white rounded-xl border shadow-sm p-4">
                    <h3 className="font-medium text-gray-900 mb-3 text-sm">Tevreden?</h3>
                    <div className="space-y-2">
                      <Button onClick={handleBackToDashboard} className="w-full" size="sm">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Ja, klaar
                      </Button>
                      <Button onClick={() => setWilVerbeteren(true)} variant="outline" className="w-full" size="sm">
                        Aanpassen
                      </Button>
                    </div>
                    <button onClick={handleStartOver} className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600">
                      Andere opdracht
                    </button>
                  </div>
                ) : wilVerbeteren && !isAanpassen ? (
                  <div className="bg-white rounded-xl border shadow-sm p-4">
                    <h3 className="font-medium text-gray-900 mb-3 text-sm">Wat verbeteren?</h3>
                    <div className="space-y-2 mb-3">
                      {[
                        { id: 'leren' as const, emoji: '📚', label: 'Meer leren' },
                        { id: 'kwaliteit' as const, emoji: '⭐', label: 'Betere kwaliteit' },
                        { id: 'snelheid' as const, emoji: '⚡', label: 'Sneller klaar' },
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setVerbeterOptie(opt.id)}
                          className={`w-full p-2 rounded-lg border text-left flex items-center gap-2 transition-all text-sm ${
                            verbeterOptie === opt.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span>{opt.emoji}</span>
                          <span className="font-medium text-gray-900">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Button onClick={() => setIsAanpassen(true)} disabled={!verbeterOptie} className="w-full" size="sm">
                        Aanpassen
                      </Button>
                      <button
                        onClick={() => { setWilVerbeteren(false); setVerbeterOptie(null); }}
                        className="w-full text-xs text-gray-500 hover:text-gray-700"
                      >
                        Terug
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border shadow-sm p-4">
                    <h3 className="font-medium text-gray-900 mb-3 text-sm">Kies nieuwe aanpak</h3>
                    <p className="text-xs text-gray-500 mb-3">Klik op een stap om de aanpak te wijzigen</p>
                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          setIsAanpassen(false)
                          setWilVerbeteren(false)
                          setVerbeterOptie(null)
                          setPhase('resultaat')
                        }}
                        className="w-full"
                        size="sm"
                      >
                        Bekijk resultaat
                      </Button>
                      <button
                        onClick={() => { setIsAanpassen(false); setWilVerbeteren(false); setVerbeterOptie(null); }}
                        className="w-full text-xs text-gray-500 hover:text-gray-700"
                      >
                        Annuleren
                      </button>
                    </div>
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

  return null
}
