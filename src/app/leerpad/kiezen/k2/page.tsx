'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, ChevronDown, Plus, X, MessageCircle, Send, Loader2, CheckCircle2 } from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'
import {
  getOpdrachtenVoorNiveau,
  OpdrachtOptie,
  aiHelptRollen,
  aiDoetRollen,
  Aanpak
} from '@/lib/kiezen-content'

interface Stap {
  id: string
  titel: string
  aanpak: Aanpak | null
  rol?: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

type Phase = 'kiezen' | 'onderdelen' | 'aanpak' | 'resultaat' | 'experimenteren'

const STORAGE_KEY = 'kies-k2-state'

interface K2State {
  phase: Phase
  gekozenOpdracht: OpdrachtOptie | null
  stappen: Stap[]
  totaalLeren: number | null // -1 = minder, 0 = gelijk, 1 = meer (t.o.v. alles zelf)
  totaalKwaliteit: number | null // -1 = lager, 0 = gelijk, 1 = hoger (t.o.v. alles zelf)
  totaalSnelheid: number | null // -1 = langzamer, 0 = gelijk, 1 = sneller (t.o.v. alles zelf)
}

export default function K2Page() {
  const router = useRouter()
  const { niveau, updateProgress } = useNiveau()
  const [phase, setPhase] = useState<Phase>('kiezen')
  const [gekozenOpdracht, setGekozenOpdracht] = useState<OpdrachtOptie | null>(null)
  const [stappen, setStappen] = useState<Stap[]>([])
  const [totaalLeren, setTotaalLeren] = useState<number | null>(null)
  const [totaalKwaliteit, setTotaalKwaliteit] = useState<number | null>(null)
  const [totaalSnelheid, setTotaalSnelheid] = useState<number | null>(null)
  const [nieuweStap, setNieuweStap] = useState('')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Chat state
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
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
        const state: K2State = JSON.parse(saved)
        if (state.phase) setPhase(state.phase)
        if (state.gekozenOpdracht) setGekozenOpdracht(state.gekozenOpdracht)
        if (state.stappen) setStappen(state.stappen)
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
      const state: K2State = { phase, gekozenOpdracht, stappen, totaalLeren, totaalKwaliteit, totaalSnelheid }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [phase, gekozenOpdracht, stappen, totaalLeren, totaalKwaliteit, totaalSnelheid, isLoaded])

  useEffect(() => {
    // MBO/HBO hebben geen leerjaar, VO niveaus wel
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
    }
  }, [niveau, router])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // Genereer samenvatting wanneer we naar resultaat fase gaan
  useEffect(() => {
    if (phase === 'resultaat' && !strategieSamenvatting && !samenvattingLoading && stappen.length > 0) {
      generateStrategieSamenvatting()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const generateStrategieSamenvatting = async () => {
    setSamenvattingLoading(true)

    // Bouw de stappen beschrijving
    const stappenBeschrijving = stappen.map(stap => {
      let aanpakTekst = ''
      if (stap.aanpak === 'zelf') {
        aanpakTekst = 'zelf doen'
      } else if (stap.aanpak === 'aihelpt') {
        const rol = getRolInfo('aihelpt', stap.rol)
        aanpakTekst = `samen met AI (${rol?.titel || 'samen'})`
      } else if (stap.aanpak === 'aidoet') {
        const rol = getRolInfo('aidoet', stap.rol)
        aanpakTekst = `AI laten doen (${rol?.titel || 'AI doet'})`
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
            moduleContext: `Je bent een coach die een leerling helpt reflecteren op hun AI-strategie.

Opdracht: ${gekozenOpdracht?.titel}

Gekozen aanpak per stap:
${stappenBeschrijving}

Schrijf in 2-3 korte, directe zinnen wat deze strategie inhoudt.
Gebruik "je" en spreek de leerling aan.
Wees neutraal - geen oordeel over goed of fout.
Focus op WAT de leerling gaat doen, niet of het slim is.
Houd het heel kort en concreet.`,
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

  // Don't render until localStorage is loaded
  if (!isLoaded) {
    return null
  }

  const opdrachten = getOpdrachtenVoorNiveau(niveau.schoolType, niveau.leerjaar)

  // Handlers
  const handleKiesOpdracht = (opdracht: OpdrachtOptie) => {
    setGekozenOpdracht(opdracht)
    setPhase('onderdelen')
    // Reset chat met intro bericht
    setChatMessages([{
      role: 'assistant',
      content: `Je hebt gekozen voor "${opdracht.titel}". Welke stappen denk je dat je moet zetten om dit te maken? Typ je ideeën, of vraag mij om suggesties!`
    }])
  }

  const handleVoegStapToe = () => {
    if (nieuweStap.trim()) {
      setStappen(prev => [...prev, {
        id: `stap-${Date.now()}`,
        titel: nieuweStap.trim(),
        aanpak: null
      }])
      setNieuweStap('')
    }
  }

  const handleVerwijderStap = (id: string) => {
    setStappen(prev => prev.filter(s => s.id !== id))
  }

  // Haal alle AI-helpt rollen op die al gekozen zijn voor stappen met dezelfde titel
  const getGekozenAiHelptRollen = (stapTitel: string): string[] => {
    return stappen
      .filter(s => s.titel === stapTitel && s.aanpak === 'aihelpt' && s.rol)
      .map(s => s.rol!)
  }

  // Voeg extra AI-helpt rol toe voor dezelfde stap (dupliceert de stap)
  const handleVoegExtraRolToe = (stapId: string, rolId: string) => {
    const huidigeStap = stappen.find(s => s.id === stapId)
    if (!huidigeStap) return

    const nieuweStap: Stap = {
      id: `${stapId}-${Date.now()}`,
      titel: huidigeStap.titel,
      aanpak: 'aihelpt',
      rol: rolId
    }

    // Voeg toe direct na de huidige stap
    const index = stappen.findIndex(s => s.id === stapId)
    setStappen(prev => [
      ...prev.slice(0, index + 1),
      nieuweStap,
      ...prev.slice(index + 1)
    ])
    setOpenDropdown(null)
  }

  const handleSelectAanpak = (stapId: string, aanpak: Aanpak, rol?: string) => {
    setStappen(prev => prev.map(s =>
      s.id === stapId ? { ...s, aanpak, rol } : s
    ))
    setOpenDropdown(null)
  }

  const handleFinish = () => {
    updateProgress('kiezen', 'k2', true)
    setWilVerbeteren(false)
    setVerbeterOptie(null)
    setIsAanpassen(false)
    setPhase('experimenteren') // Ga naar experimenteer-modus
  }

  const handleBackToDashboard = () => {
    // Data blijft bewaard zodat S2 het kan gebruiken
    router.push('/dashboard')
  }

  const handleStartOver = () => {
    localStorage.removeItem(STORAGE_KEY)
    setPhase('kiezen')
    setGekozenOpdracht(null)
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

  // Chat handler
  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return

    const userMessage = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setChatLoading(true)

    // Bouw context met bestaande stappen
    const bestaandeStappen = stappen.length > 0
      ? `\n\nAl ingevoerde stappen:\n${stappen.map((s, i) => `${i + 1}. ${s.titel}`).join('\n')}`
      : ''

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: {
            niveau: niveau.schoolType,
            leerjaar: niveau.leerjaar,
            currentModule: 'kiezen',
            moduleContext: `Opdracht: ${gekozenOpdracht?.titel}.${bestaandeStappen}

De leerling bepaalt zelf welke stappen nodig zijn. Help met suggesties voor stappen die nog missen. Geef maximaal 3-4 concrete suggesties per keer zoals "Onderwerp kiezen", "Informatie verzamelen", "Structuur maken". Houd het kort en praktisch. Als er al stappen zijn, bouw daarop voort.`,
            aiMode: 'helpt',
            conversationHistory: chatMessages
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, er ging iets mis. Probeer het opnieuw.'
        }])
      }
    } catch {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, er ging iets mis. Probeer het opnieuw.'
      }])
    } finally {
      setChatLoading(false)
    }
  }

  // Helpers
  const alleStappenIngevuld = stappen.every(s => s.aanpak !== null)
  const totaalIngevuld = totaalLeren !== null && totaalKwaliteit !== null && totaalSnelheid !== null

  const getRolInfo = (aanpak: Aanpak, rolId?: string) => {
    if (aanpak === 'aihelpt' && rolId) {
      return aiHelptRollen.find(r => r.id === rolId)
    }
    if (aanpak === 'aidoet' && rolId) {
      return aiDoetRollen.find(r => r.id === rolId)
    }
    return null
  }

  // Bereken AI-balans percentage (0 = volledig zelf, 100 = volledig AI)
  const berekenAIBalans = () => {
    if (stappen.length === 0) return 0
    let totaal = 0
    stappen.forEach(stap => {
      if (stap.aanpak === 'zelf') totaal += 0
      else if (stap.aanpak === 'aihelpt') totaal += 50
      else if (stap.aanpak === 'aidoet') totaal += 100
    })
    return Math.round(totaal / stappen.length)
  }

  const aiBalans = berekenAIBalans()

  // Tel aanpakken per type
  const aanpakTelling = {
    zelf: stappen.filter(s => s.aanpak === 'zelf').length,
    aihelpt: stappen.filter(s => s.aanpak === 'aihelpt').length,
    aidoet: stappen.filter(s => s.aanpak === 'aidoet').length
  }

  
  // ============ FASE 1: OPDRACHT KIEZEN ============
  if (phase === 'kiezen') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <Link
              href="/leerpad/kiezen/k1"
              className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Drie manieren
            </Link>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: kiesKleuren.kiezen }}
                >
                  K2
                </div>
                <h1 className="text-xl font-bold text-gray-900">Taak-Ontleder</h1>
              </div>
              <p className="text-gray-600">
                Je gaat een opdracht opsplitsen in stappen en per stap bepalen: doe ik dit zelf, samen met AI, of laat ik AI het doen?
              </p>
            </div>

            {/* Uitleg */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Hoe werkt het?</strong> Kies eerst een opdracht. Daarna bedenk je welke stappen nodig zijn en kies je per stap je aanpak.
              </p>
            </div>

            <div className="space-y-3">
              {opdrachten.map(opdracht => (
                <button
                  key={opdracht.id}
                  onClick={() => handleKiesOpdracht(opdracht)}
                  className="w-full bg-white rounded-xl border shadow-sm hover:shadow-md transition-all p-4 flex items-center gap-4 text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                    {opdracht.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{opdracht.titel}</h3>
                    <p className="text-sm text-gray-500">{opdracht.beschrijving}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ============ FASE 2: ONDERDELEN BEPALEN ============
  if (phase === 'onderdelen') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <button
              onClick={() => setPhase('kiezen')}
              className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Andere opdracht
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: kiesKleuren.kiezen }}
                >
                  K2
                </div>
                <h1 className="text-xl font-bold text-gray-900">Stap 1: Opdeling</h1>
              </div>
              <p className="text-gray-600">
                <span className="font-medium">{gekozenOpdracht?.titel}</span>
              </p>
            </div>

            {/* Uitleg */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-700">
                Bedenk zelf welke stappen je moet zetten om deze opdracht te maken. Wat doe je eerst? Wat daarna? Voeg minimaal 2 stappen toe.
              </p>
            </div>

            {/* Stappen invoer */}
            <div className="bg-white rounded-xl border shadow-sm p-4 mb-4">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={nieuweStap}
                  onChange={(e) => setNieuweStap(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVoegStapToe()}
                  placeholder="Typ een stap..."
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <Button onClick={handleVoegStapToe} size="sm" disabled={!nieuweStap.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {stappen.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  Nog geen stappen toegevoegd
                </p>
              ) : (
                <div className="space-y-2">
                  {stappen.map((stap, index) => (
                    <div
                      key={stap.id}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm text-gray-700">{stap.titel}</span>
                      <button
                        onClick={() => handleVerwijderStap(stap.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hulp knop */}
            <button
              onClick={() => {
                // Update chat met huidige stappen
                const stappenInfo = stappen.length > 0
                  ? `\n\nJe hebt al deze stappen:\n${stappen.map((s, i) => `${i + 1}. ${s.titel}`).join('\n')}\n\nWil je meer stappen toevoegen of heb je andere vragen?`
                  : ''
                setChatMessages([{
                  role: 'assistant',
                  content: `Je werkt aan "${gekozenOpdracht?.titel}".${stappenInfo || ' Welke stappen denk je dat je moet zetten? Typ je ideeën, of vraag mij om suggesties!'}`
                }])
                setChatOpen(true)
              }}
              className="w-full bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3 transition-colors mb-6"
            >
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Hulp nodig? Vraag de AI om suggesties</span>
            </button>

            <Button
              onClick={() => setPhase('aanpak')}
              disabled={stappen.length < 2}
              size="lg"
              className="w-full"
            >
              {stappen.length < 2 ? (
                'Voeg minimaal 2 stappen toe'
              ) : (
                <>
                  Volgende: Aanpak kiezen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </main>
        <Footer />

        {/* Chat Panel */}
        {chatOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
            <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-gray-900">AI Hulp</h3>
                <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                        msg.role === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
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

  // ============ FASE 3: AANPAK KIEZEN ============
  if (phase === 'aanpak') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <button
              onClick={() => setPhase('onderdelen')}
              className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Stappen aanpassen
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: kiesKleuren.kiezen }}
                >
                  K2
                </div>
                <h1 className="text-xl font-bold text-gray-900">Stap 2: Aanpak kiezen</h1>
              </div>
              <p className="text-gray-600">
                <span className="font-medium">{gekozenOpdracht?.titel}</span>
              </p>
            </div>

            {/* Uitleg */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                Kies per stap hoe je die gaat aanpakken:
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white rounded-lg p-2 text-center">
                  <span className="text-lg">👤</span>
                  <div className="font-medium text-gray-900">Zelf</div>
                  <div className="text-gray-500">Zonder AI</div>
                </div>
                <div className="bg-white rounded-lg p-2 text-center">
                  <span className="text-lg">🤝</span>
                  <div className="font-medium text-gray-900">Samen</div>
                  <div className="text-gray-500">AI helpt mij</div>
                </div>
                <div className="bg-white rounded-lg p-2 text-center">
                  <span className="text-lg">🤖</span>
                  <div className="font-medium text-gray-900">AI doet</div>
                  <div className="text-gray-500">AI maakt, ik check</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {stappen.map((stap, index) => (
                <div key={stap.id} className="bg-white rounded-xl border shadow-sm p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-xs font-medium text-gray-600">
                      {index + 1}
                    </div>
                    <h3 className="font-medium text-gray-900">{stap.titel}</h3>
                  </div>

                  <div className="flex gap-2 flex-wrap ml-9">
                    <button
                      onClick={() => handleSelectAanpak(stap.id, 'zelf')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        stap.aanpak === 'zelf'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      👤 Zelf
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === `${stap.id}-aihelpt` ? null : `${stap.id}-aihelpt`)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                          stap.aanpak === 'aihelpt'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        🤝 {stap.aanpak === 'aihelpt' && stap.rol ? getRolInfo('aihelpt', stap.rol)?.titel : 'Samen'}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      {openDropdown === `${stap.id}-aihelpt` && (
                        <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg py-1 z-20 min-w-[160px]">
                          {aiHelptRollen.map(rol => (
                            <button
                              key={rol.id}
                              onClick={() => handleSelectAanpak(stap.id, 'aihelpt', rol.id)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <span>{rol.emoji}</span>
                              <span>{rol.titel}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === `${stap.id}-aidoet` ? null : `${stap.id}-aidoet`)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                          stap.aanpak === 'aidoet'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        🤖 {stap.aanpak === 'aidoet' && stap.rol ? getRolInfo('aidoet', stap.rol)?.titel : 'AI doet'}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      {openDropdown === `${stap.id}-aidoet` && (
                        <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg py-1 z-20 min-w-[160px]">
                          {aiDoetRollen.map(rol => (
                            <button
                              key={rol.id}
                              onClick={() => handleSelectAanpak(stap.id, 'aidoet', rol.id)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <span>{rol.emoji}</span>
                              <span>{rol.titel}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* + Nog een AI-helpt rol knop */}
                  {stap.aanpak === 'aihelpt' && stap.rol && (
                    (() => {
                      const gekozenRollen = getGekozenAiHelptRollen(stap.titel)
                      const beschikbareRollen = aiHelptRollen.filter(r => !gekozenRollen.includes(r.id))

                      if (beschikbareRollen.length === 0) return null

                      return (
                        <div className="ml-9 mt-2 relative">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === `${stap.id}-extra` ? null : `${stap.id}-extra`)}
                            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                          >
                            <Plus className="h-3 w-3" />
                            Nog een AI-helpt rol
                          </button>
                          {openDropdown === `${stap.id}-extra` && (
                            <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg py-1 z-20 min-w-[160px]">
                              {beschikbareRollen.map(rol => (
                                <button
                                  key={rol.id}
                                  onClick={() => handleVoegExtraRolToe(stap.id, rol.id)}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <span>{rol.emoji}</span>
                                  <span>{rol.titel}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })()
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={() => setPhase('resultaat')}
              disabled={!alleStappenIngevuld}
              size="lg"
              className="w-full"
            >
              {alleStappenIngevuld ? (
                <>
                  Volgende: Inschatten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                'Kies voor elke stap een aanpak'
              )}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ============ FASE 4: REFLECTIE ============
  if (phase === 'resultaat') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
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

            {/* Uitleg */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-700">
                Denk na over je gekozen aanpak. Wat betekent dit voor hoeveel je leert, de kwaliteit van het resultaat en hoe snel je klaar bent?
              </p>
            </div>

            {/* AI Samenvatting */}
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

            {/* Reflectievragen */}
            <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
              <h3 className="font-medium text-gray-900 mb-4">Wat denk jij?</h3>

              {/* Vraag 1: Leren */}
              <div className="mb-6">
                <p className="text-sm text-gray-700 mb-3">
                  Wat doet deze aanpak met je <strong>leren</strong>, vergeleken met alles zelf doen?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTotaalLeren(-1)}
                    className={`flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all border ${
                      totaalLeren === -1
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    Minder
                  </button>
                  <button
                    onClick={() => setTotaalLeren(0)}
                    className={`flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all border ${
                      totaalLeren === 0
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    Evenveel
                  </button>
                  <button
                    onClick={() => setTotaalLeren(1)}
                    className={`flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all border ${
                      totaalLeren === 1
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    Meer
                  </button>
                </div>
              </div>

              {/* Vraag 2: Kwaliteit */}
              <div className="mb-6">
                <p className="text-sm text-gray-700 mb-3">
                  Wat doet deze aanpak met de <strong>kwaliteit</strong> van het eindresultaat?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTotaalKwaliteit(-1)}
                    className={`flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all border ${
                      totaalKwaliteit === -1
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    Lager
                  </button>
                  <button
                    onClick={() => setTotaalKwaliteit(0)}
                    className={`flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all border ${
                      totaalKwaliteit === 0
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    Hetzelfde
                  </button>
                  <button
                    onClick={() => setTotaalKwaliteit(1)}
                    className={`flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all border ${
                      totaalKwaliteit === 1
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    Hoger
                  </button>
                </div>
              </div>

              {/* Vraag 3: Snelheid */}
              <div>
                <p className="text-sm text-gray-700 mb-3">
                  Wat doet deze aanpak met de <strong>snelheid</strong> waarmee je klaar bent?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTotaalSnelheid(-1)}
                    className={`flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all border ${
                      totaalSnelheid === -1
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    Langzamer
                  </button>
                  <button
                    onClick={() => setTotaalSnelheid(0)}
                    className={`flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all border ${
                      totaalSnelheid === 0
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    Hetzelfde
                  </button>
                  <button
                    onClick={() => setTotaalSnelheid(1)}
                    className={`flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all border ${
                      totaalSnelheid === 1
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    Sneller
                  </button>
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

  // ============ FASE 5: EXPERIMENTEREN ============
  if (phase === 'experimenteren') {
    const getStapLabel = (stap: Stap) => {
      if (stap.aanpak === 'zelf') {
        return { emoji: '👤', titel: 'Zelf', kleur: 'border-gray-200 bg-gray-50' }
      } else if (stap.aanpak === 'aihelpt') {
        const rol = getRolInfo('aihelpt', stap.rol)
        return { emoji: rol?.emoji || '🤝', titel: rol?.titel || 'AI helpt', kleur: 'border-primary/30 bg-primary/5' }
      } else if (stap.aanpak === 'aidoet') {
        const rol = getRolInfo('aidoet', stap.rol)
        return { emoji: rol?.emoji || '🤖', titel: rol?.titel || 'AI doet', kleur: 'border-purple-200 bg-purple-50' }
      }
      return { emoji: '❓', titel: 'Onbekend', kleur: 'border-gray-200 bg-gray-50' }
    }

    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header */}
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

            {/* 1. Resultaat - compact bovenaan */}
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

            {/* Opdracht titel */}
            <h2 className="text-sm font-medium text-gray-500 mb-3">{gekozenOpdracht?.titel}</h2>

            {/* 2. Twee-kolom layout: Stappen links, Acties rechts */}
            <div className="flex gap-4">
              {/* Linker kolom: Stappen */}
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
                      {openDropdown === stap.id && (
                        <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSelectAanpak(stap.id, 'zelf'); setOpenDropdown(null); }}
                            className="w-full px-2 py-1 text-left text-sm hover:bg-white/50 rounded flex items-center gap-2"
                          >
                            <span>👤</span> Zelf
                          </button>
                          <div className="text-xs text-gray-400 px-2 pt-1">AI helpt</div>
                          {aiHelptRollen.map(rol => (
                            <button
                              key={rol.id}
                              onClick={(e) => { e.stopPropagation(); handleSelectAanpak(stap.id, 'aihelpt', rol.id); setOpenDropdown(null); }}
                              className="w-full px-2 py-1 text-left text-sm hover:bg-white/50 rounded flex items-center gap-2"
                            >
                              <span>{rol.emoji}</span> {rol.titel}
                            </button>
                          ))}
                          <div className="text-xs text-gray-400 px-2 pt-1">AI doet</div>
                          {aiDoetRollen.map(rol => (
                            <button
                              key={rol.id}
                              onClick={(e) => { e.stopPropagation(); handleSelectAanpak(stap.id, 'aidoet', rol.id); setOpenDropdown(null); }}
                              className="w-full px-2 py-1 text-left text-sm hover:bg-white/50 rounded flex items-center gap-2"
                            >
                              <span>{rol.emoji}</span> {rol.titel}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Rechter kolom: Acties */}
              <div className="flex-1">
                {!wilVerbeteren && !isAanpassen ? (
                  // Kernvraag: tevreden?
                  <div className="bg-white rounded-xl border shadow-sm p-4">
                    <h3 className="font-medium text-gray-900 mb-3 text-sm">Tevreden?</h3>
                    <div className="space-y-2">
                      <Button
                        onClick={handleBackToDashboard}
                        className="w-full"
                        size="sm"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Ja, klaar
                      </Button>
                      <Button
                        onClick={() => setWilVerbeteren(true)}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        Aanpassen
                      </Button>
                    </div>
                    <button
                      onClick={handleStartOver}
                      className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600"
                    >
                      Andere opdracht
                    </button>
                  </div>
                ) : wilVerbeteren && !isAanpassen ? (
                  // Keuze: wat wil je verbeteren?
                  <div className="bg-white rounded-xl border shadow-sm p-4">
                    <h3 className="font-medium text-gray-900 mb-3 text-sm">Wat verbeteren?</h3>
                    <div className="space-y-2 mb-3">
                      <button
                        onClick={() => setVerbeterOptie('leren')}
                        className={`w-full p-2 rounded-lg border text-left flex items-center gap-2 transition-all text-sm ${
                          verbeterOptie === 'leren'
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span>📚</span>
                        <span className="font-medium text-gray-900">Meer leren</span>
                      </button>
                      <button
                        onClick={() => setVerbeterOptie('kwaliteit')}
                        className={`w-full p-2 rounded-lg border text-left flex items-center gap-2 transition-all text-sm ${
                          verbeterOptie === 'kwaliteit'
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span>⭐</span>
                        <span className="font-medium text-gray-900">Betere kwaliteit</span>
                      </button>
                      <button
                        onClick={() => setVerbeterOptie('snelheid')}
                        className={`w-full p-2 rounded-lg border text-left flex items-center gap-2 transition-all text-sm ${
                          verbeterOptie === 'snelheid'
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span>⚡</span>
                        <span className="font-medium text-gray-900">Sneller klaar</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      <Button
                        onClick={() => setIsAanpassen(true)}
                        disabled={!verbeterOptie}
                        className="w-full"
                        size="sm"
                      >
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
                  // Aanpas-modus
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
                        onClick={() => {
                          setIsAanpassen(false)
                          setWilVerbeteren(false)
                          setVerbeterOptie(null)
                        }}
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
