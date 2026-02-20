'use client'

import { Check } from 'lucide-react'
import { alleRollen } from '@/lib/instrueren-content'

interface RoleListProps {
  selectedRole: string | null
  completedRoles: Set<string>
  onSelectRole: (roleId: string) => void
}

const groups = [
  { label: 'AI helpt mij', emoji: '\u{1F91D}', roles: alleRollen.slice(0, 4) },
  { label: 'AI doet het', emoji: '\u{1F916}', roles: alleRollen.slice(4, 8) },
]

export default function RoleList({ selectedRole, completedRoles, onSelectRole }: RoleListProps) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.label}>
          {/* Group header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">{group.emoji}</span>
            <span className="text-sm text-gray-500 font-medium">{group.label}</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Roles */}
          <div className="flex flex-col gap-2">
            {group.roles.map((rol) => {
              const isSelected = selectedRole === rol.id
              const isCompleted = completedRoles.has(rol.id)

              return (
                <button
                  key={rol.id}
                  onClick={() => onSelectRole(rol.id)}
                  className={`
                    flex items-center gap-3 bg-white rounded-lg border p-3
                    cursor-pointer transition-all text-left w-full
                    ${isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                    }
                  `}
                >
                  <span className="text-xl flex-shrink-0">{rol.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm leading-tight">{rol.titel}</div>
                    <div className="text-xs text-gray-500 leading-tight mt-0.5">{rol.beschrijving}</div>
                  </div>
                  {isCompleted && (
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
