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

const kModules = [
  {
    id: 'k1',
    titel: 'Drie manieren',
    beschrijving: 'Zelf, samen met AI, of AI doet het',
  },
  {
    id: 'k2',
    titel: 'Oefenen',
    beschrijving: 'Pas je keuzes toe op een opdracht',
  },
]

export default function KiezenOverzicht() {
  const router = useRouter()
  const { niveau, progress } = useNiveau()

  useEffect(() => {
    if (!niveau.schoolType || !niveau.leerjaar) {
      router.push('/')
    }
  }, [niveau, router])

  if (!niveau.schoolType || !niveau.leerjaar) {
    return null
  }

  const isCompleted = (moduleId: string) => {
    return progress.kiezen[moduleId as keyof typeof progress.kiezen] || false
  }

  // Vind eerste niet-voltooide module
  const nextModule = kModules.find(m => !isCompleted(m.id)) || kModules[0]

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
              style={{ backgroundColor: kiesKleuren.kiezen }}
            >
              K
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Kiezen</h1>
            <p className="text-gray-600">
              Leer bewust kiezen wanneer en hoe je AI inzet
            </p>
          </div>

          {/* Modules */}
          <div className="space-y-3 mb-8">
            {kModules.map((module, index) => {
              const completed = isCompleted(module.id)
              return (
                <Link key={module.id} href={`/leerpad/kiezen/${module.id}`}>
                  <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all p-4 flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0"
                      style={{ backgroundColor: completed ? '#22c55e' : kiesKleuren.kiezen }}
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
              <Link href="/leerpad/kiezen/k1">
                Volgende stap
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
