'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Check, X, MessageSquare, Loader2, ArrowUp, Play } from 'lucide-react'
import { promptOnderdelen, getOnderdeelLabel } from '@/lib/instrueren-content'

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

  // ── Refs for scroll-to-field ───────────────────────────────────────────
  const fieldRefs = {
    rol: useRef<HTMLDivElement>(null),
    context: useRef<HTMLDivElement>(null),
    instructies: useRef<HTMLDivElement>(null),
    voorbeeld: useRef<HTMLDivElement>(null),
  }
  const feedbackRef = useRef<HTMLDivElement>(null)

  // ── Reset on role change ───────────────────────────────────────────────
  useEffect(() => {
    setPromptInput({ rol: '', context: '', instructies: '', voorbeeld: '' })
    setFeedbackItems(null)
    setFeedbackLoading(false)
    setPhase('building')
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

  // ── Handle "Prompt testen" (placeholder for Wave 3) ────────────────────
  const handleTestPrompt = () => {
    setPhase('testing')
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
      {feedbackItems && phase !== 'building' && (
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

      {/* ── Phase 3 placeholder (testing) — will be replaced in Wave 3 ── */}
      {phase === 'testing' && (
        <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
          <Play className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          Prompt testen wordt hier toegevoegd (Wave 3)
        </div>
      )}
    </div>
  )
}
