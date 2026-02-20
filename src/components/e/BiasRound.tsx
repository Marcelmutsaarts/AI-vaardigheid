'use client'

import React, { useState, useEffect } from 'react'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { evalueerPrompts } from '@/lib/evalueren-content'
import { formatMarkdownWithNewlines } from '@/lib/format-markdown'

interface RoundProps {
  interests: string[]
  level: string
  leerjaar?: number | null
  onComplete: (result: { correct: boolean }) => void
}

type BiasStap = 'loading' | 'error' | 'vraag' | 'hint' | 'invullen' | 'feedback'

export default function BiasRound({ interests, level, leerjaar, onComplete }: RoundProps) {
  const [verhaal, setVerhaal] = useState('')
  const [stap, setStap] = useState<BiasStap>('loading')
  const [antwoord, setAntwoord] = useState('')
  const [feedback, setFeedback] = useState<{ correct: boolean; uitleg: string } | null>(null)
  const [checkLoading, setCheckLoading] = useState(false)
  const [checkError, setCheckError] = useState(false)

  const callAI = async (prompt: string): Promise<string> => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        context: {
          niveau: level,
          leerjaar: leerjaar,
          currentModule: 'evalueren',
          aiMode: 'doet'
        }
      })
    })
    if (!response.ok) throw new Error('API error')
    const data = await response.json()
    return data.reply
  }

  // Generate bias story on mount
  useEffect(() => {
    let cancelled = false

    const generate = async () => {
      try {
        const interestStr = interests.join(', ')
        const biasPrompt = evalueerPrompts.bias(interestStr, level)
        const result = await callAI(biasPrompt)
        if (!cancelled) {
          setVerhaal(result)
          setStap('vraag')
        }
      } catch (error) {
        console.error('Error generating bias story:', error)
        if (!cancelled) setStap('error')
      }
    }

    generate()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCheck = async () => {
    if (!antwoord.trim()) return
    setCheckLoading(true)

    try {
      const response = await callAI(`Je bent een docent die controleert of een leerling bias in een tekst herkent.

VERHAAL:
"${verhaal}"

ANTWOORD VAN DE LEERLING:
"${antwoord}"

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
        setFeedback(parsed)
        setStap('feedback')
      }
    } catch (error) {
      console.error('Error checking bias answer:', error)
      setCheckError(true)
    } finally {
      setCheckLoading(false)
    }
  }

  // Loading state
  if (stap === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-3" />
        <p className="text-sm text-gray-500">Verhaal wordt gegenereerd...</p>
      </div>
    )
  }

  // Error state
  if (stap === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-3">
        <XCircle className="h-8 w-8 text-red-400" />
        <p className="text-sm text-gray-600">Er ging iets mis bij het genereren. Probeer het opnieuw.</p>
        <Button onClick={() => { setStap('loading'); window.location.reload() }} variant="outline">
          Opnieuw proberen
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Opdracht */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <strong>Opdracht:</strong> Lees het verhaal goed. Zie je iets dat niet klopt?
        </p>
      </div>

      {/* Verhaal */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <h3 className="font-medium text-gray-900 mb-3">Het verhaal:</h3>
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
          {formatMarkdownWithNewlines(verhaal)}
        </div>
      </div>

      {/* Stap 1: Zie je een vooroordeel? */}
      {stap === 'vraag' && (
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <h3 className="font-medium text-gray-900 mb-3">Zie je een vooroordeel in dit verhaal?</h3>
          <div className="flex gap-3">
            <Button
              onClick={() => setStap('invullen')}
              variant="outline"
              className="flex-1"
            >
              Ja, ik zie het
            </Button>
            <Button
              onClick={() => setStap('hint')}
              variant="outline"
              className="flex-1"
            >
              Nee, ik zie het niet
            </Button>
          </div>
        </div>
      )}

      {/* Stap 2: Hint */}
      {stap === 'hint' && (
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4">
            <p className="text-sm text-amber-800">
              <strong>Hint:</strong> Let op de woorden &quot;hij&quot; of &quot;zij&quot; in het verhaal.
              Waarom zou de AI kiezen voor een jongen of een meisje?
            </p>
          </div>
          <Button
            onClick={() => setStap('invullen')}
            size="lg"
            className="w-full"
          >
            Ik snap het nu
          </Button>
        </div>
      )}

      {/* Stap 3: Invullen */}
      {stap === 'invullen' && (
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <h3 className="font-medium text-gray-900 mb-3">
            Wat is het vooroordeel?
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Beschrijf in je eigen woorden welk vooroordeel je ziet.
          </p>
          <textarea
            value={antwoord}
            onChange={(e) => setAntwoord(e.target.value)}
            placeholder="Ik zie dat de AI..."
            rows={3}
            className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mb-3"
          />
          {checkError && (
            <p className="text-sm text-red-600 mb-2">Er ging iets mis. Probeer het opnieuw.</p>
          )}
          <Button
            onClick={() => { setCheckError(false); handleCheck() }}
            disabled={!antwoord.trim() || checkLoading}
            size="lg"
            className="w-full"
          >
            {checkLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : null}
            Controleer mijn antwoord
          </Button>
        </div>
      )}

      {/* Feedback */}
      {stap === 'feedback' && feedback && (
        <div className="space-y-4">
          <div className={`rounded-xl p-4 ${
            feedback.correct
              ? 'bg-green-50 border border-green-200'
              : 'bg-amber-50 border border-amber-200'
          }`}>
            <div className="flex items-start gap-3">
              {feedback.correct ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-sm font-medium ${
                  feedback.correct ? 'text-green-800' : 'text-amber-800'
                }`}>
                  {feedback.correct ? 'Goed gezien!' : 'Bijna!'}
                </p>
                <p className={`text-sm mt-1 ${
                  feedback.correct ? 'text-green-700' : 'text-amber-700'
                }`}>
                  {feedback.uitleg}
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
            onClick={() => onComplete({ correct: feedback.correct })}
            size="lg"
            className="w-full"
          >
            Ga verder &rarr;
          </Button>
        </div>
      )}
    </div>
  )
}
