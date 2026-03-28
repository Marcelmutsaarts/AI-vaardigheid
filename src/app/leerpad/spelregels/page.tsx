'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft, ArrowRight, Award, CheckCircle2 } from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'
import ProgressStepper from '@/components/navigation/ProgressStepper'

const introTekst = 'Bekijk het plaatje goed en bespreek het samen met je docent.'

export default function SpelregelsPage() {
  const router = useRouter()
  const { niveau, progress, updateProgress } = useNiveau()
  const [isCompleted, setIsCompleted] = useState(false)

  // Niveau guard
  useEffect(() => {
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
    }
  }, [niveau, router])

  // Load initial progress
  useEffect(() => {
    const sp = progress.spelregels as Record<string, boolean>
    if (sp.s1 && sp.s2 && sp.s3) {
      setIsCompleted(true)
    }
  }, [progress])

  const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
  if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
    return null
  }

  const handleFinish = () => {
    // Mark all S substeps as completed
    updateProgress('spelregels', 's1', true)
    updateProgress('spelregels', 's2', true)
    updateProgress('spelregels', 's3', true)
    setIsCompleted(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <ProgressStepper activeLetter="spelregels" />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back link */}
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Dashboard
          </Link>

          {/* Page header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: kiesKleuren.spelregels }}
              >
                S
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Spelregels</h1>
                <p className="text-sm text-gray-500">Wat mag en moet bij AI-gebruik?</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">{introTekst}</p>
          </div>

          {/* Infographic */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-6">
            <Image
              src="/infographic-spelregels.png"
              alt="AI op school? Praat mee! Infographic over privacy, transparantie en duurzaamheid bij AI-gebruik"
              width={1200}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>

          {/* Afrondblok */}
          {!isCompleted ? (
            <div className="bg-white rounded-xl border shadow-sm p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Klaar met bespreken?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Rond de module af en bekijk je persoonlijke KIES-overzicht.
              </p>
              <button
                onClick={handleFinish}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: kiesKleuren.spelregels }}
              >
                Module afronden
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-900 mb-2">Module afgerond!</h3>
              <p className="text-sm text-green-700 mb-4">
                Je hebt alle vier de KIES-onderdelen doorlopen. Bekijk je overzicht of ga terug naar het dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/diploma"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-white font-medium transition-all hover:opacity-90"
                  style={{ backgroundColor: kiesKleuren.spelregels }}
                >
                  <Award className="h-4 w-4" />
                  Bekijk je KIES-overzicht
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                >
                  Terug naar dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
