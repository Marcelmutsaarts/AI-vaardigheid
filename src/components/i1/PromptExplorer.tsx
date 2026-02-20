'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check } from 'lucide-react'
import {
  promptParts,
  partColors,
  getIntroText,
  getPromptTexts,
  getPartExplanation,
  getHintText,
} from '@/lib/i1-prompt-data'

interface PromptExplorerProps {
  schoolType: string
  onComplete: () => void
}

const circledNumbers = ['①', '②', '③', '④']

export default function PromptExplorer({ schoolType, onComplete }: PromptExplorerProps) {
  const [discoveredParts, setDiscoveredParts] = useState<Set<string>>(new Set())
  const [activePart, setActivePart] = useState<string | null>(null)
  const [hoveredPart, setHoveredPart] = useState<string | null>(null)

  const introText = getIntroText(schoolType)
  const promptTexts = getPromptTexts(schoolType)
  const hintText = getHintText(schoolType)

  const allDiscovered = discoveredParts.size >= 4

  const handlePartClick = useCallback((partId: string) => {
    setDiscoveredParts(prev => {
      const newSet = new Set(prev)
      newSet.add(partId)
      return newSet
    })
    setActivePart(partId)
  }, [])

  const getPartClassName = (partId: string) => {
    const colors = partColors[partId as keyof typeof partColors]
    const isDiscovered = discoveredParts.has(partId)
    const isActive = activePart === partId
    const isHovered = hoveredPart === partId

    const base = 'cursor-pointer rounded-sm py-0.5 px-0.5 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-purple-400'

    if (isActive) {
      return `${base} ${colors.active} ring-1 ring-gray-300`
    }
    if (isDiscovered) {
      return `${base} ${colors.discovered}${isHovered ? ` ${colors.active}` : ''}`
    }
    if (isHovered) {
      return `${base} ${colors.hover}`
    }
    return base
  }

  // Discovered parts in discovery order for right column stacking
  const [discoveryOrder, setDiscoveryOrder] = useState<string[]>([])

  const handlePartClickWrapped = useCallback((partId: string) => {
    handlePartClick(partId)
    setDiscoveryOrder(prev => prev.includes(partId) ? prev : [...prev, partId])
  }, [handlePartClick])

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left column */}
      <div className="lg:w-1/2 space-y-4">
        {/* Intro text */}
        <p className="text-gray-600 text-sm">{introText}</p>

        {/* Prompt card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p
            className="text-gray-700 leading-[2.5]"
          >
            {promptParts.map((part) => {
              const isDiscovered = discoveredParts.has(part.id)
              const colors = partColors[part.id as keyof typeof partColors]

              return (
                <span key={part.id} className="relative">
                  {/* Floating label above the span when discovered */}
                  {isDiscovered && (
                    <span
                      className={`absolute -top-5 left-0 text-[10px] font-semibold ${colors.label} flex items-center gap-0.5 whitespace-nowrap pointer-events-none select-none`}
                    >
                      <Check className="h-2.5 w-2.5" />
                      {`${circledNumbers[part.nummer - 1]} ${part.titel}`}
                    </span>
                  )}
                  <span
                    className={getPartClassName(part.id)}
                    onMouseEnter={() => setHoveredPart(part.id)}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClickWrapped(part.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Prompt onderdeel: ${part.titel}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handlePartClickWrapped(part.id)
                      }
                    }}
                  >
                    {promptTexts[part.id]}
                  </span>
                </span>
              )
            })}
          </p>
        </div>

        {/* Progress + Verder button */}
        {!allDiscovered && discoveredParts.size > 0 && (
          <p className="text-xs text-gray-400 text-center">
            {discoveredParts.size} van 4 onderdelen ontdekt
          </p>
        )}
        <Button
          onClick={onComplete}
          disabled={!allDiscovered}
          size="lg"
          className="w-full"
        >
          {allDiscovered ? (
            <>
              Verder
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            'Ontdek alle 4 onderdelen'
          )}
        </Button>
      </div>

      {/* Right column — all discovered explanations stack */}
      <div className="lg:w-1/2 space-y-3" aria-live="polite">
        {discoveryOrder.length > 0 ? (
          discoveryOrder.map((partId) => {
            const partInfo = promptParts.find(p => p.id === partId)!
            const explanation = getPartExplanation(partId, schoolType)
            const colors = partColors[partId as keyof typeof partColors]
            const isActive = activePart === partId

            return (
              <div
                key={partId}
                className={`bg-white rounded-xl border p-5 w-full transition-all duration-200 ${
                  isActive ? 'border-gray-300 shadow-sm' : 'border-gray-100'
                }`}
                style={{ animation: 'i1FadeIn 0.2s ease-out' }}
              >
                <div className={`text-base font-bold ${colors.label} mb-0.5`}>
                  {circledNumbers[partInfo.nummer - 1]} {partInfo.titel}
                </div>
                <p className="text-gray-500 text-xs mb-1.5">{explanation.ondertitel}</p>
                <p className="text-gray-700 text-sm leading-relaxed">{explanation.uitleg}</p>
              </div>
            )
          })
        ) : (
          <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-8 w-full flex items-center justify-center min-h-[140px]">
            <p className="text-gray-400 text-sm text-center">{hintText}</p>
          </div>
        )}
      </div>

      {/* Keyframe animation for fade-in */}
      <style>{`
        @keyframes i1FadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
