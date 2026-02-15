'use client'

import Link from 'next/link'
import { getModuleById, getNextModule } from '@/lib/learning-path'

interface NextStepCardProps {
  currentModuleId: string;
  isCompleted: boolean;
}

export function NextStepCard({ currentModuleId, isCompleted }: NextStepCardProps) {
  if (!isCompleted) return null

  const currentModule = getModuleById(currentModuleId)
  if (!currentModule) return null

  const nextModule = getNextModule(currentModuleId)

  // Detect letter transition (e.g. K2 -> I1)
  const isLetterTransition = nextModule ? nextModule.letter !== currentModule.letter : false

  // All modules completed (S3 has next: null)
  if (!nextModule) {
    return (
      <div
        data-testid="next-step-card"
        className="bg-white shadow-md rounded-xl p-4 border-l-4"
        style={{ borderLeftColor: '#10b981' }}
      >
        <p className="text-sm font-semibold mb-2" style={{ color: '#10b981' }}>
          &#10003; {currentModule.label} afgerond!
        </p>
        <p className="text-base font-bold text-gray-900 mb-1">
          Je hebt alle modules afgerond!
        </p>
        <p className="text-sm text-gray-600 mb-3">
          Gefeliciteerd! Je hebt het volledige KIES-leerpad doorlopen.
        </p>
        <Link
          href="/diploma"
          className="inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 outline-none"
          style={{ backgroundColor: '#10b981' }}
        >
          Bekijk je diploma &rarr;
        </Link>
      </div>
    )
  }

  return (
    <div
      data-testid="next-step-card"
      className="bg-white shadow-md rounded-xl p-4 border-l-4"
      style={{ borderLeftColor: '#10b981' }}
    >
      {/* Completion message */}
      <p className="text-sm font-semibold mb-2" style={{ color: '#10b981' }}>
        &#10003; {currentModule.label} afgerond!
      </p>

      {/* Letter transition hint */}
      {isLetterTransition && (
        <p className="text-xs text-gray-500 mb-2">
          Ga verder met {nextModule.letterLabel}
        </p>
      )}

      {/* Next module info */}
      <p className="text-sm text-gray-500 mb-1">Volgende stap:</p>
      <p className="text-base font-bold text-gray-900 mb-1">
        {nextModule.id.toUpperCase()}: {nextModule.label}
      </p>
      <p className="text-sm text-gray-600 mb-3">
        {nextModule.doel}
      </p>

      {/* Navigation button */}
      <Link
        href={nextModule.path}
        className="inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
        style={{ backgroundColor: '#10b981' }}
      >
        Ga naar {nextModule.label} &rarr;
      </Link>
    </div>
  )
}
