'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, User, Bot, CheckCircle2 } from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'
import { getMensAIMensTekst, aiValkuilen } from '@/lib/evalueren-content'

export default function E1Page() {
  const router = useRouter()
  const { niveau, updateProgress } = useNiveau()
  const [stapBekeken, setStapBekeken] = useState<Set<number>>(new Set())

  useEffect(() => {
    // MBO/HBO hebben geen leerjaar, VO niveaus wel
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
    }
  }, [niveau, router])

  // MBO/HBO hebben geen leerjaar, VO niveaus wel
  const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
  if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
    return null
  }

  const teksten = getMensAIMensTekst(niveau.schoolType)
  const alleBekekenStappen = stapBekeken.size >= 3

  const handleStapClick = (stap: number) => {
    setStapBekeken(prev => {
      const newSet = new Set(prev)
      newSet.add(stap)
      return newSet
    })
  }

  const handleComplete = () => {
    updateProgress('evalueren', 'e1', true)
    router.push('/leerpad/evalueren/e2')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Terug link */}
          <Link
            href="/leerpad/evalueren"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Evalueren
          </Link>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: kiesKleuren.evalueren }}
              >
                E1
              </div>
              <h1 className="text-xl font-bold text-gray-900">Mens-AI-Mens</h1>
            </div>
            <p className="text-gray-600">
              {teksten.intro}
            </p>
          </div>

          {/* Het Mens-AI-Mens schema */}
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-6">
              {/* Stap 1: Mens */}
              <button
                onClick={() => handleStapClick(1)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                  stapBekeken.has(1)
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-purple-50 border-2 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  stapBekeken.has(1) ? 'bg-green-500' : 'bg-purple-500'
                } text-white mb-1`}>
                  <User className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-gray-700">JIJ</span>
              </button>

              <ArrowRight className="h-5 w-5 text-gray-400" />

              {/* Stap 2: AI */}
              <button
                onClick={() => handleStapClick(2)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                  stapBekeken.has(2)
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-blue-50 border-2 border-blue-200 hover:bg-blue-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  stapBekeken.has(2) ? 'bg-green-500' : 'bg-blue-500'
                } text-white mb-1`}>
                  <Bot className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-gray-700">AI</span>
              </button>

              <ArrowRight className="h-5 w-5 text-gray-400" />

              {/* Stap 3: Mens */}
              <button
                onClick={() => handleStapClick(3)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                  stapBekeken.has(3)
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-purple-50 border-2 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  stapBekeken.has(3) ? 'bg-green-500' : 'bg-purple-500'
                } text-white mb-1`}>
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-gray-700">JIJ</span>
              </button>
            </div>

            {/* Uitleg per stap */}
            <div className="space-y-3">
              <div
                className={`p-3 rounded-lg transition-all ${
                  stapBekeken.has(1) ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-purple-600">1.</span>
                  <span className="text-sm font-medium text-gray-900">{teksten.stap1}</span>
                </div>
              </div>

              <div
                className={`p-3 rounded-lg transition-all ${
                  stapBekeken.has(2) ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-600">2.</span>
                  <span className="text-sm font-medium text-gray-900">{teksten.stap2}</span>
                </div>
              </div>

              <div
                className={`p-3 rounded-lg transition-all ${
                  stapBekeken.has(3) ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-purple-600">3.</span>
                  <span className="text-sm font-medium text-gray-900">{teksten.stap3}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Klik op de 3 stappen om verder te gaan
            </p>
          </div>

          {/* De drie valkuilen teaser */}
          {alleBekekenStappen && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Drie dingen waar AI mee worstelt:
              </h3>
              <div className="space-y-2">
                {aiValkuilen.map((valkuil) => (
                  <div key={valkuil.id} className="flex items-center gap-3">
                    <span className="text-xl">{valkuil.emoji}</span>
                    <div>
                      <span className="font-medium text-gray-900">{valkuil.titel}</span>
                      <span className="text-gray-500 text-sm"> - {valkuil.uitlegKort}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-amber-800 mt-3">
                In de volgende stap ga je deze valkuilen zelf herkennen!
              </p>
            </div>
          )}

          {/* Conclusie */}
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-purple-900 font-medium text-center">
              {teksten.conclusie}
            </p>
          </div>

          {/* Volgende stap */}
          <Button
            onClick={handleComplete}
            disabled={!alleBekekenStappen}
            size="lg"
            className="w-full"
          >
            {alleBekekenStappen ? (
              <>
                Naar de oefeningen
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            ) : (
              'Klik op alle 3 de stappen'
            )}
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
