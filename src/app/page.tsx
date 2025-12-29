'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNiveau, SchoolType } from '@/contexts/NiveauContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArrowRight, BookOpen, MessageSquare, CheckCircle, Shield } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const { niveau, setNiveau } = useNiveau()
  const [selectedType, setSelectedType] = useState<SchoolType | null>(null)
  const [selectedJaar, setSelectedJaar] = useState<number | null>(null)

  // If user already has niveau set, redirect to dashboard
  if (niveau.schoolType && niveau.leerjaar) {
    router.push('/dashboard')
    return null
  }

  const getLeerjaarOptions = (type: SchoolType): number[] => {
    switch (type) {
      case 'vmbo':
        return [1, 2, 3, 4]
      case 'havo':
        return [1, 2, 3, 4, 5]
      case 'vwo':
        return [1, 2, 3, 4, 5, 6]
    }
  }

  const handleStart = () => {
    if (selectedType && selectedJaar) {
      setNiveau(selectedType, selectedJaar)
      router.push('/dashboard')
    }
  }

  const kiesItems = [
    {
      letter: 'K',
      title: 'Kiezen',
      description: 'Wanneer gebruik je AI?',
      icon: BookOpen,
      color: '#a15df5',
    },
    {
      letter: 'I',
      title: 'Instrueren',
      description: 'Hoe vraag je het goed?',
      icon: MessageSquare,
      color: '#9959ea',
    },
    {
      letter: 'E',
      title: 'Evalueren',
      description: 'Klopt wat AI zegt?',
      icon: CheckCircle,
      color: '#814bc6',
    },
    {
      letter: 'S',
      title: 'Spelregels',
      description: 'Wat mag en moet?',
      icon: Shield,
      color: '#7947ba',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-light/30 to-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Decorative dots */}
          <div className="absolute top-10 right-10 w-32 h-32 dot-pattern opacity-30" />
          <div className="absolute bottom-10 left-10 w-24 h-24 dot-pattern opacity-20" />

          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Word <span className="text-primary">AI-vaardig</span> met het KIES-framework
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-12">
                Leer hoe je slim en verantwoord met AI omgaat. Voor leerlingen in het voortgezet onderwijs.
              </p>

              {/* Niveau Selection */}
              <Card className="max-w-xl mx-auto">
                <CardContent className="p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Op welke school zit je?
                  </h2>

                  {/* School type selection */}
                  <div className="flex justify-center gap-4 mb-8">
                    {(['vmbo', 'havo', 'vwo'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedType(type)
                          setSelectedJaar(null)
                        }}
                        className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all ${
                          selectedType === type
                            ? 'bg-primary text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-primary-light'
                        }`}
                      >
                        {type.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {/* Leerjaar selection */}
                  {selectedType && (
                    <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                      <h3 className="text-lg font-medium text-gray-700 mb-4">
                        In welk leerjaar zit je?
                      </h3>
                      <div className="flex justify-center gap-3 flex-wrap">
                        {getLeerjaarOptions(selectedType).map((jaar) => (
                          <button
                            key={jaar}
                            onClick={() => setSelectedJaar(jaar)}
                            className={`w-12 h-12 rounded-lg font-semibold text-lg transition-all ${
                              selectedJaar === jaar
                                ? 'bg-primary text-white shadow-lg scale-105'
                                : 'bg-gray-100 text-gray-700 hover:bg-primary-light'
                            }`}
                          >
                            {jaar}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Start button */}
                  {selectedType && selectedJaar && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <Button
                        onClick={handleStart}
                        size="lg"
                        className="w-full"
                      >
                        Start met leren
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* KIES Explanation Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
              Wat is KIES?
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              KIES staat voor de vier vaardigheden die je nodig hebt om goed met AI om te gaan.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {kiesItems.map((item) => (
                <Card
                  key={item.letter}
                  className="relative overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{ backgroundColor: item.color }}
                  />
                  <CardContent className="p-6">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <span
                        className="text-2xl font-bold"
                        style={{ color: item.color }}
                      >
                        {item.letter}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-primary-light/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
                Wat kun je verwachten?
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Leermodules
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Korte, interactieve modules aangepast aan jouw niveau
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    AI-coach
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Een slimme coach die je helpt en feedback geeft
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Oefeningen
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Praktische oefeningen om je vaardigheden te trainen
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
