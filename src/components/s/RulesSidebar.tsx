'use client'

import { CheckCircle2 } from 'lucide-react'

export type SectionKey = 'privacy' | 'transparency' | 'sustainability'

interface RulesSidebarProps {
  level: string
  selectedSection: SectionKey | null
  completedSections: Set<string>
  onSelectSection: (section: SectionKey) => void
  onFinish: () => void
}

const SECTIONS: { key: SectionKey; emoji: string; title: string; subtitle: string }[] = [
  { key: 'privacy', emoji: '\u{1F512}', title: 'Privacy', subtitle: 'Wat stop je in AI?' },
  { key: 'transparency', emoji: '\u{1F50D}', title: 'Transparantie', subtitle: 'Wanneer meld je AI-gebruik?' },
  { key: 'sustainability', emoji: '\u{1F331}', title: 'Duurzaamheid', subtitle: 'Wat kost AI?' },
]

export default function RulesSidebar({
  level,
  selectedSection,
  completedSections,
  onSelectSection,
  onFinish,
}: RulesSidebarProps) {
  const allCompleted = completedSections.size === 3

  return (
    <div className="space-y-0">
      {/* 1. Visueel thema-blok */}
      <div className="bg-purple-50 rounded-xl p-4 mb-4 text-center">
        <div className="flex items-center justify-center gap-3 text-2xl">
          <span>{'\u{1F512}'}</span>
          <span>{'\u{1F50D}'}</span>
          <span>{'\u{1F331}'}</span>
        </div>
        <p className="text-sm text-purple-700 font-medium mt-2">
          Veilig &middot; Eerlijk &middot; Bewust
        </p>
      </div>

      {/* 2. Onderdelen sectie */}
      <div className="bg-white rounded-xl border shadow-sm p-4 mb-4">
        <span className="text-sm font-medium text-gray-700 block mb-3">
          Onderdelen
        </span>
        <div className="space-y-2">
          {SECTIONS.map((section) => {
            const isSelected = selectedSection === section.key
            const isCompleted = completedSections.has(section.key)

            return (
              <button
                key={section.key}
                onClick={() => onSelectSection(section.key)}
                className={`w-full text-left rounded-lg border p-3 transition-colors cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50'
                    : 'bg-white border-gray-200 hover:border-purple-300'
                }`}
              >
                <span className="text-lg flex-shrink-0">{section.emoji}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-900 block">
                    {section.title}
                  </span>
                  <span className="text-xs text-gray-500 block">
                    {section.subtitle}
                  </span>
                </div>
                {isCompleted && (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Verder-knop */}
      <button
        onClick={onFinish}
        disabled={!allCompleted}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium text-sm transition-colors ${
          allCompleted
            ? 'bg-purple-600 hover:bg-purple-700 cursor-pointer'
            : 'bg-purple-600 opacity-50 cursor-not-allowed'
        }`}
      >
        {allCompleted ? 'Module afronden \u2713' : 'Module afronden'}
      </button>
    </div>
  )
}
