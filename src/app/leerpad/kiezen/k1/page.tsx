'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, ChevronUp, MousePointerClick } from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'
import ProgressStepper from '@/components/navigation/ProgressStepper'
import { Markdown } from '@/components/ui/markdown'
import {
  categories,
  samenRollen,
  aiDoetRollen,
  onderwerpPerNiveau,
  voorbeeldTekstPerNiveau,
  getNiveauGroepVoorK1,
  getK1RolesState,
  markRoleTried,
  markCategoryOpened,
  canProceed,
  getProgressHint,
  type K1Role,
  type K1RolesState,
  type NiveauGroep,
} from '@/lib/k1-roles-data'
import { getStaticResponse, VOORBEELD_KEY } from '@/lib/k1-static-responses'

export default function K1Page() {
  const router = useRouter()
  const { niveau, updateProgress } = useNiveau()

  // UI state
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [selfClicked, setSelfClicked] = useState(false)
  const [activeRole, setActiveRole] = useState<string | null>(null)
  const [aiResponses, setAiResponses] = useState<Record<string, string>>({})

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
    if (expandedCategory === catId) {
      setExpandedCategory(null)
    } else {
      markCategoryOpened(catId)
      setExpandedCategory(catId)
    }

    setActiveRole(null)

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
    } else {
      setActiveRole(roleId)

      setTimeout(() => {
        roleInteractionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 150)
    }
  }

  const handleTryRole = (roleId: string, input: string) => {
    const role = samenRollen.find(r => r.id === roleId) ?? aiDoetRollen.find(r => r.id === roleId)
    const inputKey = role?.inputType === 'tekst' ? VOORBEELD_KEY : input

    const reply = getStaticResponse(niveauGroep, roleId, inputKey)
    setAiResponses(prev => ({ ...prev, [roleId]: reply }))

    const newState = markRoleTried(roleId)
    setRolesState(newState)

    setTimeout(() => {
      responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 50)
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
          <div className="mb-4">
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

          {/* Instructiebox */}
          <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3">
            <MousePointerClick className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-800 leading-relaxed">
              <p className="font-semibold mb-1">Hoe werkt het?</p>
              <p>
                Klik op een <span className="font-semibold">kaart</span> hieronder, kies een{' '}
                <span className="font-semibold">rol</span>, en probeer iets uit. Doe dat met
                minstens één rol uit <span className="font-semibold">Samen met AI</span> én één uit{' '}
                <span className="font-semibold">AI doet het</span>. Pas dan kun je verder.
              </p>
            </div>
          </div>

          {/* === FASE 1: Drieluik === */}
          <div className="grid sm:grid-cols-3 gap-3 mb-6">
            {categories.map((cat) => (
              <DrieluikCard
                key={cat.id}
                category={cat}
                isExpanded={expandedCategory === cat.id}
                selfClicked={selfClicked}
                onSelfClick={handleSelfClick}
                onToggle={() => toggleCategory(cat.id)}
              />
            ))}
          </div>

          {/* === FASE 2: Rollen per categorie === */}

          {/* Samen met AI rollen */}
          <div ref={samenSectionRef}>
            {expandedCategory === 'samen' && (
              <RolesSection
                categoryId="samen"
                introTekst={categories[1].introTekst!}
                roles={samenRollen}
                activeRole={activeRole}
                triedRoles={rolesState.triedRoles}
                aiResponses={aiResponses}
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
            {expandedCategory === 'aidoet' && (
              <RolesSection
                categoryId="aidoet"
                introTekst={categories[2].introTekst!}
                roles={aiDoetRollen}
                activeRole={activeRole}
                triedRoles={rolesState.triedRoles}
                aiResponses={aiResponses}
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
          {ready && (
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
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-700 font-medium mb-3">{introTekst}</p>
        <p className="text-xs text-gray-500 mb-4 italic">Klik op een rol om iets te proberen.</p>

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

      {activeRoleInThisSection && (
        <div ref={roleInteractionRef} className="mt-4">
          <RoleInteraction
            role={activeRoleInThisSection}
            niveauGroep={niveauGroep}
            onderwerpen={onderwerpen}
            voorbeeldTekst={voorbeeldTekst}
            aiResponse={aiResponses[activeRoleInThisSection.id] || null}
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
  responseRef,
  onTry,
}: {
  role: K1Role
  niveauGroep: NiveauGroep
  onderwerpen: string[]
  voorbeeldTekst: string
  aiResponse: string | null
  responseRef: React.RefObject<HTMLDivElement>
  onTry: (input: string) => void
}) {
  if (role.inputType === 'onderwerp') {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-5 mb-4 animate-slideDown">
        <p className="text-sm text-gray-700 mb-2 font-medium">{role.miniScenario}</p>
        <p className="text-xs text-gray-500 mb-4">Klik op een onderwerp om te zien wat AI doet:</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {onderwerpen.map((onderwerp) => (
            <button
              key={onderwerp}
              onClick={() => onTry(onderwerp)}
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors"
            >
              {onderwerp}
            </button>
          ))}
        </div>

        <ResponseArea response={aiResponse} responseRef={responseRef} />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 mb-4 animate-slideDown">
      <p className="text-sm text-gray-700 mb-4 font-medium">{role.miniScenario}</p>

      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed mb-4">
        {voorbeeldTekst}
      </div>

      <button
        onClick={() => onTry(voorbeeldTekst)}
        className="px-6 py-2 rounded-lg bg-[#a15df5] text-white font-medium text-sm hover:bg-[#7947ba] transition-colors mb-4"
      >
        Probeer het
      </button>

      <ResponseArea response={aiResponse} responseRef={responseRef} />
    </div>
  )
}

// === ResponseArea (chatballon styling) ===

function ResponseArea({
  response,
  responseRef,
}: {
  response: string | null
  responseRef: React.RefObject<HTMLDivElement>
}) {
  if (!response) return null

  return (
    <div ref={responseRef}>
      <div className="relative bg-purple-50 rounded-xl p-4 pl-5 text-sm text-gray-700 animate-fadeIn">
        <span className="absolute -top-2 -left-1 text-lg">{'\u{1F916}'}</span>
        <Markdown>{response}</Markdown>
      </div>
    </div>
  )
}
