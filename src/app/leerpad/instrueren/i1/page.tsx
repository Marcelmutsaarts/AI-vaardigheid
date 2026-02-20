'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft } from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'
import ProgressStepper from '@/components/navigation/ProgressStepper'
import PromptExplorer from '@/components/i1/PromptExplorer'

export default function I1Page() {
  const router = useRouter()
  const { niveau, updateProgress } = useNiveau()

  useEffect(() => {
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
    }
  }, [niveau, router])

  const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
  if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
    return null
  }

  const handleComplete = () => {
    updateProgress('instrueren', 'i1', true)
    router.push('/leerpad/instrueren/i2')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <ProgressStepper activeLetter="instrueren" activeSubStep="i1" />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Terug link */}
          <Link
            href="/leerpad/instrueren"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Instrueren
          </Link>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: kiesKleuren.instrueren }}
              >
                I1
              </div>
              <h1 className="text-xl font-bold text-gray-900">Hoe bouw je een prompt?</h1>
            </div>
          </div>

          {/* PromptExplorer - interactieve twee-kolom layout */}
          <PromptExplorer
            schoolType={niveau.schoolType!}
            onComplete={handleComplete}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
