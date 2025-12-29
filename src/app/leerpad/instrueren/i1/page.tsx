'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'
import { promptOnderdelen, getOnderdeelLabel } from '@/lib/instrueren-content'

// Voorbeeld prompt opgesplitst in onderdelen
const voorbeeldPrompt = {
  rol: 'Je bent een vriendelijke docent Nederlands die goed kan uitleggen.',
  context: 'Ik zit in 3 havo en werk aan een betoog over social media. Het moet 500 woorden zijn en ik moet minstens 2 bronnen gebruiken.',
  instructies: 'Geef me feedback op mijn inleiding. Let vooral op: is de stelling duidelijk? Trek ik de aandacht van de lezer? Geef 3 concrete tips om het te verbeteren.',
  voorbeeld: 'Geef je feedback in dit format:\n- Wat gaat goed: ...\n- Tip 1: ...\n- Tip 2: ...\n- Tip 3: ...',
}

export default function I1Page() {
  const router = useRouter()
  const { niveau, updateProgress } = useNiveau()
  const [expandedOnderdeel, setExpandedOnderdeel] = useState<string | null>(null)
  const [bekendeOnderdelen, setBekendeOnderdelen] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!niveau.schoolType || !niveau.leerjaar) {
      router.push('/')
    }
  }, [niveau, router])

  if (!niveau.schoolType || !niveau.leerjaar) {
    return null
  }

  const handleToggleOnderdeel = (id: string) => {
    if (expandedOnderdeel === id) {
      setExpandedOnderdeel(null)
    } else {
      setExpandedOnderdeel(id)
      // Markeer als bekeken
      setBekendeOnderdelen(prev => new Set([...prev, id]))
    }
  }

  const handleComplete = () => {
    updateProgress('instrueren', 'i1', true)
    router.push('/leerpad/instrueren/i2')
  }

  // Check of alle verplichte onderdelen zijn bekeken
  const verplichtBekeken = promptOnderdelen
    .filter(o => o.verplicht)
    .every(o => bekendeOnderdelen.has(o.id))

  const getVoorbeeldTekst = (id: string) => {
    return voorbeeldPrompt[id as keyof typeof voorbeeldPrompt] || ''
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
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
            <p className="text-gray-600">
              Een goede prompt heeft 4 onderdelen. Klik op elk onderdeel om te leren wat het is.
            </p>
          </div>

          {/* Intro card */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-purple-900">
                  <strong>Waarom is dit belangrijk?</strong><br />
                  Hoe beter je prompt, hoe beter het antwoord.
                  Een vage vraag geeft een vaag antwoord. Een specifieke vraag geeft een specifiek antwoord.
                </p>
              </div>
            </div>
          </div>

          {/* De 4 onderdelen */}
          <div className="space-y-3 mb-6">
            {promptOnderdelen.map((onderdeel) => {
              const isExpanded = expandedOnderdeel === onderdeel.id
              const isBekend = bekendeOnderdelen.has(onderdeel.id)
              const labels = getOnderdeelLabel(onderdeel, niveau.schoolType!)

              return (
                <div
                  key={onderdeel.id}
                  className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                    isBekend ? 'border-green-200' : ''
                  }`}
                >
                  <button
                    onClick={() => handleToggleOnderdeel(onderdeel.id)}
                    className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                        isBekend ? 'bg-green-500' : ''
                      }`}
                      style={{ backgroundColor: isBekend ? undefined : kiesKleuren.instrueren }}
                    >
                      {onderdeel.nummer}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{onderdeel.titel}</h3>
                        {!onderdeel.verplicht && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                            optioneel
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{labels.vraag}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t bg-gray-50">
                      <div className="pt-4 space-y-3">
                        {/* Uitleg */}
                        <p className="text-sm text-gray-700">{onderdeel.uitleg}</p>

                        {/* Voorbeeld */}
                        <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
                          <p className="text-sm text-purple-900 font-mono whitespace-pre-wrap">
                            {getVoorbeeldTekst(onderdeel.id)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Complete prompt voorbeeld */}
          <div className="bg-white rounded-xl border shadow-sm p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">De complete prompt</h3>
            <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-gray-100 whitespace-pre-wrap">
              <span className="text-purple-400">{voorbeeldPrompt.rol}</span>
              {'\n\n'}
              <span className="text-blue-400">{voorbeeldPrompt.context}</span>
              {'\n\n'}
              <span className="text-green-400">{voorbeeldPrompt.instructies}</span>
              {'\n\n'}
              <span className="text-yellow-400">{voorbeeldPrompt.voorbeeld}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">1. Rol</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">2. Context</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">3. Instructies</span>
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">4. Voorbeeld</span>
            </div>
          </div>

          {/* Volgende stap */}
          <Button
            onClick={handleComplete}
            disabled={!verplichtBekeken}
            size="lg"
            className="w-full"
          >
            {verplichtBekeken ? (
              <>
                Nu zelf oefenen
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            ) : (
              'Bekijk eerst alle onderdelen'
            )}
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
