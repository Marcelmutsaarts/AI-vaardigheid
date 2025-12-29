'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  Sparkles
} from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'
import { aiValkuilen, evalueerPrompts } from '@/lib/evalueren-content'
import { formatMarkdownWithNewlines } from '@/lib/format-markdown'

type Fase = 'intro' | 'bias' | 'hallucinatie' | 'sycofantie' | 'klaar'

interface FeitData {
  nummer: number
  tekst: string
  isWaar: boolean
}

export default function E2Page() {
  const router = useRouter()
  const { niveau, updateProgress } = useNiveau()

  // Algemene state
  const [fase, setFase] = useState<Fase>('intro')
  const [interesses, setInteresses] = useState('')
  const [loading, setLoading] = useState(false)

  // Bias oefening state
  const [biasVerhaal, setBiasVerhaal] = useState('')
  const [biasStap, setBiasStap] = useState<'vraag' | 'invullen' | 'hint' | 'feedback'>('vraag')
  const [biasAntwoord, setBiasAntwoord] = useState('')
  const [biasFeedback, setBiasFeedback] = useState<{ correct: boolean; uitleg: string } | null>(null)
  const [biasCheckLoading, setBiasCheckLoading] = useState(false)

  // Hallucinatie oefening state
  const [feiten, setFeiten] = useState<FeitData[]>([])
  const [feitenUitleg, setFeitenUitleg] = useState('')
  const [gekozenFeit, setGekozenFeit] = useState<number | null>(null)
  const [hallFeedbackGetoond, setHallFeedbackGetoond] = useState(false)

  // Sycofantie oefening state
  const [mening, setMening] = useState('')
  const [sycAntwoord, setSycAntwoord] = useState('')
  const [sycHerkend, setSycHerkend] = useState<string | null>(null)
  const [sycFeedbackGetoond, setSycFeedbackGetoond] = useState(false)

  useEffect(() => {
    if (!niveau.schoolType || !niveau.leerjaar) {
      router.push('/')
    }
  }, [niveau, router])

  if (!niveau.schoolType || !niveau.leerjaar) {
    return null
  }

  // API call helper
  const callAI = async (prompt: string): Promise<string> => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        context: {
          niveau: niveau.schoolType,
          leerjaar: niveau.leerjaar,
          currentModule: 'evalueren',
          aiMode: 'doet'
        }
      })
    })
    if (!response.ok) throw new Error('API error')
    const data = await response.json()
    return data.reply
  }

  // Start de oefeningen
  const handleStart = async () => {
    if (!interesses.trim()) return
    setLoading(true)

    try {
      // Genereer bias verhaal
      const biasPrompt = evalueerPrompts.bias(interesses, niveau.schoolType!)
      const verhaal = await callAI(biasPrompt)
      setBiasVerhaal(verhaal)
      setFase('bias')
    } catch (error) {
      console.error('Error generating bias story:', error)
    } finally {
      setLoading(false)
    }
  }

  // Bias antwoord handlers
  const handleBiasJa = () => {
    setBiasStap('invullen')
  }

  const handleBiasNee = () => {
    setBiasStap('hint')
  }

  const handleBiasHint = () => {
    setBiasStap('invullen')
  }

  const handleBiasCheck = async () => {
    if (!biasAntwoord.trim()) return
    setBiasCheckLoading(true)

    try {
      const response = await callAI(`Je bent een docent die controleert of een leerling bias in een tekst herkent.

VERHAAL:
"${biasVerhaal}"

ANTWOORD VAN DE LEERLING:
"${biasAntwoord}"

HET CORRECTE ANTWOORD:
De bias is dat de AI aanneemt dat de persoon een jongen OF een meisje is, gebaseerd op de interesses/hobby's.

TAAK: Controleer of de leerling dit (ongeveer) goed heeft gezien.

Geef je antwoord in EXACT dit JSON format:
{
  "correct": true/false,
  "uitleg": "Korte feedback (max 25 woorden). Bij correct: bevestig wat ze goed zagen. Bij incorrect: leg uit wat de bias eigenlijk is."
}`)

      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        setBiasFeedback(parsed)
        setBiasStap('feedback')
      }
    } catch (error) {
      console.error('Error checking bias answer:', error)
    } finally {
      setBiasCheckLoading(false)
    }
  }

  // Naar hallucinatie oefening
  const handleNaarHallucinatie = async () => {
    setLoading(true)

    try {
      // Pak eerste interesse voor de feiten
      const eersteInteresse = interesses.split(',')[0].trim() || interesses.trim()
      const hallPrompt = evalueerPrompts.hallucinatie(eersteInteresse, niveau.schoolType!)
      const response = await callAI(hallPrompt)

      // Parse JSON uit response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        // Shuffle de feiten zodat de foute niet altijd op positie 3 staat
        const shuffled = [...parsed.feiten].sort(() => Math.random() - 0.5)
        setFeiten(shuffled)
        setFeitenUitleg(parsed.uitleg || '')
      }
      setFase('hallucinatie')
    } catch (error) {
      console.error('Error generating facts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Check hallucinatie antwoord
  const handleHallCheck = () => {
    setHallFeedbackGetoond(true)
  }

  // Naar sycofantie oefening
  const handleNaarSycofantie = () => {
    setHallFeedbackGetoond(false)
    setFase('sycofantie')
    // Mening NIET prefill - leerling moet zelf invullen
    setMening('')
  }

  // Verstuur mening voor sycofantie
  const handleSycVerstuur = async () => {
    if (!mening.trim()) return
    setLoading(true)

    try {
      const sycPrompt = evalueerPrompts.sycofantie(mening, niveau.schoolType!)
      const response = await callAI(sycPrompt)
      setSycAntwoord(response)
    } catch (error) {
      console.error('Error generating sycophantic response:', error)
    } finally {
      setLoading(false)
    }
  }

  // Check sycofantie herkenning
  const handleSycCheck = () => {
    setSycFeedbackGetoond(true)
  }

  // Afronden
  const handleComplete = () => {
    updateProgress('evalueren', 'e2', true)
    router.push('/dashboard')
  }

  // Huidige valkuil info
  const huidigeValkuil = fase === 'bias' ? aiValkuilen[0] :
    fase === 'hallucinatie' ? aiValkuilen[1] :
    fase === 'sycofantie' ? aiValkuilen[2] : null

  // Progress indicator
  const faseNummer = fase === 'intro' ? 0 : fase === 'bias' ? 1 : fase === 'hallucinatie' ? 2 : fase === 'sycofantie' ? 3 : 4

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Terug link */}
          <Link
            href="/leerpad/evalueren/e1"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Theorie
          </Link>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: kiesKleuren.evalueren }}
              >
                E2
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Spot de valkuilen</h1>
                {huidigeValkuil && (
                  <p className="text-sm text-gray-500">
                    {huidigeValkuil.emoji} {huidigeValkuil.titel}
                  </p>
                )}
              </div>
            </div>

            {/* Progress indicator */}
            {fase !== 'intro' && fase !== 'klaar' && (
              <div className="flex gap-2 mt-3">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      num < faseNummer ? 'bg-green-500' :
                      num === faseNummer ? 'bg-purple-500' :
                      'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* INTRO FASE */}
          {fase === 'intro' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  We gaan drie AI-valkuilen ontmaskeren
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Vul eerst je interesses in. De AI maakt daar oefeningen mee.
                </p>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wat vind jij interessant? (2-3 dingen)
                </label>
                <input
                  type="text"
                  value={interesses}
                  onChange={(e) => setInteresses(e.target.value)}
                  placeholder="bijv. voetbal, muziek, gamen"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Scheid meerdere interesses met een komma
                </p>
              </div>

              <Button
                onClick={handleStart}
                disabled={!interesses.trim() || loading}
                size="lg"
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-5 w-5 mr-2" />
                )}
                Start de oefeningen
              </Button>
            </div>
          )}

          {/* BIAS FASE */}
          {fase === 'bias' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  <strong>Opdracht:</strong> Lees het verhaal goed. Zie je een vooroordeel?
                </p>
              </div>

              <div className="bg-white rounded-xl border shadow-sm p-4">
                <h3 className="font-medium text-gray-900 mb-3">Het verhaal:</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                  {formatMarkdownWithNewlines(biasVerhaal)}
                </div>
              </div>

              {/* Stap 1: Zie je een vooroordeel? */}
              {biasStap === 'vraag' && (
                <div className="bg-white rounded-xl border shadow-sm p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Zie je een vooroordeel in dit verhaal?</h3>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleBiasJa}
                      variant="outline"
                      className="flex-1"
                    >
                      Ja, ik zie het
                    </Button>
                    <Button
                      onClick={handleBiasNee}
                      variant="outline"
                      className="flex-1"
                    >
                      Nee, ik zie het niet
                    </Button>
                  </div>
                </div>
              )}

              {/* Stap 2: Hint als ze het niet zien */}
              {biasStap === 'hint' && (
                <div className="bg-white rounded-xl border shadow-sm p-4">
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4">
                    <p className="text-sm text-amber-800">
                      <strong>Hint:</strong> Let op de woorden &quot;hij&quot; of &quot;zij&quot; in het verhaal.
                      Waarom zou de AI kiezen voor een jongen of een meisje?
                    </p>
                  </div>
                  <Button
                    onClick={handleBiasHint}
                    size="lg"
                    className="w-full"
                  >
                    Ik snap het nu
                  </Button>
                </div>
              )}

              {/* Stap 3: Invullen wat ze zien */}
              {biasStap === 'invullen' && (
                <div className="bg-white rounded-xl border shadow-sm p-4">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Wat is het vooroordeel?
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Beschrijf in je eigen woorden welk vooroordeel je ziet.
                  </p>
                  <textarea
                    value={biasAntwoord}
                    onChange={(e) => setBiasAntwoord(e.target.value)}
                    placeholder="Ik zie dat de AI..."
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mb-3"
                  />
                  <Button
                    onClick={handleBiasCheck}
                    disabled={!biasAntwoord.trim() || biasCheckLoading}
                    size="lg"
                    className="w-full"
                  >
                    {biasCheckLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : null}
                    Controleer mijn antwoord
                  </Button>
                </div>
              )}

              {/* Feedback */}
              {biasStap === 'feedback' && biasFeedback && (
                <div className="space-y-4">
                  <div className={`rounded-xl p-4 ${
                    biasFeedback.correct
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-amber-50 border border-amber-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      {biasFeedback.correct ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`text-sm font-medium ${
                          biasFeedback.correct ? 'text-green-800' : 'text-amber-800'
                        }`}>
                          {biasFeedback.correct ? 'Goed gezien!' : 'Bijna!'}
                        </p>
                        <p className={`text-sm mt-1 ${
                          biasFeedback.correct ? 'text-green-700' : 'text-amber-700'
                        }`}>
                          {biasFeedback.uitleg}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                    <p className="text-sm text-purple-800">
                      <strong>Onthoud:</strong> AI neemt aan dat bepaalde hobby&apos;s bij een jongen of meisje horen.
                      Dat is een vooroordeel - iedereen kan van alles houden!
                    </p>
                  </div>

                  <Button
                    onClick={handleNaarHallucinatie}
                    disabled={loading}
                    size="lg"
                    className="w-full"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : null}
                    Volgende: Verzinsels
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* HALLUCINATIE FASE */}
          {fase === 'hallucinatie' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  <strong>Opdracht:</strong> Eén van deze feiten is verzonnen. Welke?
                </p>
              </div>

              <div className="bg-white rounded-xl border shadow-sm p-4">
                <h3 className="font-medium text-gray-900 mb-3">Drie feiten over {interesses.split(',')[0].trim()}:</h3>
                <div className="space-y-2">
                  {feiten.map((feit, index) => (
                    <button
                      key={index}
                      onClick={() => !hallFeedbackGetoond && setGekozenFeit(feit.nummer)}
                      disabled={hallFeedbackGetoond}
                      className={`w-full p-3 rounded-lg border text-left text-sm transition-all ${
                        hallFeedbackGetoond
                          ? feit.isWaar
                            ? 'bg-green-50 border-green-300'
                            : 'bg-red-50 border-red-300'
                          : gekozenFeit === feit.nummer
                            ? 'bg-purple-50 border-purple-300'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 ${
                          hallFeedbackGetoond
                            ? feit.isWaar
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                            : gekozenFeit === feit.nummer
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                        }`}>
                          {hallFeedbackGetoond ? (feit.isWaar ? '✓' : '✗') : index + 1}
                        </span>
                        <span className="flex-1">{feit.tekst}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {!hallFeedbackGetoond ? (
                <Button
                  onClick={handleHallCheck}
                  disabled={gekozenFeit === null}
                  size="lg"
                  className="w-full"
                >
                  Dit is het verzinsel
                </Button>
              ) : (
                <div className="space-y-4">
                  {feiten.find(f => f.nummer === gekozenFeit)?.isWaar === false ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-green-800 font-medium">
                            Goed gevonden!
                          </p>
                          <p className="text-sm text-green-700 mt-1">
                            {feitenUitleg}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-red-800 font-medium">
                            Helaas, dat was niet het verzinsel
                          </p>
                          <p className="text-sm text-red-700 mt-1">
                            {feitenUitleg}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Onthoud:</strong> {huidigeValkuil?.tip}
                    </p>
                  </div>

                  <Button
                    onClick={handleNaarSycofantie}
                    size="lg"
                    className="w-full"
                  >
                    Volgende: De ja-knikker
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* SYCOFANTIE FASE */}
          {fase === 'sycofantie' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  <strong>Opdracht:</strong> Geef een sterke mening. Overdrijf gerust! Kijk wat de AI doet.
                </p>
              </div>

              <div className="bg-white rounded-xl border shadow-sm p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jouw mening:
                </label>
                <textarea
                  value={mening}
                  onChange={(e) => setMening(e.target.value)}
                  placeholder="bijv. Voetbal is de enige echte sport, de rest stelt niks voor"
                  rows={3}
                  disabled={sycAntwoord !== ''}
                  className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {!sycAntwoord ? (
                <Button
                  onClick={handleSycVerstuur}
                  disabled={!mening.trim() || loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : null}
                  Verstuur naar AI
                </Button>
              ) : (
                <>
                  <div className="bg-white rounded-xl border shadow-sm p-4">
                    <h3 className="font-medium text-gray-900 mb-3">AI zegt:</h3>
                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                      {formatMarkdownWithNewlines(sycAntwoord)}
                    </div>
                  </div>

                  {!sycFeedbackGetoond ? (
                    <div className="bg-white rounded-xl border shadow-sm p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Wat valt je op?</h3>
                      <div className="space-y-2">
                        {[
                          { id: 'jaknikker', label: 'De AI geeft me gelijk, ook al overdreef ik', correct: true },
                          { id: 'kritisch', label: 'De AI gaf goede tegenargumenten', correct: false },
                          { id: 'neutraal', label: 'De AI bleef neutraal', correct: false }
                        ].map((optie) => (
                          <button
                            key={optie.id}
                            onClick={() => setSycHerkend(optie.id)}
                            className={`w-full p-3 rounded-lg border text-left text-sm transition-all ${
                              sycHerkend === optie.id
                                ? 'bg-purple-50 border-purple-300 text-purple-900'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className={`inline-block w-4 h-4 rounded-full border mr-2 align-middle ${
                              sycHerkend === optie.id
                                ? 'bg-purple-500 border-purple-500'
                                : 'border-gray-300'
                            }`} />
                            {optie.label}
                          </button>
                        ))}
                      </div>

                      <Button
                        onClick={handleSycCheck}
                        disabled={!sycHerkend}
                        size="lg"
                        className="w-full mt-4"
                      >
                        Controleer
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sycHerkend === 'jaknikker' ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-green-800 font-medium">
                                Precies!
                              </p>
                              <p className="text-sm text-green-700 mt-1">
                                {huidigeValkuil?.uitleg}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <XCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-amber-800 font-medium">
                                Kijk nog eens goed
                              </p>
                              <p className="text-sm text-amber-700 mt-1">
                                De AI gaf je volledig gelijk, zonder kritiek. Dat is het ja-knikker gedrag.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-sm text-blue-800">
                          <strong>Tip:</strong> {huidigeValkuil?.tip}
                        </p>
                      </div>

                      <Button
                        onClick={() => setFase('klaar')}
                        size="lg"
                        className="w-full"
                      >
                        Afronden
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* KLAAR FASE */}
          {fase === 'klaar' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Goed gedaan!
                </h2>
                <p className="text-gray-600">
                  Je hebt drie AI-valkuilen leren herkennen.
                </p>
              </div>

              <div className="bg-white rounded-xl border shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Wat je hebt geleerd:</h3>
                <div className="space-y-3">
                  {aiValkuilen.map((valkuil) => (
                    <div key={valkuil.id} className="flex items-start gap-3">
                      <span className="text-xl">{valkuil.emoji}</span>
                      <div>
                        <p className="font-medium text-gray-900">{valkuil.titel}</p>
                        <p className="text-sm text-gray-500">{valkuil.tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                <p className="text-sm text-purple-900 text-center font-medium">
                  Onthoud: Mens - AI - Mens. JIJ checkt altijd het eindresultaat!
                </p>
              </div>

              <Button
                onClick={handleComplete}
                size="lg"
                className="w-full"
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Module afronden
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
