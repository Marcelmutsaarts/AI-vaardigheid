'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'

const eModules = [
  {
    id: 'e1',
    titel: 'Mens-AI-Mens',
    beschrijving: 'Waarom JIJ altijd de baas bent',
  },
  {
    id: 'e2',
    titel: 'Spot de valkuilen',
    beschrijving: 'Herken vooroordelen, verzinsels en ja-knikkers',
  },
]

export default function EvaluerenOverzicht() {
  const router = useRouter()
  const { niveau, progress } = useNiveau()

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

  const isCompleted = (moduleId: string) => {
    return progress.evalueren[moduleId as keyof typeof progress.evalueren] || false
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Terug link */}
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Dashboard
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4"
              style={{ backgroundColor: kiesKleuren.evalueren }}
            >
              E
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Evalueren</h1>
            <p className="text-gray-600">
              Leer AI-output kritisch beoordelen
            </p>
          </div>

          {/* Modules */}
          <div className="space-y-3 mb-8">
            {eModules.map((module, index) => {
              const completed = isCompleted(module.id)
              return (
                <Link key={module.id} href={`/leerpad/evalueren/${module.id}`}>
                  <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all p-4 flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0"
                      style={{ backgroundColor: completed ? '#22c55e' : kiesKleuren.evalueren }}
                    >
                      {completed ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{module.titel}</h3>
                      <p className="text-sm text-gray-500 truncate">{module.beschrijving}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Volgende stap button */}
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/leerpad/evalueren/e1">
                Start met leren
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
