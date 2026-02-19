'use client'

import { useRef, useEffect, useCallback } from 'react'
import { Aanpak, aiHelptRollen, aiDoetRollen } from '@/lib/kiezen-content'

interface ApproachDropdownProps {
  value: { category: Aanpak; role?: string } | null
  onChange: (value: { category: Aanpak; role?: string }) => void
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

/** Truncate a label to roughly maxLen characters, adding "." if truncated */
function truncateLabel(text: string, maxLen: number = 10): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen - 1) + '.'
}

/** Get the display label (emoji + name) for the current selection */
function getSelectionLabel(value: { category: Aanpak; role?: string }): string {
  if (value.category === 'zelf') {
    return '✋ Zelf'
  }

  const rollen = value.category === 'aihelpt' ? aiHelptRollen : aiDoetRollen
  const rol = rollen.find((r) => r.id === value.role)

  if (rol) {
    return `${rol.emoji} ${truncateLabel(rol.titel)}`
  }

  // Fallback: category without role (shouldn't happen in normal flow)
  return value.category === 'aihelpt' ? '🤝 Samen' : '🤖 AI doet'
}

export default function ApproachDropdown({
  value,
  onChange,
  isOpen,
  onToggle,
  onClose,
}: ApproachDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, onClose])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const handleSelect = useCallback(
    (category: Aanpak, role?: string) => {
      onChange({ category, role })
      onClose()
    },
    [onChange, onClose]
  )

  const hasSelection = value !== null

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={onToggle}
        className={`rounded-full px-3 py-1 text-sm cursor-pointer transition-colors ${
          hasSelection
            ? 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
            : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
        }`}
      >
        {hasSelection ? getSelectionLabel(value) : 'Kies ▾'}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[200px]">
          {/* Zelf doen */}
          <button
            type="button"
            onClick={() => handleSelect('zelf')}
            className="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 cursor-pointer transition-colors flex items-center gap-2"
          >
            <span>✋</span>
            <span>Zelf doen</span>
          </button>

          {/* Samen met AI group */}
          <div className="px-3 pt-3 pb-1 text-xs uppercase text-gray-400 font-medium">
            Samen met AI
          </div>
          {aiHelptRollen.map((rol) => (
            <button
              key={rol.id}
              type="button"
              onClick={() => handleSelect('aihelpt', rol.id)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 cursor-pointer transition-colors flex items-center gap-2"
            >
              <span>{rol.emoji}</span>
              <span>{rol.titel}</span>
            </button>
          ))}

          {/* AI doet het group */}
          <div className="px-3 pt-3 pb-1 text-xs uppercase text-gray-400 font-medium">
            AI doet het
          </div>
          {aiDoetRollen.map((rol) => (
            <button
              key={rol.id}
              type="button"
              onClick={() => handleSelect('aidoet', rol.id)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 cursor-pointer transition-colors flex items-center gap-2"
            >
              <span>{rol.emoji}</span>
              <span>{rol.titel}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
