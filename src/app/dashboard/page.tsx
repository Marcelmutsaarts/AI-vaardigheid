'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau, Progress } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'

const kiesData = [
  {
    key: 'kiezen' as keyof Progress,
    letter: 'K',
    title: 'Kiezen',
    description: 'Wanneer gebruik je AI?',
    color: kiesKleuren.kiezen,
    href: '/leerpad/kiezen',
  },
  {
    key: 'instrueren' as keyof Progress,
    letter: 'I',
    title: 'Instrueren',
    description: 'Hoe vraag je het goed?',
    color: kiesKleuren.instrueren,
    href: '/leerpad/instrueren',
  },
  {
    key: 'evalueren' as keyof Progress,
    letter: 'E',
    title: 'Evalueren',
    description: 'Klopt wat AI zegt?',
    color: kiesKleuren.evalueren,
    href: '/leerpad/evalueren',
  },
  {
    key: 'spelregels' as keyof Progress,
    letter: 'S',
    title: 'Spelregels',
    description: 'Wat mag en moet?',
    color: kiesKleuren.spelregels,
    href: '/leerpad/spelregels',
  },
]

export default function Dashboard() {
  const router = useRouter()
  const { niveau, progress, getNiveauLabel } = useNiveau()

  useEffect(() => {
    if (!niveau.schoolType || !niveau.leerjaar) {
      router.push('/')
    }
  }, [niveau, router])

  if (!niveau.schoolType || !niveau.leerjaar) {
    return null
  }

  const isModuleComplete = (key: keyof Progress): boolean => {
    const modules = progress[key]
    return Object.values(modules).every(Boolean)
  }

  const getNextModule = (): { kiesLetter: string; href: string } | null => {
    for (const item of kiesData) {
      const modules = progress[item.key]
      for (const [moduleName, isCompleted] of Object.entries(modules)) {
        if (!isCompleted) {
          return {
            kiesLetter: item.title,
            href: `${item.href}/${moduleName}`,
          }
        }
      }
    }
    return null
  }

  const nextModule = getNextModule()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Welcome */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Welkom, {getNiveauLabel()}!
            </h1>
            <p className="text-gray-600">
              Leer slim omgaan met AI via het KIES-framework
            </p>
          </div>

          {/* KIES acroniem met verbindingen naar kaarten */}
          <div className="mb-8">
            {/* KIES letters dicht bij elkaar */}
            <div className="flex justify-center gap-1 md:gap-2 mb-2">
              {kiesData.map((item) => (
                <span
                  key={item.key}
                  className="text-4xl md:text-5xl font-black"
                  style={{ color: item.color }}
                >
                  {item.letter}
                </span>
              ))}
            </div>

            {/* Schuine verbindingslijnen - van letters naar kaarten */}
            <div className="flex justify-center mb-4">
              <svg viewBox="0 0 400 30" className="w-full max-w-2xl h-8">
                {kiesData.map((item, index) => {
                  // Letters staan dicht bij elkaar in het midden (rond x=200)
                  // Kaarten staan verspreid over de breedte
                  const letterSpacing = 25
                  const lettersStartX = 200 - (1.5 * letterSpacing)
                  const startX = lettersStartX + (index * letterSpacing)

                  // Kaarten zijn gelijk verdeeld over de breedte
                  const cardX = 50 + (index * 100)

                  return (
                    <line
                      key={item.key}
                      x1={startX}
                      y1="0"
                      x2={cardX}
                      y2="30"
                      stroke={item.color}
                      strokeWidth="2"
                    />
                  )
                })}
              </svg>
            </div>

            {/* Kaarten */}
            <div className="grid grid-cols-4 gap-2 md:gap-3">
              {kiesData.map((item) => {
                const isComplete = isModuleComplete(item.key)
                return (
                  <Link key={item.key} href={item.href} className="group">
                    <div className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-all w-full overflow-hidden ${isComplete ? 'ring-2 ring-green-500' : ''}`}>
                      <div className="h-1" style={{ backgroundColor: isComplete ? '#22c55e' : item.color }} />
                      <div className="p-2 md:p-4">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-xs md:text-base">
                            <span style={{ color: item.color }} className="font-bold">{item.letter}</span>
                            {item.title.slice(1)}
                          </h3>
                          {isComplete && (
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 hidden md:block">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Next Step - prominent call to action */}
          {nextModule ? (
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 text-center">
              <p className="text-gray-600 mb-3">Ga verder waar je gebleven was</p>
              <Button asChild size="lg">
                <Link href={nextModule.href}>
                  Volgende stap
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="bg-green-50 rounded-xl border border-green-200 p-6 mb-6 text-center">
              <p className="text-green-800 font-medium">Je hebt alle modules afgerond!</p>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
