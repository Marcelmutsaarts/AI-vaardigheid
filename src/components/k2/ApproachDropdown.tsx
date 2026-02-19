'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
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

/** Build flat list of selectable items for keyboard navigation */
type MenuItem = { category: Aanpak; role?: string; emoji: string; label: string }

/** Static list of all selectable items (built once since role data is static) */
const MENU_ITEMS: MenuItem[] = [
  { category: 'zelf', emoji: '✋', label: 'Zelf doen' },
  ...aiHelptRollen.map((rol) => ({
    category: 'aihelpt' as Aanpak,
    role: rol.id,
    emoji: rol.emoji,
    label: rol.titel,
  })),
  ...aiDoetRollen.map((rol) => ({
    category: 'aidoet' as Aanpak,
    role: rol.id,
    emoji: rol.emoji,
    label: rol.titel,
  })),
]

export default function ApproachDropdown({
  value,
  onChange,
  isOpen,
  onToggle,
  onClose,
}: ApproachDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [openUpward, setOpenUpward] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const menuItems = MENU_ITEMS

  // Determine dropdown direction when opening
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setOpenUpward(spaceBelow < 300)
    }
    if (!isOpen) {
      setFocusedIndex(-1)
    }
  }, [isOpen])

  const handleSelect = useCallback(
    (category: Aanpak, role?: string) => {
      onChange({ category, role })
      onClose()
    },
    [onChange, onClose]
  )

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

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          onClose()
          break
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex((prev) => {
            const next = prev < menuItems.length - 1 ? prev + 1 : 0
            itemRefs.current[next]?.focus()
            return next
          })
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : menuItems.length - 1
            itemRefs.current[next]?.focus()
            return next
          })
          break
        case 'Enter':
          if (focusedIndex >= 0 && focusedIndex < menuItems.length) {
            e.preventDefault()
            const item = menuItems[focusedIndex]
            handleSelect(item.category, item.role)
          }
          break
        case 'Tab':
          onClose()
          break
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, focusedIndex, menuItems, onClose, handleSelect])

  const hasSelection = value !== null

  // Track which flat index we're at when rendering items
  let itemIndex = 0

  const itemClass = (idx: number) =>
    `w-full px-3 py-2 text-left text-sm hover:bg-purple-50 rounded-md cursor-pointer transition-colors flex items-center gap-2 ${
      focusedIndex === idx ? 'bg-purple-50' : ''
    }`

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
        <div
          className={`absolute right-0 z-50 bg-white rounded-xl shadow-lg border border-gray-200 py-2 px-1 min-w-[200px] ${
            openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
          role="listbox"
        >
          {/* Zelf doen */}
          {(() => {
            const idx = itemIndex++
            return (
              <button
                key="zelf"
                ref={(el) => { itemRefs.current[idx] = el }}
                type="button"
                onClick={() => handleSelect('zelf')}
                onMouseEnter={() => setFocusedIndex(idx)}
                onMouseLeave={() => setFocusedIndex(-1)}
                className={itemClass(idx)}
                role="option"
              >
                <span>✋</span>
                <span>Zelf doen</span>
              </button>
            )
          })()}

          {/* Samen met AI group */}
          <div className="px-2 pt-3 pb-1 text-xs uppercase text-gray-400 font-medium">
            Samen met AI
          </div>
          {aiHelptRollen.map((rol) => {
            const idx = itemIndex++
            return (
              <button
                key={rol.id}
                ref={(el) => { itemRefs.current[idx] = el }}
                type="button"
                onClick={() => handleSelect('aihelpt', rol.id)}
                onMouseEnter={() => setFocusedIndex(idx)}
                onMouseLeave={() => setFocusedIndex(-1)}
                className={itemClass(idx)}
                role="option"
              >
                <span>{rol.emoji}</span>
                <span>{rol.titel}</span>
              </button>
            )
          })}

          {/* AI doet het group */}
          <div className="px-2 pt-3 pb-1 text-xs uppercase text-gray-400 font-medium">
            AI doet het
          </div>
          {aiDoetRollen.map((rol) => {
            const idx = itemIndex++
            return (
              <button
                key={rol.id}
                ref={(el) => { itemRefs.current[idx] = el }}
                type="button"
                onClick={() => handleSelect('aidoet', rol.id)}
                onMouseEnter={() => setFocusedIndex(idx)}
                onMouseLeave={() => setFocusedIndex(-1)}
                className={itemClass(idx)}
                role="option"
              >
                <span>{rol.emoji}</span>
                <span>{rol.titel}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
