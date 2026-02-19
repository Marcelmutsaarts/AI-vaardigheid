'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, Loader2, ChevronUp } from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'
import ProgressStepper from '@/components/navigation/ProgressStepper'
import {
  categories,
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
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [selfClicked, setSelfClicked] = useState(false)
  const [activeRole, setActiveRole] = useState<string | null>(null)
  const [aiResponses, setAiResponses] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [showNextButton, setShowNextButton] = useState(false)

  // Progress state
  const [rolesState, setRolesState] = useState<K1RolesState>({ triedRoles: [], openedCategories: [] })
  const [isLoaded, setIsLoaded] = useState(false)

  // Refs for scroll targets
  const samenSectionRef = useRef<HTMLDivElement>(null!)
  const aidoetSectionRef = useRef<HTMLDivElement>(null!)
  const roleInteractionRef = useRef<HTMLDivElement>(null!)
  const responseRef = useRef<HTMLDivElement>(null!)
  const nextButtonRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
      return
    }
    const state = getK1RolesState()
    setRolesState(state)
    // Show next button immediately if already qualified
    if (canProceed(state.triedRoles)) {
      setShowNextButton(true)
    }
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

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(catId)) {
        next.delete(catId)
      } else {
        next.add(catId)
        markCategoryOpened(catId)
      }
      return next
    })

    // Reset active role when toggling
    setActiveRole(null)
    setApiError(null)

    // Scroll to the opened section
    setTimeout(() => {
      const ref = catId === 'samen' ? samenSectionRef : aidoetSectionRef
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 150)
  }

  const handleSelfClick = () => {
    setSelfClicked(true)
  }

  const handleRoleClick = (roleId: string) => {
    if (activeRole === roleId) {
      setActiveRole(null)
      setApiError(null)
    } else {
      setActiveRole(roleId)
      setApiError(null)

      // Scroll to role interaction after it renders
      setTimeout(() => {
        roleInteractionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 150)
    }
  }

  const handleTryRole = async (roleId: string, input: string) => {
    setIsLoading(true)
    setApiError(null)

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
      setAiResponses(prev => ({ ...prev, [roleId]: data.reply }))

      // Mark role as tried
      const newState = markRoleTried(roleId)
      setRolesState(newState)

      // Check if we should show the next button (with fade-in delay)
      if (canProceed(newState.triedRoles) && !showNextButton) {
        setTimeout(() => setShowNextButton(true), 300)
      }

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
            {categories.map((cat) => (
              <DrieluikCard
                key={cat.id}
                category={cat}
                isExpanded={expandedCategories.has(cat.id)}
                selfClicked={selfClicked}
                onSelfClick={handleSelfClick}
                onToggle={() => toggleCategory(cat.id)}
              />
            ))}
          </div>

          {/* Instructietekst */}
          {expandedCategories.size === 0 && !selfClicked && (
            <p className="text-sm text-gray-500 text-center mb-6 italic">
              Benieuwd wat AI voor je kan doen? Klik op een kaart en probeer het zelf.
            </p>
          )}

          {/* === FASE 2: Rollen per categorie === */}

          {/* Samen met AI rollen */}
          <div ref={samenSectionRef}>
            {expandedCategories.has('samen') && (
              <RolesSection
                categoryId="samen"
                introTekst={categories[1].introTekst!}
                roles={samenRollen}
                activeRole={activeRole}
                triedRoles={rolesState.triedRoles}
                aiResponses={aiResponses}
                isLoading={isLoading}
                apiError={apiError}
                niveauGroep={niveauGroep}
                onderwerpen={onderwerpen}
                voorbeeldTekst={voorbeeldTekst}
                roleInteractionRef={roleInteractionRef}
                responseRef={responseRef}
                onRoleClick={handleRoleClick}
                onTryRole={handleTryRole}
              />
            )}
          </div>

          {/* AI doet het rollen */}
          <div ref={aidoetSectionRef}>
            {expandedCategories.has('aidoet') && (
              <RolesSection
                categoryId="aidoet"
                introTekst={categories[2].introTekst!}
                roles={aiDoetRollen}
                activeRole={activeRole}
                triedRoles={rolesState.triedRoles}
                aiResponses={aiResponses}
                isLoading={isLoading}
                apiError={apiError}
                niveauGroep={niveauGroep}
                onderwerpen={onderwerpen}
                voorbeeldTekst={voorbeeldTekst}
                roleInteractionRef={roleInteractionRef}
                responseRef={responseRef}
                onRoleClick={handleRoleClick}
                onTryRole={handleTryRole}
              />
            )}
          </div>

          {/* Progress hint */}
          {hint && (
            <p className="text-sm text-primary text-center mb-4 font-medium animate-fadeIn">
              {hint}
            </p>
          )}

          {/* Volgende stap - hidden until requirements met */}
          {ready && showNextButton && (
            <div ref={nextButtonRef} className="animate-fadeIn">
              <Button onClick={handleComplete} size="lg" className="w-full">
                Volgende stap
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

// === DrieluikCard ===

function DrieluikCard({
  category,
  isExpanded,
  selfClicked,
  onSelfClick,
  onToggle,
}: {
  category: (typeof categories)[number]
  isExpanded: boolean
  selfClicked: boolean
  onSelfClick: () => void
  onToggle: () => void
}) {
  const isZelf = category.id === 'zelf'

  return (
    <button
      onClick={isZelf ? onSelfClick : onToggle}
      className={`
        rounded-xl border-2 p-5 text-center transition-all duration-200
        ${category.bgClass} ${category.hoverClass}
        ${isExpanded ? 'border-[#a15df5] ring-2 ring-[#a15df5]/20 shadow-md' : 'border-transparent shadow-sm'}
        ${isZelf && selfClicked ? 'border-gray-300' : ''}
        ${!isZelf ? 'hover:shadow-md hover:scale-[1.02]' : 'hover:shadow-sm'}
      `}
    >
      <span className="text-4xl mb-2 block">{category.emoji}</span>
      <h2 className="font-bold text-gray-900 text-lg">{category.titel}</h2>
      <p className="text-sm text-gray-500 mt-1">{category.subtitel}</p>
      {category.expandable && (
        <div className="flex justify-center mt-2">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-primary" />
          ) : (
            <span className="text-xs text-primary font-medium">Ontdek {'\u2192'}</span>
          )}
        </div>
      )}
      {isZelf && selfClicked && (
        <p className="text-xs text-gray-500 mt-2 animate-fadeIn">
          Soms is zelf doen de beste keuze!
        </p>
      )}
    </button>
  )
}

// === RolesSection ===

function RolesSection({
  categoryId,
  introTekst,
  roles,
  activeRole,
  triedRoles,
  aiResponses,
  isLoading,
  apiError,
  niveauGroep,
  onderwerpen,
  voorbeeldTekst,
  roleInteractionRef,
  responseRef,
  onRoleClick,
  onTryRole,
}: {
  categoryId: string
  introTekst: string
  roles: K1Role[]
  activeRole: string | null
  triedRoles: string[]
  aiResponses: Record<string, string>
  isLoading: boolean
  apiError: string | null
  niveauGroep: NiveauGroep
  onderwerpen: string[]
  voorbeeldTekst: string
  roleInteractionRef: React.RefObject<HTMLDivElement>
  responseRef: React.RefObject<HTMLDivElement>
  onRoleClick: (roleId: string) => void
  onTryRole: (roleId: string, input: string) => void
}) {
  const activeRoleInThisSection = roles.find(r => r.id === activeRole)

  return (
    <div className="mb-6 animate-slideDown">
      {/* Rollen container met categorie-intro */}
      <div className="bg-gray-50 rounded-xl p-4">
        {/* Categorie intro */}
        <p className="text-sm text-gray-700 font-medium mb-4">{introTekst}</p>

        {/* Rollen grid */}
        <div className="grid sm:grid-cols-2 gap-3">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              isActive={activeRole === role.id}
              isTried={triedRoles.includes(role.id)}
              onClick={() => onRoleClick(role.id)}
            />
          ))}
        </div>
      </div>

      {/* Active role interaction (outside container for visual separation) */}
      {activeRoleInThisSection && (
        <div ref={roleInteractionRef} className="mt-4">
          <RoleInteraction
            role={activeRoleInThisSection}
            niveauGroep={niveauGroep}
            onderwerpen={onderwerpen}
            voorbeeldTekst={voorbeeldTekst}
            aiResponse={aiResponses[activeRoleInThisSection.id] || null}
            isLoading={isLoading}
            apiError={apiError}
            responseRef={responseRef}
            onTry={(input) => onTryRole(activeRoleInThisSection.id, input)}
          />
        </div>
      )}
    </div>
  )
}

// === RoleCard ===

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
      className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 hover:shadow-md ${
        isTried ? 'bg-purple-50' : 'bg-white'
      } ${
        isActive
          ? 'border-[#a15df5] ring-1 ring-[#a15df5]/20 shadow-md'
          : 'border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{role.emoji}</span>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-gray-900">{role.titel}</span>
          <p className="text-xs text-gray-500 mt-0.5">{role.tagline}</p>
        </div>
      </div>
    </button>
  )
}

// === RoleInteraction ===

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
      <div className="bg-white rounded-xl border shadow-sm p-5 mb-4 animate-slideDown">
        {/* Mini-scenario */}
        <p className="text-sm text-gray-700 mb-4 font-medium">{role.miniScenario}</p>

        {/* Onderwerp knoppen */}
        <div className="flex flex-wrap gap-2 mb-4">
          {onderwerpen.map((onderwerp) => (
            <button
              key={onderwerp}
              onClick={() => onTry(onderwerp)}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          onRetry={() => {}}
        />
      </div>
    )
  }

  // Tekst-type
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 mb-4 animate-slideDown">
      {/* Mini-scenario */}
      <p className="text-sm text-gray-700 mb-4 font-medium">{role.miniScenario}</p>

      {/* Voorbeeldtekst in licht vlak */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed mb-4">
        {voorbeeldTekst}
      </div>

      {/* Probeer het knop */}
      <button
        onClick={() => onTry(voorbeeldTekst)}
        disabled={isLoading}
        className="px-6 py-2 rounded-lg bg-[#a15df5] text-white font-medium text-sm hover:bg-[#7947ba] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        Probeer het
      </button>

      <ResponseArea
        response={aiResponse}
        isLoading={isLoading}
        error={apiError}
        responseRef={responseRef}
        onRetry={() => onTry(voorbeeldTekst)}
      />
    </div>
  )
}

// === ResponseArea (chatballon styling) ===

function ResponseArea({
  response,
  isLoading,
  error,
  responseRef,
  onRetry,
}: {
  response: string | null
  isLoading: boolean
  error: string | null
  responseRef: React.RefObject<HTMLDivElement>
  onRetry: () => void
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
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <p>{error}</p>
          <button
            onClick={onRetry}
            className="mt-2 text-xs text-red-600 underline hover:text-red-800"
          >
            Opnieuw proberen
          </button>
        </div>
      )}
      {response && !isLoading && (
        <div className="relative bg-purple-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap animate-fadeIn">
          <span className="absolute -top-2 -left-1 text-lg">{'\u{1F916}'}</span>
          <div className="ml-1">{response}</div>
        </div>
      )}
    </div>
  )
}
