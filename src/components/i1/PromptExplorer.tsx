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

    let classes = 'relative cursor-pointer rounded px-1 transition-colors duration-200 '

    if (isActive) {
      classes += colors.active
    } else if (isDiscovered) {
      classes += colors.discovered
      if (isHovered) {
        classes += ' brightness-95' // slightly darker on hover when discovered
      }
    } else if (isHovered) {
      classes += colors.hover
    }

    return classes
  }

  // Find the part info
  const activePartInfo = activePart ? promptParts.find(p => p.id === activePart) : null
  const activeExplanation = activePart ? getPartExplanation(activePart, schoolType) : null
  const activeColors = activePart ? partColors[activePart as keyof typeof partColors] : null

  // Unicode circled numbers
  const circledNumbers = ['①', '②', '③', '④']

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left column */}
      <div className="lg:w-1/2 space-y-4">
        {/* Intro text */}
        <p className="text-gray-600 text-sm">{introText}</p>

        {/* Prompt card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-gray-700 leading-relaxed pt-6">
            {promptParts.map((part) => {
              const isDiscovered = discoveredParts.has(part.id)

              return (
                <span key={part.id} className="relative inline">
                  {/* Label that appears above when discovered */}
                  {isDiscovered && (
                    <span
                      className={`absolute -top-6 left-0 text-xs font-medium ${partColors[part.id as keyof typeof partColors].label} flex items-center gap-1 whitespace-nowrap pointer-events-none`}
                    >
                      <Check className="h-3 w-3" />
                      {`${part.nummer}. ${part.titel}`}
                    </span>
                  )}
                  <span
                    className={getPartClassName(part.id)}
                    onMouseEnter={() => setHoveredPart(part.id)}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(part.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handlePartClick(part.id)
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

        {/* Verder button */}
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

      {/* Right column */}
      <div className="lg:w-1/2 flex items-start">
        {activePartInfo && activeExplanation && activeColors ? (
          <div
            key={activePart}
            className="bg-white rounded-xl border border-gray-200 p-6 w-full transition-opacity duration-200 opacity-100"
            style={{
              animation: 'fadeIn 0.2s ease-in-out',
            }}
          >
            <div className={`text-lg font-bold ${activeColors.label} mb-1`}>
              {circledNumbers[activePartInfo.nummer - 1]} {activePartInfo.titel}
            </div>
            <p className="text-gray-500 text-sm mb-3">{activeExplanation.ondertitel}</p>
            <p className="text-gray-700">{activeExplanation.uitleg}</p>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-6 w-full flex items-center justify-center min-h-[120px]">
            <p className="text-gray-400 text-sm text-center">{hintText}</p>
          </div>
        )}
      </div>

      {/* CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
