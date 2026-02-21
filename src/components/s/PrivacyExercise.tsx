'use client'

import { useState, useEffect } from 'react'
import { useNiveau } from '@/contexts/NiveauContext'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { formatMarkdownWithNewlines } from '@/lib/format-markdown'

type CategorieId = 'van-mij' | 'van-anderen' | 'geheim'

interface Categorie {
  id: CategorieId
  emoji: string
  titel: string
  vraag: string
}

const categorieen: Categorie[] = [
  {
    id: 'van-mij',
    emoji: '\u{1F9D1}',
    titel: 'Van jezelf',
    vraag: 'Welke persoonlijke dingen zou je niet delen met AI?',
  },
  {
    id: 'van-anderen',
    emoji: '\u{1F465}',
    titel: 'Van anderen',
    vraag: 'Welke dingen over anderen zou je niet delen met AI?',
  },
  {
    id: 'geheim',
    emoji: '\u{1F512}',
    titel: 'Vertrouwelijk',
    vraag: 'Welke vertrouwelijke dingen zou je niet delen met AI?',
  },
]

const STORAGE_KEY = 'kies-s1-antwoorden'

interface PrivacyExerciseProps {
  level: string
  onComplete: () => void
}

export default function PrivacyExercise({ level, onComplete }: PrivacyExerciseProps) {
  const { niveau } = useNiveau()
  const [antwoorden, setAntwoorden] = useState<Record<CategorieId, string>>({
    'van-mij': '',
    'van-anderen': '',
    'geheim': '',
  })
  const [feedback, setFeedback] = useState<Record<CategorieId, string>>({
    'van-mij': '',
    'van-anderen': '',
    'geheim': '',
  })
  const [loading, setLoading] = useState<Record<CategorieId, boolean>>({
    'van-mij': false,
    'van-anderen': false,
    'geheim': false,
  })
  const [isLoaded, setIsLoaded] = useState(false)

  // Load saved answers
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.antwoorden) setAntwoorden(data.antwoorden)
        if (data.feedback) setFeedback(data.feedback)
      } catch (e) {
        console.error('Error loading S1 data:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save answers
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ antwoorden, feedback }))
    }
  }, [antwoorden, feedback, isLoaded])

  // Call onComplete when all three categories have feedback
  const alleIngevuld = categorieen.every(cat => feedback[cat.id])
  useEffect(() => {
    if (alleIngevuld && isLoaded) {
      onComplete()
    }
  }, [alleIngevuld, isLoaded, onComplete])

  const handleCheck = async (categorieId: CategorieId) => {
    const antwoord = antwoorden[categorieId].trim()
    if (!antwoord) return

    setLoading(prev => ({ ...prev, [categorieId]: true }))

    try {
      const response = await fetch('/api/s1-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categorie: categorieId,
          antwoord,
          niveau: niveau.schoolType,
        }),
      })

      const data = await response.json()
      if (data.feedback) {
        setFeedback(prev => ({ ...prev, [categorieId]: data.feedback }))
      } else {
        setFeedback(prev => ({ ...prev, [categorieId]: 'Kon geen feedback ophalen.' }))
      }
    } catch (error) {
      console.error('Feedback error:', error)
      setFeedback(prev => ({ ...prev, [categorieId]: 'Er ging iets mis. Probeer opnieuw.' }))
    } finally {
      setLoading(prev => ({ ...prev, [categorieId]: false }))
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {categorieen.map((cat) => (
        <div
          key={cat.id}
          className="bg-white rounded-xl border shadow-sm p-4 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{cat.emoji}</span>
            <h2 className="font-semibold text-gray-900">{cat.titel}</h2>
          </div>

          {/* Vraag */}
          <p className="text-sm text-gray-600 mb-3">{cat.vraag}</p>

          {/* Input */}
          <textarea
            value={antwoorden[cat.id]}
            onChange={(e) => setAntwoorden(prev => ({ ...prev, [cat.id]: e.target.value }))}
            placeholder="Typ hier..."
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none mb-3"
            rows={3}
            disabled={loading[cat.id]}
          />

          {/* Check button */}
          <Button
            onClick={() => handleCheck(cat.id)}
            disabled={!antwoorden[cat.id].trim() || loading[cat.id]}
            size="sm"
            className="mb-3"
          >
            {loading[cat.id] ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Checken...
              </>
            ) : (
              'Check'
            )}
          </Button>

          {/* Feedback */}
          {feedback[cat.id] && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
              {formatMarkdownWithNewlines(feedback[cat.id])}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
