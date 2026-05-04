'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'
import { getRolById } from '@/lib/instrueren-content'
import ProgressStepper from '@/components/navigation/ProgressStepper'
import RoleList from '@/components/i2/RoleList'
import PromptWorkspace from '@/components/i2/PromptWorkspace'

export default function I2Page() {
  const router = useRouter()
  const { niveau, updateProgress } = useNiveau()

  // ── State ─────────────────────────────────────────────────────────────────
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [completedRoles, setCompletedRoles] = useState<Set<string>>(new Set())
  const [isDirty, setIsDirty] = useState(false)
  const [showSwitchDialog, setShowSwitchDialog] = useState(false)
  const [pendingRoleId, setPendingRoleId] = useState<string | null>(null)

  // ── Niveau guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
    }
  }, [niveau, router])

  // ── Role switching with confirmation ──────────────────────────────────────
  const handleSelectRole = useCallback((roleId: string) => {
    if (roleId === selectedRoleId) return

    // If current role has unsaved work (isDirty), show confirmation
    if (selectedRoleId && isDirty) {
      setPendingRoleId(roleId)
      setShowSwitchDialog(true)
      return
    }

    setSelectedRoleId(roleId)
  }, [selectedRoleId, isDirty])

  // ── Role completion ───────────────────────────────────────────────────────
  const handleRoleComplete = useCallback(() => {
    if (selectedRoleId) {
      setCompletedRoles(prev => new Set(prev).add(selectedRoleId))
    }
  }, [selectedRoleId])

  // ── Dirty tracking ────────────────────────────────────────────────────────
  const handleDirtyChange = useCallback((dirty: boolean) => {
    setIsDirty(dirty)
  }, [])

  // ── Early return after all hooks ────────────────────────────────────────
  const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
  if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
    return null
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const selectedRole = selectedRoleId ? getRolById(selectedRoleId) : undefined

  const confirmSwitch = () => {
    if (pendingRoleId) {
      setSelectedRoleId(pendingRoleId)
      setPendingRoleId(null)
    }
    setShowSwitchDialog(false)
  }

  const cancelSwitch = () => {
    setPendingRoleId(null)
    setShowSwitchDialog(false)
  }

  // ── Complete ──────────────────────────────────────────────────────────────
  const handleComplete = () => {
    updateProgress('instrueren', 'i2', true)
    router.push('/leerpad/evalueren/intro')
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <ProgressStepper activeLetter="instrueren" activeSubStep="i2" />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back link */}
          <Link
            href="/leerpad/instrueren/i1"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Theorie
          </Link>

          {/* Page header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: kiesKleuren.instrueren }}
              >
                I2
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Oefenen met prompts</h1>
                <p className="text-sm text-gray-500">
                  Kies een rol en bouw een goede prompt
                </p>
              </div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left column -- sticky on desktop */}
            <div className="w-full lg:w-[35%] flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <RoleList
                  selectedRole={selectedRoleId}
                  completedRoles={completedRoles}
                  onSelectRole={handleSelectRole}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="flex-1 min-w-0">
              {selectedRoleId && selectedRole ? (
                <PromptWorkspace
                  role={selectedRole}
                  niveau={niveau.schoolType!}
                  leerjaar={niveau.leerjaar}
                  onComplete={handleRoleComplete}
                  onDirtyChange={handleDirtyChange}
                />
              ) : (
                <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-12 text-center">
                  <p className="text-gray-400">Kies een rol om te oefenen</p>
                </div>
              )}

              {/* Verder button */}
              <div className="mt-8">
                <Button
                  onClick={handleComplete}
                  disabled={completedRoles.size === 0}
                  className="w-full"
                  size="lg"
                >
                  Verder
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                {completedRoles.size === 0 && (
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Rond minimaal 1 rol af om verder te gaan
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Switch confirmation dialog */}
      {showSwitchDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Rol wisselen?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Je bent nog bezig. Als je wisselt, gaan je ingevulde velden verloren.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={cancelSwitch}>
                Annuleren
              </Button>
              <Button className="flex-1" onClick={confirmSwitch}>
                Wisselen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
