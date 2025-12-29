'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  ArrowLeft,
  Play,
  MessageSquare,
  Sparkles,
  Loader2,
  ChevronDown,
  HelpCircle,
  RotateCcw,
  Check,
  X
} from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'
import {
  alleRollen,
  getHintVoorRol,
  getRolById,
  promptOnderdelen,
  getOnderdeelLabel
} from '@/lib/instrueren-content'
import { formatMarkdown } from '@/lib/format-markdown'

interface PromptInput {
  rol: string
  context: string
  instructies: string
  voorbeeld: string
}

interface FeedbackItem {
  onderdeel: 'rol' | 'context' | 'instructies' | 'voorbeeld'
  status: 'goed' | 'verbeter' | 'ontbreekt'
  feedback: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

type Phase = 'kiesrol' | 'bouwprompt' | 'resultaat'

// Rollen die tekst nodig hebben om te werken
const TEKST_ROLLEN = ['feedbacker', 'verbeteraar', 'samenvatter', 'vertaler']

// Labels per rol voor het tekstveld
const TEKST_LABELS: Record<string, { titel: string; placeholder: string }> = {
  feedbacker: {
    titel: 'Tekst voor feedback',
    placeholder: 'Plak hier de tekst waarop je feedback wilt...'
  },
  verbeteraar: {
    titel: 'Tekst om te verbeteren',
    placeholder: 'Plak hier de tekst die verbeterd moet worden...'
  },
  samenvatter: {
    titel: 'Tekst om samen te vatten',
    placeholder: 'Plak hier de tekst die samengevat moet worden...'
  },
  vertaler: {
    titel: 'Tekst om te vertalen',
    placeholder: 'Plak hier de tekst die vertaald moet worden...'
  }
}

export default function I2Page() {
  const router = useRouter()
  const { niveau, updateProgress } = useNiveau()

  // Phase & rol state
  const [phase, setPhase] = useState<Phase>('kiesrol')
  const [gekozenRolId, setGekozenRolId] = useState<string | null>(null)

  // Prompt input state
  const [promptInput, setPromptInput] = useState<PromptInput>({
    rol: '',
    context: '',
    instructies: '',
    voorbeeld: ''
  })

  // UI state
  const [showHint, setShowHint] = useState<string | null>(null)
  const [activeField, setActiveField] = useState<string | null>(null)

  // Tekst modal state (voor rollen die tekst nodig hebben)
  const [showTekstModal, setShowTekstModal] = useState(false)
  const [bijlageTekst, setBijlageTekst] = useState('')

  // Feedback state
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[] | null>(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)

  // Uitvoer state
  const [uitvoerResultaat, setUitvoerResultaat] = useState<string | null>(null)
  const [uitvoerLoading, setUitvoerLoading] = useState(false)

  // Herschrijf state
  const [herschrevenPrompt, setHerschrevenPrompt] = useState<PromptInput | null>(null)
  const [herschrijfLoading, setHerschrijfLoading] = useState(false)

  const resultaatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // MBO/HBO hebben geen leerjaar, VO niveaus wel
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
    }
  }, [niveau, router])

  // MBO/HBO hebben geen leerjaar, VO niveaus wel
  const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
  if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
    return null
  }

  const gekozenRol = gekozenRolId ? getRolById(gekozenRolId) : null
  const rolHint = gekozenRolId ? getHintVoorRol(gekozenRolId) : null

  // Build volledige prompt string
  const buildPromptString = (input: PromptInput = promptInput) => {
    let prompt = ''
    if (input.rol.trim()) prompt += input.rol.trim()
    if (input.context.trim()) prompt += '\n\n' + input.context.trim()
    if (input.instructies.trim()) prompt += '\n\n' + input.instructies.trim()
    if (input.voorbeeld.trim()) prompt += '\n\n' + input.voorbeeld.trim()
    return prompt.trim()
  }

  // Check of verplichte velden zijn ingevuld
  const isPromptValid = promptInput.rol.trim() && promptInput.context.trim() && promptInput.instructies.trim()

  // Check of gekozen rol tekst nodig heeft
  const heeftTekstNodig = gekozenRolId ? TEKST_ROLLEN.includes(gekozenRolId) : false
  const tekstLabels = gekozenRolId ? TEKST_LABELS[gekozenRolId] : null

  // Handlers
  const handleKiesRol = (rolId: string) => {
    setGekozenRolId(rolId)
    setPhase('bouwprompt')
    // Reset states
    setPromptInput({ rol: '', context: '', instructies: '', voorbeeld: '' })
    setFeedbackItems(null)
    setUitvoerResultaat(null)
    setHerschrevenPrompt(null)
    setBijlageTekst('')
    setShowTekstModal(false)
  }

  const handleInputChange = (field: keyof PromptInput, value: string) => {
    setPromptInput(prev => ({ ...prev, [field]: value }))
    // Reset feedback en resultaat als input verandert
    setFeedbackItems(null)
    setUitvoerResultaat(null)
    setHerschrevenPrompt(null)
  }

  // Feedback ophalen
  const handleGetFeedback = async () => {
    if (!isPromptValid) return

    setFeedbackLoading(true)
    setFeedbackItems(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Analyseer deze prompt en geef feedback per onderdeel. De leerling oefent met het bouwen van prompts.

GEKOZEN ROL: ${gekozenRol?.titel || 'onbekend'}
${heeftTekstNodig ? 'LET OP: Bij deze rol wordt de te bewerken tekst APART toegevoegd bij het uitvoeren. De leerling hoeft dus GEEN tekst in de context te zetten.' : ''}

PROMPT VAN DE LEERLING:
---
Rol: "${promptInput.rol}"

Context: "${promptInput.context}"

Instructies: "${promptInput.instructies}"

Voorbeeld (optioneel): "${promptInput.voorbeeld || '(niet ingevuld)'}"
---

Geef je feedback in EXACT dit JSON format (en niets anders):
{
  "feedback": [
    {"onderdeel": "rol", "status": "goed|verbeter|ontbreekt", "feedback": "korte feedback"},
    {"onderdeel": "context", "status": "goed|verbeter|ontbreekt", "feedback": "korte feedback"},
    {"onderdeel": "instructies", "status": "goed|verbeter|ontbreekt", "feedback": "korte feedback"},
    {"onderdeel": "voorbeeld", "status": "goed|verbeter|ontbreekt", "feedback": "korte feedback"}
  ]
}

Regels voor feedback:
- Wees kort en concreet (max 20 woorden per onderdeel)
- Bij "goed": benoem wat goed is
- Bij "verbeter": zeg wat er beter kan, geef een concreet voorbeeld
- Bij "ontbreekt": geef aan wat er mist
- Voorbeeld is optioneel, dus alleen "ontbreekt" als het echt zou helpen
- Geef GEEN feedback in markdown format, gebruik GEEN ** of andere opmaak`,
          context: {
            niveau: niveau.schoolType,
            leerjaar: niveau.leerjaar,
            currentModule: 'instrueren',
            moduleContext: `Rol: ${gekozenRol?.titel}`,
            aiMode: 'doet'
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        try {
          // Probeer JSON te parsen uit het antwoord
          const jsonMatch = data.reply.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            setFeedbackItems(parsed.feedback)
          }
        } catch (e) {
          console.error('Could not parse feedback:', e)
        }
      }
    } catch (error) {
      console.error('Feedback error:', error)
    } finally {
      setFeedbackLoading(false)
    }
  }

  // Prompt uitvoeren - check eerst of tekst nodig is
  const handleUitvoeren = async () => {
    if (!isPromptValid) return

    // Als deze rol tekst nodig heeft en we hebben nog geen tekst, open modal
    if (heeftTekstNodig && !bijlageTekst.trim()) {
      setShowTekstModal(true)
      return
    }

    // Voer de prompt daadwerkelijk uit
    await executePrompt()
  }

  // Daadwerkelijke uitvoering van de prompt
  const executePrompt = async (tekst?: string) => {
    setUitvoerLoading(true)
    setUitvoerResultaat(null)
    setShowTekstModal(false)

    try {
      let volledigePrompt = buildPromptString()

      // Voeg de bijlage tekst toe als die er is
      const tekstToUse = tekst || bijlageTekst
      if (tekstToUse.trim()) {
        volledigePrompt += '\n\n---\nTEKST:\n' + tekstToUse.trim()
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: volledigePrompt,
          context: {
            niveau: niveau.schoolType,
            leerjaar: niveau.leerjaar,
            currentModule: 'instrueren',
            moduleContext: `De leerling test een zelfgeschreven prompt. Voer de instructies uit zoals gevraagd.`,
            aiMode: 'doet'
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        setUitvoerResultaat(data.reply)
        setPhase('resultaat')
        // Scroll naar resultaat
        setTimeout(() => {
          resultaatRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    } catch (error) {
      console.error('Uitvoer error:', error)
      setUitvoerResultaat('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setUitvoerLoading(false)
    }
  }

  // Handler voor tekst modal submit
  const handleTekstSubmit = () => {
    if (bijlageTekst.trim()) {
      executePrompt(bijlageTekst)
    }
  }

  // Prompt laten herschrijven
  const handleHerschrijf = async () => {
    if (!feedbackItems) return

    setHerschrijfLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Herschrijf deze prompt op basis van de feedback. Behoud de intentie van de leerling maar maak het beter.

ORIGINELE PROMPT:
Rol: "${promptInput.rol}"
Context: "${promptInput.context}"
Instructies: "${promptInput.instructies}"
Voorbeeld: "${promptInput.voorbeeld || '(niet ingevuld)'}"

FEEDBACK:
${feedbackItems.map(f => `- ${f.onderdeel}: ${f.feedback}`).join('\n')}

Geef de verbeterde prompt in EXACT dit JSON format:
{
  "rol": "verbeterde rol tekst",
  "context": "verbeterde context tekst",
  "instructies": "verbeterde instructies tekst",
  "voorbeeld": "verbeterd voorbeeld tekst of leeg als niet nodig"
}

Belangrijk:
- Houd de stijl passend bij een ${niveau.schoolType?.toUpperCase()} ${niveau.leerjaar} leerling
- Maak de verbeteringen duidelijk maar overdrijf niet
- Als voorbeeld niet nodig is, laat het leeg`,
          context: {
            niveau: niveau.schoolType,
            leerjaar: niveau.leerjaar,
            currentModule: 'instrueren',
            aiMode: 'doet'
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        try {
          const jsonMatch = data.reply.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            setHerschrevenPrompt(parsed)
          }
        } catch (e) {
          console.error('Could not parse herschreven prompt:', e)
        }
      }
    } catch (error) {
      console.error('Herschrijf error:', error)
    } finally {
      setHerschrijfLoading(false)
    }
  }

  // Herschreven prompt overnemen
  const handleNeemOver = () => {
    if (herschrevenPrompt) {
      setPromptInput(herschrevenPrompt)
      setHerschrevenPrompt(null)
      setFeedbackItems(null)
    }
  }

  // Opnieuw beginnen met andere rol
  const handleAndereRol = () => {
    setPhase('kiesrol')
    setGekozenRolId(null)
    setPromptInput({ rol: '', context: '', instructies: '', voorbeeld: '' })
    setFeedbackItems(null)
    setUitvoerResultaat(null)
    setHerschrevenPrompt(null)
    setBijlageTekst('')
    setShowTekstModal(false)
  }

  // Afronden
  const handleComplete = () => {
    updateProgress('instrueren', 'i2', true)
    router.push('/leerpad/evalueren/e1')
  }

  // ============ FASE 1: KIES ROL ============
  if (phase === 'kiesrol') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <Link
              href="/leerpad/instrueren/i1"
              className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Theorie
            </Link>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: kiesKleuren.instrueren }}
                >
                  I2
                </div>
                <h1 className="text-xl font-bold text-gray-900">Oefenen met prompts</h1>
              </div>
              <p className="text-gray-600">
                Kies een rol waarvoor je een prompt wilt bouwen
              </p>
            </div>

            {/* AI Helpt rollen */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <span className="text-lg">🤝</span> AI helpt mij
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {alleRollen.slice(0, 4).map((rol) => (
                  <button
                    key={rol.id}
                    onClick={() => handleKiesRol(rol.id)}
                    className="bg-white rounded-xl border shadow-sm hover:shadow-md hover:border-primary/30 transition-all p-4 text-left"
                  >
                    <span className="text-2xl block mb-2">{rol.emoji}</span>
                    <h4 className="font-semibold text-gray-900">{rol.titel}</h4>
                    <p className="text-xs text-gray-500 mt-1">{rol.beschrijving}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Doet rollen */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <span className="text-lg">🤖</span> AI doet het
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {alleRollen.slice(4).map((rol) => (
                  <button
                    key={rol.id}
                    onClick={() => handleKiesRol(rol.id)}
                    className="bg-white rounded-xl border shadow-sm hover:shadow-md hover:border-primary/30 transition-all p-4 text-left"
                  >
                    <span className="text-2xl block mb-2">{rol.emoji}</span>
                    <h4 className="font-semibold text-gray-900">{rol.titel}</h4>
                    <p className="text-xs text-gray-500 mt-1">{rol.beschrijving}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  // ============ FASE 2 & 3: BOUW PROMPT & RESULTAAT ============
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <button
            onClick={handleAndereRol}
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Andere rol kiezen
          </button>

          {/* Header met gekozen rol */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: kiesKleuren.instrueren }}
              >
                I2
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Bouw je prompt</h1>
                <p className="text-sm text-gray-500">
                  {gekozenRol?.emoji} {gekozenRol?.titel}
                </p>
              </div>
            </div>
          </div>


          {/* Prompt input velden */}
          <div className="space-y-4 mb-6">
            {promptOnderdelen.map((onderdeel) => {
              const labels = getOnderdeelLabel(onderdeel, niveau.schoolType!)
              const isActive = activeField === onderdeel.id
              const fieldHint = rolHint ? rolHint[`${onderdeel.id}Hint` as keyof typeof rolHint] : null

              return (
                <div key={onderdeel.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center gap-2">
                        <span
                          className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: kiesKleuren.instrueren }}
                        >
                          {onderdeel.nummer}
                        </span>
                        <span className="font-medium text-gray-900">{onderdeel.titel}</span>
                        {!onderdeel.verplicht && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                            optioneel
                          </span>
                        )}
                      </label>
                      {fieldHint && (
                        <button
                          onClick={() => setShowHint(showHint === onderdeel.id ? null : onderdeel.id)}
                          className="text-gray-400 hover:text-primary transition-colors"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 mb-2">{labels.vraag}</p>

                    {showHint === onderdeel.id && fieldHint && (
                      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-2">
                        <p className="text-sm text-amber-800">
                          <strong>Hint:</strong> {fieldHint as string}
                        </p>
                      </div>
                    )}

                    <textarea
                      value={promptInput[onderdeel.id as keyof PromptInput]}
                      onChange={(e) => handleInputChange(onderdeel.id as keyof PromptInput, e.target.value)}
                      onFocus={() => setActiveField(onderdeel.id)}
                      onBlur={() => setActiveField(null)}
                      placeholder={labels.tip}
                      rows={onderdeel.id === 'voorbeeld' ? 4 : 3}
                      className={`w-full px-3 py-2 border rounded-lg text-sm resize-none transition-all ${
                        isActive
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />

                    {/* Inline feedback voor dit veld */}
                    {feedbackItems && (
                      <div className="mt-2">
                        {feedbackItems
                          .filter(f => f.onderdeel === onderdeel.id)
                          .map((f, i) => (
                            <div
                              key={i}
                              className={`flex items-start gap-2 text-sm p-2 rounded-lg ${
                                f.status === 'goed'
                                  ? 'bg-green-50 text-green-800'
                                  : f.status === 'verbeter'
                                  ? 'bg-amber-50 text-amber-800'
                                  : 'bg-red-50 text-red-800'
                              }`}
                            >
                              {f.status === 'goed' ? (
                                <Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
                              ) : (
                                <X className="h-4 w-4 flex-shrink-0 mt-0.5" />
                              )}
                              <span>{f.feedback}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Actieknoppen */}
          <div className="flex gap-3 mb-6">
            <Button
              onClick={handleGetFeedback}
              disabled={!isPromptValid || feedbackLoading}
              variant="outline"
              className="flex-1"
            >
              {feedbackLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <MessageSquare className="h-4 w-4 mr-2" />
              )}
              Feedback
            </Button>
            <Button
              onClick={handleUitvoeren}
              disabled={!isPromptValid || uitvoerLoading}
              className="flex-1"
            >
              {uitvoerLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Uitvoeren
            </Button>
          </div>

          {/* Herschrijf optie (alleen tonen als er feedback is) */}
          {feedbackItems && feedbackItems.some(f => f.status !== 'goed') && (
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-purple-900 font-medium">
                    Wil je zien hoe de AI je prompt zou verbeteren?
                  </p>
                  <p className="text-xs text-purple-700 mt-1">
                    Kijk hoe het beter kan, en pas het zelf aan of neem het over.
                  </p>
                  <Button
                    onClick={handleHerschrijf}
                    disabled={herschrijfLoading}
                    size="sm"
                    variant="outline"
                    className="mt-3"
                  >
                    {herschrijfLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Laat AI herschrijven
                  </Button>
                </div>
              </div>

              {/* Herschreven prompt tonen */}
              {herschrevenPrompt && (
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <p className="text-xs font-medium text-purple-700 uppercase tracking-wide mb-2">
                    Verbeterde versie
                  </p>
                  <div className="bg-white rounded-lg p-3 text-sm space-y-2">
                    {herschrevenPrompt.rol && (
                      <div>
                        <span className="text-purple-600 font-medium">Rol:</span>{' '}
                        <span className="text-gray-700">{herschrevenPrompt.rol}</span>
                      </div>
                    )}
                    {herschrevenPrompt.context && (
                      <div>
                        <span className="text-blue-600 font-medium">Context:</span>{' '}
                        <span className="text-gray-700">{herschrevenPrompt.context}</span>
                      </div>
                    )}
                    {herschrevenPrompt.instructies && (
                      <div>
                        <span className="text-green-600 font-medium">Instructies:</span>{' '}
                        <span className="text-gray-700">{herschrevenPrompt.instructies}</span>
                      </div>
                    )}
                    {herschrevenPrompt.voorbeeld && (
                      <div>
                        <span className="text-amber-600 font-medium">Voorbeeld:</span>{' '}
                        <span className="text-gray-700">{herschrevenPrompt.voorbeeld}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleNeemOver}
                    size="sm"
                    className="mt-3"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Neem over in mijn prompt
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Resultaat */}
          {uitvoerResultaat && (
            <div ref={resultaatRef} className="bg-white rounded-xl border shadow-sm p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-lg">🤖</span> Resultaat
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                {uitvoerResultaat.split('\n').map((line, i) => (
                  <span key={i}>
                    {formatMarkdown(line)}
                    {i < uitvoerResultaat.split('\n').length - 1 && '\n'}
                  </span>
                ))}
              </div>

              {/* Opties na resultaat */}
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={() => {
                    setUitvoerResultaat(null)
                    setPhase('bouwprompt')
                  }}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Prompt aanpassen
                </Button>
                <Button
                  onClick={handleComplete}
                  size="sm"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Klaar
                </Button>
              </div>
            </div>
          )}

          {/* Nog een keer oefenen */}
          {phase === 'resultaat' && (
            <div className="text-center">
              <button
                onClick={handleAndereRol}
                className="text-sm text-gray-500 hover:text-primary transition-colors"
              >
                Oefenen met een andere rol
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Tekst Modal - voor rollen die tekst nodig hebben */}
      {showTekstModal && tekstLabels && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div>
                <h3 className="font-semibold text-gray-900">{tekstLabels.titel}</h3>
                <p className="text-xs text-gray-500">
                  Voeg je tekst toe om de prompt uit te voeren
                </p>
              </div>
              <button
                onClick={() => setShowTekstModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <textarea
                value={bijlageTekst}
                onChange={(e) => setBijlageTekst(e.target.value)}
                placeholder={tekstLabels.placeholder}
                rows={10}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-2">
                Tip: Je kunt tekst kopieren en hier plakken (Ctrl+V of Cmd+V)
              </p>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 flex gap-3">
              <Button
                onClick={() => setShowTekstModal(false)}
                variant="outline"
                className="flex-1"
              >
                Annuleren
              </Button>
              <Button
                onClick={handleTekstSubmit}
                disabled={!bijlageTekst.trim() || uitvoerLoading}
                className="flex-1"
              >
                {uitvoerLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Verstuur naar AI
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
