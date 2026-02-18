'use client'

import React from 'react'
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
  onBeforeNavigate?: () => void
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
  onBeforeNavigate,
}: TransitionScreenProps) {
  const router = useRouter()
  const isModuleComplete = variant === 'module-complete'

  const handleNavigate = (href: string) => {
    onBeforeNavigate?.()
    router.push(href)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f5ff]">
      {/* ProgressStepper bovenaan */}
      <ProgressStepper activeLetter={activeLetter} />

      {/* Gecentreerde content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center fade-in">
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
            <div className="mb-6 scale-in">
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
            onClick={() => handleNavigate(buttonHref)}
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
            <button
              onClick={() => handleNavigate(dashboardHref)}
              className="inline-block mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Terug naar dashboard
            </button>
          )}
        </div>
      </main>

      {/* CSS animations */}
      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .scale-in {
          animation: scaleIn 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
        @keyframes scaleIn {
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
      `}</style>
    </div>
  )
}
