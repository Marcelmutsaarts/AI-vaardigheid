'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Check, X, MessageSquare, Loader2, ArrowUp, Play } from 'lucide-react'
import { promptOnderdelen, getOnderdeelLabel } from '@/lib/instrueren-content'
import { formatMarkdownWithNewlines } from '@/lib/format-markdown'

// ── Types ──────────────────────────────────────────────────────────────────

interface PromptWorkspaceProps {
  role: { id: string; emoji: string; titel: string; beschrijving: string }
  niveau: string // 'vmbo' | 'havo' | 'vwo' | 'mbo' | 'hbo'
  leerjaar: number | null
  onComplete: () => void
  onDirtyChange?: (isDirty: boolean) => void
}

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

type Phase = 'building' | 'feedback' | 'testing' | 'reflecting'

// ── Badge colors per field ─────────────────────────────────────────────────

const FIELD_BADGE_COLORS: Record<string, string> = {
  rol: 'bg-amber-500',
  context: 'bg-emerald-500',
  instructies: 'bg-blue-500',
  voorbeeld: 'bg-purple-500',
}

// ── Component ──────────────────────────────────────────────────────────────

export default function PromptWorkspace({
  role,
  niveau,
  leerjaar,
  onComplete,
  onDirtyChange,
}: PromptWorkspaceProps) {
  // ── State ──────────────────────────────────────────────────────────────
  const [promptInput, setPromptInput] = useState<PromptInput>({
    rol: '',
    context: '',
    instructies: '',
    voorbeeld: '',
  })
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[] | null>(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [phase, setPhase] = useState<Phase>('building')
  const [testResult, setTestResult] = useState<string | null>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [reflectionAnswer, setReflectionAnswer] = useState<'ja' | 'deels' | 'nee' | null>(null)

  // ── Refs for scroll-to-field ───────────────────────────────────────────
  const fieldRefs = {
    rol: useRef<HTMLDivElement>(null),
    context: useRef<HTMLDivElement>(null),
    instructies: useRef<HTMLDivElement>(null),
    voorbeeld: useRef<HTMLDivElement>(null),
  }
  const feedbackRef = useRef<HTMLDivElement>(null)
  const testResultRef = useRef<HTMLDivElement>(null)

  // ── Reset on role change ───────────────────────────────────────────────
  useEffect(() => {
    setPromptInput({ rol: '', context: '', instructies: '', voorbeeld: '' })
    setFeedbackItems(null)
    setFeedbackLoading(false)
    setPhase('building')
    setTestResult(null)
    setTestLoading(false)
    setStreamingContent('')
    setReflectionAnswer(null)
  }, [role.id])

  // ── Dirty tracking ────────────────────────────────────────────────────
  const isDirty = !!(
    promptInput.rol.trim() ||
    promptInput.context.trim() ||
    promptInput.instructies.trim() ||
    promptInput.voorbeeld.trim()
  )

  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

  // ── Validation ─────────────────────────────────────────────────────────
  const canRequestFeedback =
    promptInput.rol.trim().length > 0 && promptInput.instructies.trim().length > 0

  // ── Input handler ──────────────────────────────────────────────────────
  const handleInputChange = useCallback(
    (field: keyof PromptInput, value: string) => {
      setPromptInput((prev) => ({ ...prev, [field]: value }))
      // Do NOT clear feedback when input changes — the student sees feedback while editing
    },
    []
  )

  // ── Get feedback ───────────────────────────────────────────────────────
  const handleGetFeedback = async () => {
    if (!canRequestFeedback) return

    setTestResult(null)
    setReflectionAnswer(null)
    setStreamingContent('')
    setFeedbackLoading(true)
    setFeedbackItems(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Analyseer deze prompt en geef feedback per onderdeel. De leerling oefent met het bouwen van prompts.

GEKOZEN ROL: ${role.titel}

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
            niveau: niveau,
            leerjaar: leerjaar,
            currentModule: 'instrueren',
            moduleContext: `Rol: ${role.titel}`,
            aiMode: 'doet',
          },
        }),
      })

      if (response.ok) {
        const data = await response.json()
        try {
          const jsonMatch = data.reply.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            setFeedbackItems(parsed.feedback)
            setPhase('feedback')

            // Scroll to feedback card
            setTimeout(() => {
              feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
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

  // ── Scroll helpers ─────────────────────────────────────────────────────
  const scrollToField = (fieldId: string) => {
    const ref = fieldRefs[fieldId as keyof typeof fieldRefs]
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const scrollToTop = () => {
    fieldRefs.rol.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ── Handle "Prompt testen" ─────────────────────────────────────────────
  const handleTestPrompt = async () => {
    setTestLoading(true)
    setTestResult(null)
    setStreamingContent('')
    setReflectionAnswer(null)
    setPhase('testing')

    // Scroll to test result area
    setTimeout(() => {
      testResultRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)

    try {
      // Build the full prompt from the 4 fields
      let volledigePrompt = ''
      if (promptInput.rol.trim()) volledigePrompt += promptInput.rol.trim()
      if (promptInput.context.trim()) volledigePrompt += '\n\n' + promptInput.context.trim()
      if (promptInput.instructies.trim()) volledigePrompt += '\n\n' + promptInput.instructies.trim()
      if (promptInput.voorbeeld.trim()) volledigePrompt += '\n\n' + promptInput.voorbeeld.trim()
      volledigePrompt = volledigePrompt.trim()

      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: volledigePrompt,
          context: {
            niveau: niveau,
            leerjaar: leerjaar,
            currentModule: 'instrueren',
            moduleContext: 'De leerling test een zelfgeschreven prompt. Voer de instructies uit zoals gevraagd.',
            aiMode: 'doet'
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
                setStreamingContent(fullContent)
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      if (fullContent) {
        setTestResult(fullContent)
      }
    } catch (error) {
      console.error('Test error:', error)
      setTestResult('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setTestLoading(false)
      setStreamingContent('')
      setPhase('reflecting')
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Title ───────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">Bouw je prompt</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {role.emoji} {role.titel}
        </p>
      </div>

      {/* ── Phase 1: Prompt Builder fields ──────────────────────────────── */}
      <div className="space-y-4">
        {promptOnderdelen.map((onderdeel) => {
          const labels = getOnderdeelLabel(
            onderdeel,
            niveau as 'vmbo' | 'havo' | 'vwo' | 'mbo' | 'hbo'
          )
          const badgeColor = FIELD_BADGE_COLORS[onderdeel.id] || 'bg-gray-500'
          const fieldValue = promptInput[onderdeel.id as keyof PromptInput]

          return (
            <div
              key={onderdeel.id}
              ref={fieldRefs[onderdeel.id as keyof typeof fieldRefs]}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="p-4">
                {/* Label row */}
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold ${badgeColor}`}
                  >
                    {onderdeel.nummer}
                  </span>
                  <span className="font-medium text-gray-900">{onderdeel.titel}</span>
                  {!onderdeel.verplicht && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                      optioneel
                    </span>
                  )}
                </div>

                {/* Subtitle (the vraag) */}
                <p className="text-sm text-gray-500 mb-2 ml-8">{labels.vraag}</p>

                {/* Textarea */}
                <textarea
                  value={fieldValue}
                  onChange={(e) =>
                    handleInputChange(onderdeel.id as keyof PromptInput, e.target.value)
                  }
                  placeholder={labels.tip}
                  rows={onderdeel.id === 'voorbeeld' ? 4 : 3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none transition-all focus:border-purple-400 focus:ring-2 focus:ring-purple-100 hover:border-gray-300 outline-none"
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* ── "Vraag feedback" button ─────────────────────────────────────── */}
      <Button
        onClick={handleGetFeedback}
        disabled={!canRequestFeedback || feedbackLoading}
        className="w-full"
      >
        {feedbackLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <MessageSquare className="h-4 w-4 mr-2" />
        )}
        {feedbackLoading ? 'Feedback ophalen...' : 'Vraag feedback'}
      </Button>

      {/* ── Phase 2: Feedback card ──────────────────────────────────────── */}
      {feedbackItems && (phase === 'feedback' || phase === 'testing' || phase === 'reflecting') && (
        <div ref={feedbackRef} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Feedback op je prompt</h3>
          </div>

          <div className="p-4 space-y-3">
            {feedbackItems.map((item) => {
              const isGood = item.status === 'goed'
              const onderdeel = promptOnderdelen.find((o) => o.id === item.onderdeel)

              return (
                <div
                  key={item.onderdeel}
                  className={`flex items-start gap-3 text-sm p-3 rounded-lg transition-colors ${
                    isGood
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800 cursor-pointer hover:bg-red-100'
                  }`}
                  onClick={!isGood ? () => scrollToField(item.onderdeel) : undefined}
                  role={!isGood ? 'button' : undefined}
                  tabIndex={!isGood ? 0 : undefined}
                  onKeyDown={
                    !isGood
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            scrollToField(item.onderdeel)
                          }
                        }
                      : undefined
                  }
                >
                  {isGood ? (
                    <Check className="h-4 w-4 flex-shrink-0 mt-0.5 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-600" />
                  )}
                  <div>
                    <span className="font-medium">{onderdeel?.titel ?? item.onderdeel}:</span>{' '}
                    {item.feedback}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Action buttons below feedback */}
          <div className="p-4 border-t border-gray-100 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={scrollToTop}>
              <ArrowUp className="h-4 w-4 mr-2" />
              Prompt aanpassen
            </Button>
            <Button className="flex-1" onClick={handleTestPrompt}>
              <Play className="h-4 w-4 mr-2" />
              Prompt testen
            </Button>
          </div>
        </div>
      )}

      {/* ── Phase 3: Test Result ─────────────────────────────────────── */}
      {(phase === 'testing' || phase === 'reflecting') && (
        <div ref={testResultRef} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Resultaat</h3>
          </div>

          <div className="p-4 space-y-4">
            {/* The composed prompt */}
            <div>
              <span className="text-xs text-gray-400">(Je prompt)</span>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap mt-1">
                {[
                  promptInput.rol.trim(),
                  promptInput.context.trim(),
                  promptInput.instructies.trim(),
                  promptInput.voorbeeld.trim(),
                ]
                  .filter(Boolean)
                  .join('\n\n')}
              </div>
            </div>

            {/* The AI answer */}
            <div>
              <span className="text-xs text-gray-400">(AI-antwoord)</span>
              <div className="bg-white rounded-lg border p-4 mt-1">
                {testLoading && !streamingContent && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                )}
                {(streamingContent || testResult) && (
                  <div className="text-sm text-gray-900 whitespace-pre-wrap">
                    {formatMarkdownWithNewlines(testResult || streamingContent)}
                    {testLoading && streamingContent && (
                      <span className="inline-block w-1.5 h-4 bg-purple-500 animate-pulse ml-0.5 align-text-bottom" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Phase 4: Reflection ───────────────────────────────────────── */}
      {phase === 'reflecting' && testResult && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Kreeg je wat je verwachtte?</h3>

            {/* Choice buttons */}
            <div className="flex gap-3">
              {([
                { value: 'ja' as const, label: '\uD83D\uDC4D Ja' },
                { value: 'deels' as const, label: '\uD83E\uDD14 Deels' },
                { value: 'nee' as const, label: '\uD83D\uDC4E Nee' },
              ]).map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setReflectionAnswer(option.value)
                    if (option.value === 'ja') {
                      onComplete()
                    }
                  }}
                  className={`rounded-full px-4 py-2 text-sm border transition-all ${
                    reflectionAnswer === option.value
                      ? 'bg-purple-100 border-purple-500 text-purple-700 font-medium'
                      : 'bg-white border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Response text */}
            {reflectionAnswer === 'ja' && (
              <div className="bg-green-50 rounded-lg p-3 text-green-700 text-sm">
                Goed gedaan! Kies een andere rol om meer te oefenen, of ga verder.
              </div>
            )}
            {(reflectionAnswer === 'deels' || reflectionAnswer === 'nee') && (
              <div className="space-y-3">
                <div className="bg-amber-50 rounded-lg p-3 text-amber-700 text-sm">
                  Pas je prompt aan en probeer opnieuw.
                </div>
                <Button
                  variant="outline"
                  onClick={scrollToTop}
                  className="w-full"
                >
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Prompt aanpassen
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
