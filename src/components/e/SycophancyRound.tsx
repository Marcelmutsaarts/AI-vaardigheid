'use client'

import React, { useState } from 'react'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { evalueerPrompts, aiValkuilen } from '@/lib/evalueren-content'
import { formatMarkdownWithNewlines } from '@/lib/format-markdown'

interface RoundProps {
  interests: string[]
  level: string
  leerjaar?: number | null
  onComplete: (result: { correct: boolean }) => void
}

const mcOpties = [
  { id: 'jaknikker', label: 'De AI geeft me gelijk, ook al overdreef ik' },
  { id: 'kritisch', label: 'De AI gaf goede tegenargumenten' },
  { id: 'neutraal', label: 'De AI bleef neutraal' }
] as const

export default function SycophancyRound({ interests, level, leerjaar, onComplete }: RoundProps) {
  const [mening, setMening] = useState('')
  const [aiAntwoord, setAiAntwoord] = useState('')
  const [loading, setLoading] = useState(false)
  const [gekozen, setGekozen] = useState<string | null>(null)
  const [feedbackGetoond, setFeedbackGetoond] = useState(false)

  const sycofantieValkuil = aiValkuilen[2]

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

  const handleVerstuur = async () => {
    if (!mening.trim()) return
    setLoading(true)

    try {
      const sycPrompt = evalueerPrompts.sycofantie(mening, level)
      const response = await callAI(sycPrompt)
      setAiAntwoord(response)
    } catch (error) {
      console.error('Error generating sycophantic response:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheck = () => {
    setFeedbackGetoond(true)
  }

  const isCorrect = gekozen === 'jaknikker'

  return (
    <div className="space-y-4">
      {/* Opdracht */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <strong>Opdracht:</strong> Geef een sterke mening. Overdrijf gerust! Kijk wat de AI doet.
        </p>
      </div>

      {/* Mening invoer */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jouw mening:
        </label>
        <textarea
          value={mening}
          onChange={(e) => setMening(e.target.value)}
          placeholder="bijv. Voetbal is de enige echte sport, de rest stelt niks voor"
          rows={3}
          disabled={aiAntwoord !== ''}
          className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {!aiAntwoord ? (
        <Button
          onClick={handleVerstuur}
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
          {/* AI antwoord */}
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <h3 className="font-medium text-gray-900 mb-3">AI zegt:</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
              {formatMarkdownWithNewlines(aiAntwoord)}
            </div>
          </div>

          {!feedbackGetoond ? (
            <div className="bg-white rounded-xl border shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-3">Wat valt je op?</h3>
              <div className="space-y-2">
                {mcOpties.map((optie) => (
                  <button
                    key={optie.id}
                    onClick={() => setGekozen(optie.id)}
                    className={`w-full p-3 rounded-lg border text-left text-sm transition-all ${
                      gekozen === optie.id
                        ? 'bg-purple-50 border-purple-300 text-purple-900'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className={`inline-block w-4 h-4 rounded-full border mr-2 align-middle ${
                      gekozen === optie.id
                        ? 'bg-purple-500 border-purple-500'
                        : 'border-gray-300'
                    }`} />
                    {optie.label}
                  </button>
                ))}
              </div>

              <Button
                onClick={handleCheck}
                disabled={!gekozen}
                size="lg"
                className="w-full mt-4"
              >
                Controleer
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {isCorrect ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-800 font-medium">
                        Precies!
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        {sycofantieValkuil.uitleg}
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
                  <strong>Tip:</strong> {sycofantieValkuil.tip}
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
        </>
      )}
    </div>
  )
}
