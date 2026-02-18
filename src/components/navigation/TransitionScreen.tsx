'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ProgressStepper from './ProgressStepper'
import StepRoadmap, { type StepInfo } from './StepRoadmap'
import { cn } from '@/lib/utils'

type TransitionVariant = 'module-intro' | 'step-complete' | 'module-complete'

interface TransitionScreenProps {
  variant: TransitionVariant
  activeLetter: 'kiezen' | 'instrueren' | 'evalueren' | 'spelregels'
  heading: string
  subtext: string
  buttonLabel: string
  buttonHref: string
  steps: StepInfo[]
  completedSteps: string[]
  activeStepId?: string
  stepColor?: string
  dashboardHref?: string
}

export default function TransitionScreen({
  variant,
  activeLetter,
  heading,
  subtext,
  buttonLabel,
  buttonHref,
  steps,
  completedSteps,
  activeStepId,
  stepColor = '#a15df5',
  dashboardHref = '/dashboard',
}: TransitionScreenProps) {
  const router = useRouter()
  const isModuleComplete = variant === 'module-complete'

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f5ff]">
      {/* ProgressStepper bovenaan */}
      <ProgressStepper activeLetter={activeLetter} />

      {/* Gecentreerde content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center">
          {/* Mini-roadmap */}
          <div className="mb-8">
            <StepRoadmap
              steps={steps}
              completedSteps={completedSteps}
              activeStepId={activeStepId}
              color={stepColor}
            />
          </div>

          {/* Module-complete celebration */}
          {isModuleComplete && (
            <div className="mb-6 animate-scale-in">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white text-2xl"
                style={{ backgroundColor: stepColor }}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-3">
            {heading}
          </h1>

          {/* Subtext */}
          <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
            {subtext}
          </p>

          {/* Primary button */}
          <button
            onClick={() => router.push(buttonHref)}
            className={cn(
              'w-full py-3 px-8 rounded-xl font-semibold text-white transition-colors text-base',
              'hover:opacity-90'
            )}
            style={{ backgroundColor: stepColor }}
          >
            {buttonLabel}
          </button>

          {/* Dashboard link (alleen bij module-complete) */}
          {isModuleComplete && (
            <Link
              href={dashboardHref}
              className="inline-block mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Terug naar dashboard
            </Link>
          )}
        </div>
      </main>

      {/* CSS animation for module-complete */}
      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          60% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
