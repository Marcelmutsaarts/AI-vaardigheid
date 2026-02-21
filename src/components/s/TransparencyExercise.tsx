'use client'

import { useState, useEffect } from 'react'
import { useNiveau } from '@/contexts/NiveauContext'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { formatMarkdownWithNewlines } from '@/lib/format-markdown'

type SchoolbeleidAntwoord = 'ja-ken' | 'ja-niet-goed' | 'nee-weet-niet' | null

interface K2Stap {
  id: string
  titel: string
  aanpak: 'zelf' | 'aihelpt' | 'aidoet' | null
  rol?: string
  approach?: { type: 'zelf' } | { type: 'roles'; roles: Array<{ id: string; category: string; name: string; emoji: string }> } | null
}

interface K2Data {
  gekozenOpdracht: { titel: string } | null
  stappen: K2Stap[]
}

const STORAGE_KEY = 'kies-s2-state'

// Fallback als K2 niet gedaan is
const fallbackK2Data: K2Data = {
  gekozenOpdracht: { titel: 'Een werkstuk schrijven over klimaatverandering' },
  stappen: [
    { id: '1', titel: 'Bronnen zoeken', aanpak: 'aihelpt', rol: 'tutor' },
    { id: '2', titel: 'Structuur maken', aanpak: 'zelf' },
    { id: '3', titel: 'Tekst schrijven', aanpak: 'aidoet', rol: 'ghostwriter' },
    { id: '4', titel: 'Nakijken', aanpak: 'zelf' },
  ]
}

const schoolbeleidReacties: Record<string, string> = {
  'ja-ken': 'Goed. Die regels gaan altijd voor.',
  'ja-niet-goed': 'Zoek ze op of vraag je docent. Dat helpt bij de volgende stap.',
  'nee-weet-niet': 'Vraag je mentor of kijk op de schoolsite.',
}

interface TransparencyExerciseProps {
  level: string
  onComplete: () => void
}

export default function TransparencyExercise({ level, onComplete }: TransparencyExerciseProps) {
  const { niveau } = useNiveau()

  // Deel 1: Schoolbeleid
  const [schoolbeleid, setSchoolbeleid] = useState<SchoolbeleidAntwoord>(null)
  const [toonDeel2, setToonDeel2] = useState(false)

  // Deel 2: Reflectie
  const [k2Data, setK2Data] = useState<K2Data | null>(null)
  const [reflectie, setReflectie] = useState('')
  const [feedback, setFeedback] = useState('')
  const [feedbackLoading, setFeedbackLoading] = useState(false)

  const [isLoaded, setIsLoaded] = useState(false)

  // Load K2 data and saved state
  useEffect(() => {
    // Try to load K2 data
    const k2Saved = localStorage.getItem('kies-k2-state')
    if (k2Saved) {
      try {
        const data = JSON.parse(k2Saved)
        if (data.gekozenOpdracht && data.stappen?.length > 0) {
          setK2Data({
            gekozenOpdracht: data.gekozenOpdracht,
            stappen: data.stappen
          })
        } else {
          setK2Data(fallbackK2Data)
        }
      } catch {
        setK2Data(fallbackK2Data)
      }
    } else {
      setK2Data(fallbackK2Data)
    }

    // Load S2 saved state
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.schoolbeleid) setSchoolbeleid(data.schoolbeleid)
        if (data.toonDeel2) setToonDeel2(data.toonDeel2)
        if (data.reflectie) setReflectie(data.reflectie)
        if (data.feedback) setFeedback(data.feedback)
      } catch (e) {
        console.error('Error loading S2 state:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save state
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        schoolbeleid,
        toonDeel2,
        reflectie,
        feedback
      }))
    }
  }, [schoolbeleid, toonDeel2, reflectie, feedback, isLoaded])

  // Call onComplete when feedback from reflectie-check is received
  useEffect(() => {
    if (feedback && isLoaded) {
      onComplete()
    }
  }, [feedback, isLoaded, onComplete])

  const getAanpakLabel = (stap: K2Stap) => {
    // Prefer new multi-select approach field if present
    if (stap.approach) {
      if (stap.approach.type === 'zelf') return { label: 'Zelf', color: 'bg-green-100 text-green-700' }
      if (stap.approach.type === 'roles' && stap.approach.roles.length > 0) {
        const names = stap.approach.roles.map(r => r.name).join(', ')
        const hasAiHelpt = stap.approach.roles.some(r => r.category === 'aihelpt')
        const hasAiDoet = stap.approach.roles.some(r => r.category === 'aidoet')
        if (hasAiHelpt && hasAiDoet) return { label: `AI (${names})`, color: 'bg-indigo-100 text-indigo-700' }
        if (hasAiDoet) return { label: `AI doet (${names})`, color: 'bg-purple-100 text-purple-700' }
        return { label: `AI helpt (${names})`, color: 'bg-blue-100 text-blue-700' }
      }
    }
    // Fallback to old aanpak/rol fields
    if (!stap.aanpak) return { label: '?', color: 'bg-gray-100' }
    if (stap.aanpak === 'zelf') return { label: 'Zelf', color: 'bg-green-100 text-green-700' }
    if (stap.aanpak === 'aihelpt') return { label: `AI helpt${stap.rol ? ` (${stap.rol})` : ''}`, color: 'bg-blue-100 text-blue-700' }
    return { label: `AI doet${stap.rol ? ` (${stap.rol})` : ''}`, color: 'bg-purple-100 text-purple-700' }
  }

  const handleReflectieCheck = async () => {
    if (!reflectie.trim() || !k2Data) return

    setFeedbackLoading(true)
    try {
      const response = await fetch('/api/s2-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opdracht: k2Data.gekozenOpdracht?.titel,
          stappen: k2Data.stappen,
          reflectie,
          niveau: niveau.schoolType,
        }),
      })

      const data = await response.json()
      if (data.feedback) {
        setFeedback(data.feedback)
      }
    } catch (error) {
      console.error('Feedback error:', error)
      setFeedback('Er ging iets mis. Probeer opnieuw.')
    } finally {
      setFeedbackLoading(false)
    }
  }

  const deel1Klaar = schoolbeleid !== null

  return (
    <div>
      {/* Deel 1: Schoolbeleid */}
      {!toonDeel2 && (
        <div className="bg-white rounded-xl border shadow-sm p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">Schoolbeleid</h2>
          <p className="text-sm text-gray-600 mb-4">
            De meeste scholen hebben regels over AI-gebruik. Bijvoorbeeld: wanneer mag je AI gebruiken voor huiswerk? Moet je het melden? Ken jij de regels van jouw school?
          </p>

          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="schoolbeleid"
                checked={schoolbeleid === 'ja-ken'}
                onChange={() => setSchoolbeleid('ja-ken')}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm">Ja, ik ken de regels van mijn school</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="schoolbeleid"
                checked={schoolbeleid === 'ja-niet-goed'}
                onChange={() => setSchoolbeleid('ja-niet-goed')}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm">Ja, maar ik ken ze niet goed</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="schoolbeleid"
                checked={schoolbeleid === 'nee-weet-niet'}
                onChange={() => setSchoolbeleid('nee-weet-niet')}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm">Nee / Weet ik niet</span>
            </label>
          </div>

          {schoolbeleid && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700">{schoolbeleidReacties[schoolbeleid]}</p>
            </div>
          )}

          {deel1Klaar && (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Naast schoolregels zijn er algemene principes over wanneer en hoe je AI-gebruik meldt. Die ga je nu toepassen.
              </p>
              <Button onClick={() => setToonDeel2(true)} className="w-full">
                Volgende
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )}

      {/* Deel 2: Reflectie op eigen plan */}
      {toonDeel2 && k2Data && (
        <div className="bg-white rounded-xl border shadow-sm p-5 mb-6">
          <button
            onClick={() => setToonDeel2(false)}
            className="text-sm text-gray-500 hover:text-primary mb-3 flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Terug naar schoolbeleid
          </button>
          <h2 className="font-semibold text-gray-900 mb-2">Meld ik AI-gebruik of niet?</h2>
          <p className="text-sm text-gray-600 mb-4">
            De kernvraag is: <strong>is het werk dat je oplevert echt van jou?</strong> Denk daar goed over na bij het bekijken van je eigen AI-strategie hieronder.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {k2Data.gekozenOpdracht?.titel || 'Opdracht'}
            </p>
            <div className="space-y-1">
              {k2Data.stappen.map((stap) => {
                const { label, color } = getAanpakLabel(stap)
                return (
                  <div key={stap.id} className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">{stap.titel}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${color}`}>{label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zou je dit melden? Waarom wel/niet?
          </label>
          <textarea
            value={reflectie}
            onChange={(e) => setReflectie(e.target.value)}
            placeholder="Typ je antwoord..."
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none mb-3"
            rows={3}
          />

          <Button
            onClick={handleReflectieCheck}
            disabled={!reflectie.trim() || feedbackLoading}
            size="sm"
            className="mb-3"
          >
            {feedbackLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Checken...
              </>
            ) : (
              'Check'
            )}
          </Button>

          {feedback && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
              {formatMarkdownWithNewlines(feedback)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
