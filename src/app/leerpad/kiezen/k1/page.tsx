'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, Loader2, Check } from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'
import ProgressStepper from '@/components/navigation/ProgressStepper'
import {
  samenRollen,
  aiDoetRollen,
  onderwerpPerNiveau,
  voorbeeldTekstPerNiveau,
  getNiveauGroepVoorK1,
  buildRolePrompt,
  getK1RolesState,
  markRoleTried,
  markCategoryOpened,
  canProceed,
  getProgressHint,
  type K1Role,
  type K1RolesState,
  type NiveauGroep,
} from '@/lib/k1-roles-data'

export default function K1Page() {
  const router = useRouter()
  const { niveau, updateProgress } = useNiveau()

  // UI state
  const [expandedCategory, setExpandedCategory] = useState<'samen' | 'aidoet' | null>(null)
  const [selfClicked, setSelfClicked] = useState(false)
  const [activeRole, setActiveRole] = useState<string | null>(null)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  // Progress state
  const [rolesState, setRolesState] = useState<K1RolesState>({ triedRoles: [], openedCategories: [] })
  const [isLoaded, setIsLoaded] = useState(false)

  const rolesSectionRef = useRef<HTMLDivElement>(null)
  const responseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
      return
    }
    setRolesState(getK1RolesState())
    setIsLoaded(true)
  }, [niveau, router])

  const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
  if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
    return null
  }
  if (!isLoaded) return null

  const niveauGroep = getNiveauGroepVoorK1(niveau.schoolType)
  const onderwerpen = onderwerpPerNiveau[niveauGroep]
  const voorbeeldTekst = voorbeeldTekstPerNiveau[niveauGroep]

  const handleComplete = () => {
    updateProgress('kiezen', 'k1', true)
    router.push('/leerpad/kiezen/k1-complete')
  }

  const toggleCategory = (cat: 'samen' | 'aidoet') => {
    if (expandedCategory === cat) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(cat)
      const newState = markCategoryOpened(cat)
      setRolesState(newState)
    }
    // Reset active role and response when switching categories
    setActiveRole(null)
    setAiResponse(null)
    setApiError(null)

    // Scroll to roles section after a brief delay for animation
    setTimeout(() => {
      rolesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 100)
  }

  const handleSelfClick = () => {
    setSelfClicked(true)
    setExpandedCategory(null)
    setActiveRole(null)
    setAiResponse(null)
  }

  const handleRoleClick = (roleId: string) => {
    if (activeRole === roleId) {
      setActiveRole(null)
      setAiResponse(null)
      setApiError(null)
    } else {
      setActiveRole(roleId)
      setAiResponse(null)
      setApiError(null)
    }
  }

  const handleTryRole = async (roleId: string, input: string) => {
    setIsLoading(true)
    setApiError(null)
    setAiResponse(null)

    const prompt = buildRolePrompt(roleId, niveauGroep, input)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          context: {
            niveau: niveau.schoolType,
            leerjaar: niveau.leerjaar,
            currentModule: 'kiezen',
            aiMode: samenRollen.some(r => r.id === roleId) ? 'helpt' : 'doet',
            conversationHistory: [],
          },
        }),
      })

      if (!response.ok) {
        throw new Error('API error')
      }

      const data = await response.json()
      setAiResponse(data.reply)

      // Mark role as tried
      const newState = markRoleTried(roleId)
      setRolesState(newState)

      // Scroll to response
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 100)
    } catch {
      setApiError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setIsLoading(false)
    }
  }

  const ready = canProceed(rolesState.triedRoles)
  const hint = getProgressHint(rolesState.triedRoles)

  const currentRoles = expandedCategory === 'samen' ? samenRollen : expandedCategory === 'aidoet' ? aiDoetRollen : []

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <ProgressStepper activeLetter="kiezen" activeSubStep="k1" />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Terug link */}
          <Link
            href="/leerpad/kiezen"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kiezen
          </Link>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: kiesKleuren.kiezen }}
              >
                K1
              </div>
              <h1 className="text-xl font-bold text-gray-900">Drie manieren om AI te gebruiken</h1>
            </div>
            <p className="text-gray-600">
              Er zijn verschillende manieren om met AI samen te werken. Ontdek ze hieronder.
            </p>
          </div>

          {/* === FASE 1: Drieluik === */}
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            {/* Zelf */}
            <button
              onClick={handleSelfClick}
              className={`bg-white rounded-xl border-2 shadow-sm p-5 text-center transition-all hover:shadow-md ${
                selfClicked ? 'border-gray-400' : 'border-gray-200'
              }`}
            >
              <span className="text-4xl mb-2 block">✋</span>
              <h2 className="font-bold text-gray-900 text-lg">Zelf</h2>
              <p className="text-sm text-gray-500 mt-1">Jij doet het werk. Geen AI nodig.</p>
            </button>

            {/* Samen met AI */}
            <button
              onClick={() => toggleCategory('samen')}
              className={`bg-white rounded-xl border-2 shadow-sm p-5 text-center transition-all hover:shadow-md ${
                expandedCategory === 'samen' ? 'border-[#a15df5] ring-1 ring-[#a15df5]/20' : 'border-gray-200'
              }`}
            >
              <span className="text-4xl mb-2 block">🤝</span>
              <h2 className="font-bold text-gray-900 text-lg">Samen met AI</h2>
              <p className="text-sm text-gray-500 mt-1">AI helpt je denken, maar jij blijft aan het stuur.</p>
            </button>

            {/* AI doet het */}
            <button
              onClick={() => toggleCategory('aidoet')}
              className={`bg-white rounded-xl border-2 shadow-sm p-5 text-center transition-all hover:shadow-md ${
                expandedCategory === 'aidoet' ? 'border-[#a15df5] ring-1 ring-[#a15df5]/20' : 'border-gray-200'
              }`}
            >
              <span className="text-4xl mb-2 block">🤖</span>
              <h2 className="font-bold text-gray-900 text-lg">AI doet het</h2>
              <p className="text-sm text-gray-500 mt-1">AI levert het werk, jij checkt het resultaat.</p>
            </button>
          </div>

          {/* Inline bevestiging voor "Zelf" */}
          {selfClicked && !expandedCategory && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 text-center text-sm text-gray-600">
              Goed om te weten — soms is zelf doen de beste keuze!
            </div>
          )}

          {/* Instructietekst */}
          {!expandedCategory && !selfClicked && (
            <p className="text-sm text-gray-500 text-center mb-6">
              Klik op &lsquo;Samen met AI&rsquo; of &lsquo;AI doet het&rsquo; om te ontdekken welke rollen AI kan spelen.
            </p>
          )}

          {/* === FASE 2: Rollen === */}
          <div ref={rolesSectionRef}>
            {expandedCategory && (
              <div className="animate-in">
                {/* Categorie intro */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-700">
                    {expandedCategory === 'samen'
                      ? 'AI helpt je denken. Kies een rol en probeer het:'
                      : 'AI levert het werk. Kies een rol en probeer het:'}
                  </p>
                </div>

                {/* Rollen grid */}
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  {currentRoles.map((role) => (
                    <RoleCard
                      key={role.id}
                      role={role}
                      isActive={activeRole === role.id}
                      isTried={rolesState.triedRoles.includes(role.id)}
                      onClick={() => handleRoleClick(role.id)}
                    />
                  ))}
                </div>

                {/* Active role interaction */}
                {activeRole && (
                  <RoleInteraction
                    role={currentRoles.find(r => r.id === activeRole)!}
                    niveauGroep={niveauGroep}
                    onderwerpen={onderwerpen}
                    voorbeeldTekst={voorbeeldTekst}
                    aiResponse={aiResponse}
                    isLoading={isLoading}
                    apiError={apiError}
                    responseRef={responseRef}
                    onTry={(input) => handleTryRole(activeRole, input)}
                  />
                )}
              </div>
            )}
          </div>

          {/* Progress hint */}
          {hint && (
            <p className="text-sm text-primary text-center mb-4 font-medium">
              {hint}
            </p>
          )}

          {/* Volgende stap */}
          {ready && (
            <Button onClick={handleComplete} size="lg" className="w-full">
              Volgende stap
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </main>

      <Footer />

      {/* Animation styles */}
      <style jsx>{`
        .animate-in {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

// === Sub-componenten ===

function RoleCard({
  role,
  isActive,
  isTried,
  onClick,
}: {
  role: K1Role
  isActive: boolean
  isTried: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`relative bg-white rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${
        isActive
          ? 'border-[#a15df5] ring-1 ring-[#a15df5]/20'
          : 'border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{role.emoji}</span>
        <span className="font-semibold text-gray-900">{role.titel}</span>
        {isTried && (
          <span className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-3 h-3 text-green-600" />
          </span>
        )}
      </div>
    </button>
  )
}

function RoleInteraction({
  role,
  niveauGroep,
  onderwerpen,
  voorbeeldTekst,
  aiResponse,
  isLoading,
  apiError,
  responseRef,
  onTry,
}: {
  role: K1Role
  niveauGroep: NiveauGroep
  onderwerpen: string[]
  voorbeeldTekst: string
  aiResponse: string | null
  isLoading: boolean
  apiError: string | null
  responseRef: React.RefObject<HTMLDivElement>
  onTry: (input: string) => void
}) {
  if (role.inputType === 'onderwerp') {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-5 mb-4 animate-in">
        <p className="text-sm text-gray-600 mb-3">Kies een onderwerp:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {onderwerpen.map((onderwerp) => (
            <button
              key={onderwerp}
              onClick={() => onTry(onderwerp)}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              {onderwerp}
            </button>
          ))}
        </div>

        <ResponseArea
          response={aiResponse}
          isLoading={isLoading}
          error={apiError}
          responseRef={responseRef}
        />
      </div>
    )
  }

  // Tekst-type
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 mb-4 animate-in">
      <p className="text-sm text-gray-600 mb-3">Voorbeeldtekst:</p>
      <blockquote className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 italic border-l-3 border-gray-300 mb-4">
        {voorbeeldTekst}
      </blockquote>
      <button
        onClick={() => onTry(voorbeeldTekst)}
        disabled={isLoading}
        className="px-6 py-2 rounded-lg bg-[#a15df5] text-white font-medium text-sm hover:bg-[#7947ba] transition-colors disabled:opacity-50 mb-4"
      >
        Probeer het
      </button>

      <ResponseArea
        response={aiResponse}
        isLoading={isLoading}
        error={apiError}
        responseRef={responseRef}
      />
    </div>
  )
}

function ResponseArea({
  response,
  isLoading,
  error,
  responseRef,
}: {
  response: string | null
  isLoading: boolean
  error: string | null
  responseRef: React.RefObject<HTMLDivElement>
}) {
  if (!response && !isLoading && !error) return null

  return (
    <div ref={responseRef}>
      {isLoading && (
        <div className="flex items-center gap-2 text-gray-500 py-3">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">AI is bezig...</span>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {response && !isLoading && (
        <div className="bg-[#f8f5ff] rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {response}
        </div>
      )}
    </div>
  )
}
