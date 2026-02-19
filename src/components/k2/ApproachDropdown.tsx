'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { aiHelptRollen, aiDoetRollen } from '@/lib/kiezen-content'

// ─── Types ───────────────────────────────────────────────────────────────────

export type StepApproach =
  | { type: 'zelf' }
  | {
      type: 'roles'
      roles: Array<{
        id: string
        category: 'aihelpt' | 'aidoet'
        name: string
        emoji: string
      }>
    }

interface ApproachDropdownProps {
  value: StepApproach | null
  onChange: (value: StepApproach | null) => void
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Truncate a label to roughly maxLen characters, adding "." if truncated */
function truncateLabel(text: string, maxLen: number = 10): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen - 1) + '.'
}

// ─── Static menu data ────────────────────────────────────────────────────────

interface RoleMenuItem {
  kind: 'role'
  id: string
  category: 'aihelpt' | 'aidoet'
  emoji: string
  name: string
}

interface ZelfMenuItem {
  kind: 'zelf'
}

type MenuItem = ZelfMenuItem | RoleMenuItem

const MENU_ITEMS: MenuItem[] = [
  { kind: 'zelf' },
  ...aiHelptRollen.map(
    (rol): RoleMenuItem => ({
      kind: 'role',
      id: rol.id,
      category: 'aihelpt',
      emoji: rol.emoji,
      name: rol.titel,
    })
  ),
  ...aiDoetRollen.map(
    (rol): RoleMenuItem => ({
      kind: 'role',
      id: rol.id,
      category: 'aidoet',
      emoji: rol.emoji,
      name: rol.titel,
    })
  ),
]

// Index where "AI doet het" roles start (after zelf + 4 aiHelpt)
const AI_DOET_START_INDEX = 1 + aiHelptRollen.length

// ─── Component ───────────────────────────────────────────────────────────────

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

  // ── Determine dropdown direction when opening ──

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

  // ── Selection helpers ──

  const isZelf = value !== null && value.type === 'zelf'

  const selectedRoles =
    value !== null && value.type === 'roles' ? value.roles : []

  const isRoleSelected = (id: string): boolean =>
    selectedRoles.some((r) => r.id === id)

  // ── Handlers ──

  const handleSelectZelf = useCallback(() => {
    onChange({ type: 'zelf' })
    onClose()
  }, [onChange, onClose])

  const handleToggleRole = useCallback(
    (role: RoleMenuItem) => {
      // If currently "zelf", start fresh with just this role
      if (value !== null && value.type === 'zelf') {
        onChange({
          type: 'roles',
          roles: [
            {
              id: role.id,
              category: role.category,
              name: role.name,
              emoji: role.emoji,
            },
          ],
        })
        return
      }

      const current = value !== null && value.type === 'roles' ? value.roles : []
      const alreadySelected = current.some((r) => r.id === role.id)

      if (alreadySelected) {
        // Remove this role
        const updated = current.filter((r) => r.id !== role.id)
        if (updated.length === 0) {
          onChange(null)
        } else {
          onChange({ type: 'roles', roles: updated })
        }
      } else {
        // Add this role
        onChange({
          type: 'roles',
          roles: [
            ...current,
            {
              id: role.id,
              category: role.category,
              name: role.name,
              emoji: role.emoji,
            },
          ],
        })
      }
      // Dropdown stays open for role toggles
    },
    [value, onChange]
  )

  // ── Close on click outside ──

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, onClose])

  // ── Keyboard navigation ──

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
            const next = prev < MENU_ITEMS.length - 1 ? prev + 1 : 0
            itemRefs.current[next]?.focus()
            return next
          })
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : MENU_ITEMS.length - 1
            itemRefs.current[next]?.focus()
            return next
          })
          break
        case 'Enter':
        case ' ':
          if (focusedIndex >= 0 && focusedIndex < MENU_ITEMS.length) {
            e.preventDefault()
            const item = MENU_ITEMS[focusedIndex]
            if (item.kind === 'zelf') {
              handleSelectZelf()
            } else {
              handleToggleRole(item)
            }
          }
          break
        case 'Tab':
          onClose()
          break
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, focusedIndex, onClose, handleSelectZelf, handleToggleRole])

  // ── Trigger label ──

  const renderTriggerContent = () => {
    if (value === null) {
      return 'Kies \u25BE'
    }
    if (value.type === 'zelf') {
      return '\u270B Zelf'
    }
    // roles
    const roles = value.roles
    if (roles.length === 1) {
      return `${roles[0].emoji} ${truncateLabel(roles[0].name)}`
    }
    // 2+ roles: only emojis
    return roles.map((r) => r.emoji).join(' ')
  }

  const triggerTitle =
    value !== null && value.type === 'roles' && value.roles.length >= 2
      ? value.roles.map((r) => r.name).join(', ')
      : undefined

  const hasSelection = value !== null

  // ── Item class builder ──

  const itemClass = (idx: number, isSelected: boolean) =>
    `w-full px-3 py-2 text-left text-sm hover:bg-purple-50 rounded-md cursor-pointer transition-colors flex items-center gap-2 ${
      isSelected ? 'bg-purple-50' : ''
    } ${focusedIndex === idx && !isSelected ? 'bg-gray-50' : ''}`

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={onToggle}
        title={triggerTitle}
        className={`rounded-full px-3 py-1 text-sm cursor-pointer transition-colors ${
          hasSelection
            ? 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
            : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
        }`}
      >
        {renderTriggerContent()}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`absolute right-0 z-50 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[220px] ${
            openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
          role="listbox"
          aria-multiselectable="true"
        >
          {/* ── Zelf doen ── index 0 */}
          <button
            ref={(el) => {
              itemRefs.current[0] = el
            }}
            type="button"
            onClick={handleSelectZelf}
            onMouseEnter={() => setFocusedIndex(0)}
            onMouseLeave={() => setFocusedIndex(-1)}
            className={itemClass(0, isZelf)}
            role="option"
            aria-selected={isZelf}
          >
            <span className="w-4 text-center text-xs">
              {isZelf ? '✓' : ''}
            </span>
            <span>✋</span>
            <span>Zelf doen</span>
          </button>

          {/* ── Samen met AI ── indices 1..4 */}
          <div className="text-xs uppercase text-gray-400 px-3 pt-3 pb-1 font-medium">
            Samen met AI
          </div>
          {aiHelptRollen.map((rol, i) => {
            const idx = 1 + i
            const item = MENU_ITEMS[idx] as RoleMenuItem
            const selected = isRoleSelected(rol.id)
            return (
              <button
                key={rol.id}
                ref={(el) => {
                  itemRefs.current[idx] = el
                }}
                type="button"
                onClick={() => handleToggleRole(item)}
                onMouseEnter={() => setFocusedIndex(idx)}
                onMouseLeave={() => setFocusedIndex(-1)}
                className={itemClass(idx, selected)}
                role="option"
                aria-selected={selected}
              >
                <span className="w-4 text-center text-xs">
                  {selected ? '✓' : ''}
                </span>
                <span>{rol.emoji}</span>
                <span>{rol.titel}</span>
              </button>
            )
          })}

          {/* ── AI doet het ── indices 5..8 */}
          <div className="text-xs uppercase text-gray-400 px-3 pt-3 pb-1 font-medium">
            AI doet het
          </div>
          {aiDoetRollen.map((rol, i) => {
            const idx = AI_DOET_START_INDEX + i
            const item = MENU_ITEMS[idx] as RoleMenuItem
            const selected = isRoleSelected(rol.id)
            return (
              <button
                key={rol.id}
                ref={(el) => {
                  itemRefs.current[idx] = el
                }}
                type="button"
                onClick={() => handleToggleRole(item)}
                onMouseEnter={() => setFocusedIndex(idx)}
                onMouseLeave={() => setFocusedIndex(-1)}
                className={itemClass(idx, selected)}
                role="option"
                aria-selected={selected}
              >
                <span className="w-4 text-center text-xs">
                  {selected ? '✓' : ''}
                </span>
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
