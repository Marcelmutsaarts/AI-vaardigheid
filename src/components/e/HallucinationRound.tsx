'use client'

import React, { useState, useEffect } from 'react'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { evalueerPrompts, aiValkuilen } from '@/lib/evalueren-content'

interface RoundProps {
  interests: string[]
  level: string
  leerjaar?: string
  onComplete: (result: { correct: boolean }) => void
}

interface FeitData {
  nummer: number
  tekst: string
  isWaar: boolean
}

export default function HallucinationRound({ interests, level, leerjaar, onComplete }: RoundProps) {
  const [feiten, setFeiten] = useState<FeitData[]>([])
  const [feitenUitleg, setFeitenUitleg] = useState('')
  const [gekozenFeit, setGekozenFeit] = useState<number | null>(null)
  const [feedbackGetoond, setFeedbackGetoond] = useState(false)
  const [loading, setLoading] = useState(true)

  const hallucinatieValkuil = aiValkuilen[1]

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

  // Generate facts on mount
  useEffect(() => {
    let cancelled = false

    const generate = async () => {
      try {
        const eersteInteresse = interests[0] || interests.join(', ')
        const hallPrompt = evalueerPrompts.hallucinatie(eersteInteresse, level)
        const response = await callAI(hallPrompt)

        if (!cancelled) {
          const jsonMatch = response.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            // Shuffle facts so the fake one isn't always at position 3
            const shuffled = [...parsed.feiten].sort(() => Math.random() - 0.5)
            setFeiten(shuffled)
            setFeitenUitleg(parsed.uitleg || '')
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('Error generating facts:', error)
        if (!cancelled) setLoading(false)
      }
    }

    generate()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCheck = () => {
    setFeedbackGetoond(true)
  }

  const isCorrect = feiten.find(f => f.nummer === gekozenFeit)?.isWaar === false

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-3" />
        <p className="text-sm text-gray-500">Feiten worden gegenereerd...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Opdracht */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <strong>Opdracht:</strong> Een van deze feiten is verzonnen. Welke?
        </p>
      </div>

      {/* Feiten */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <h3 className="font-medium text-gray-900 mb-3">Drie feiten over {interests[0] || interests.join(', ')}:</h3>
        <div className="space-y-2">
          {feiten.map((feit, index) => (
            <button
              key={index}
              onClick={() => !feedbackGetoond && setGekozenFeit(feit.nummer)}
              disabled={feedbackGetoond}
              className={`w-full p-3 rounded-lg border text-left text-sm transition-all ${
                feedbackGetoond
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
                  feedbackGetoond
                    ? feit.isWaar
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : gekozenFeit === feit.nummer
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {feedbackGetoond ? (feit.isWaar ? '\u2713' : '\u2717') : index + 1}
                </span>
                <span className="flex-1">{feit.tekst}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {!feedbackGetoond ? (
        <Button
          onClick={handleCheck}
          disabled={gekozenFeit === null}
          size="lg"
          className="w-full"
        >
          Dit is het verzinsel
        </Button>
      ) : (
        <div className="space-y-4">
          {isCorrect ? (
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
              <strong>Onthoud:</strong> {hallucinatieValkuil.tip}
            </p>
          </div>

          <Button
            onClick={() => onComplete({ correct: isCorrect })}
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
