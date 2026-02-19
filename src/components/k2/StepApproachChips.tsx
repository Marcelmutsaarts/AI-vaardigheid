'use client'

import { useRef, useEffect } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { Aanpak, aiHelptRollen, aiDoetRollen } from '@/lib/kiezen-content'

interface StepApproachChipsProps {
  stepNumber: number
  stepTitle: string
  aanpak: Aanpak | null
  rol?: string
  openDropdownId: string | null
  stepId: string
  onSelect: (aanpak: Aanpak, rol?: string) => void
  onReset: () => void
  onOpenDropdown: (id: string) => void
  onCloseDropdown: () => void
}

export default function StepApproachChips({
  stepNumber,
  stepTitle,
  aanpak,
  rol,
  openDropdownId,
  stepId,
  onSelect,
  onReset,
  onOpenDropdown,
  onCloseDropdown,
}: StepApproachChipsProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isDropdownOpen = openDropdownId === `${stepId}-aihelpt` || openDropdownId === `${stepId}-aidoet`
  const openType = openDropdownId === `${stepId}-aihelpt` ? 'aihelpt' : openDropdownId === `${stepId}-aidoet` ? 'aidoet' : null

  // Click outside to close dropdown
  useEffect(() => {
    if (!isDropdownOpen) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onCloseDropdown()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isDropdownOpen, onCloseDropdown])

  const getRolInfo = (aanpakType: 'aihelpt' | 'aidoet', rolId?: string) => {
    if (aanpakType === 'aihelpt' && rolId) return aiHelptRollen.find(r => r.id === rolId)
    if (aanpakType === 'aidoet' && rolId) return aiDoetRollen.find(r => r.id === rolId)
    return undefined
  }

  const hasRoleSelection = (aanpak === 'aihelpt' || aanpak === 'aidoet') && rol
  const rolInfo = hasRoleSelection ? getRolInfo(aanpak as 'aihelpt' | 'aidoet', rol) : undefined
  const rollen = openType === 'aihelpt' ? aiHelptRollen : openType === 'aidoet' ? aiDoetRollen : []

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      {/* Step header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
          {stepNumber}
        </span>
        <span className="font-medium text-gray-900 text-sm">{stepTitle}</span>
      </div>

      {/* Chips */}
      <div className="relative" ref={dropdownRef}>
        {hasRoleSelection && rolInfo ? (
          // Combined chip after role selection
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-sm font-medium">
              <span>{aanpak === 'aihelpt' ? '🤝' : '🤖'}</span>
              <span>{aanpak === 'aihelpt' ? 'Samen' : 'AI doet'}</span>
              <span className="text-purple-300 mx-0.5">→</span>
              <span>{rolInfo.emoji}</span>
              <span>{rolInfo.titel}</span>
            </div>
            <button
              onClick={onReset}
              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Aanpak resetten"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          // Three separate chips
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onSelect('zelf')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                aanpak === 'zelf'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✋ Zelf
            </button>
            <button
              onClick={() => {
                if (openDropdownId === `${stepId}-aihelpt`) {
                  onCloseDropdown()
                } else {
                  onOpenDropdown(`${stepId}-aihelpt`)
                }
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                aanpak === 'aihelpt'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : openDropdownId === `${stepId}-aihelpt`
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🤝 Samen
              <ChevronDown className="h-3 w-3" />
            </button>
            <button
              onClick={() => {
                if (openDropdownId === `${stepId}-aidoet`) {
                  onCloseDropdown()
                } else {
                  onOpenDropdown(`${stepId}-aidoet`)
                }
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                aanpak === 'aidoet'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : openDropdownId === `${stepId}-aidoet`
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🤖 AI doet
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Role dropdown */}
        {isDropdownOpen && (
          <div className="mt-2 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            {rollen.map((r, i) => (
              <button
                key={r.id}
                onClick={() => onSelect(openType as Aanpak, r.id)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  i < rollen.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <span className="text-lg">{r.emoji}</span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{r.titel}</div>
                  <div className="text-xs text-gray-500">{r.beschrijving}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
