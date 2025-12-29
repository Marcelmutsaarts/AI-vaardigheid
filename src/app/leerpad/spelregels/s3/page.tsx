'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Zap, Image as ImageIcon, Video, MessageSquare, CheckCircle2, Award, Home } from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'

type Antwoord = '10' | '100' | '1000' | null

const STORAGE_KEY = 'kies-s3-state'

// Niveau-aangepaste teksten
const niveauTeksten = {
  vmbo: {
    intro: 'Nog één ding. Je hoort veel verhalen over AI en het milieu. Sommige kloppen, andere niet. Laten we even kijken hoe het echt zit.',
    vraag: 'Hoeveel ChatGPT-vragen kun je stellen voor dezelfde stroom als 1 uur Netflix kijken?',
    uitleg: 'Verrast? Tekst-AI gebruikt best weinig stroom. Maar let op: plaatjes maken kost veel meer. En video\'s nog meer.',
    tip: 'Gebruik AI om te leren, niet alleen voor de lol. Dan is het de stroom waard.',
  },
  havo: {
    intro: 'Er wordt veel gezegd over AI en energieverbruik. Tijd om dat even te nuanceren - want niet alles wat je hoort klopt.',
    vraag: 'Hoeveel ChatGPT-prompts kosten evenveel energie als 1 uur Netflix streamen?',
    uitleg: 'Tekst-gebaseerde AI is relatief zuinig. Het verschil zit vooral in wat je ermee doet: afbeeldingen genereren kost tientallen keren meer energie dan een tekstvraag.',
    tip: 'Zet AI in waar het waarde toevoegt - voor leren en productiviteit. Niet voor eindeloos plaatjes genereren.',
  },
  vwo: {
    intro: 'Over AI en duurzaamheid circuleren nogal wat claims. De werkelijkheid is genuanceerder dan de koppen suggereren.',
    vraag: 'Hoeveel tekst-prompts aan een LLM verbruiken evenveel energie als één uur videostreaming?',
    uitleg: 'Large Language Models voor tekst zijn energetisch relatief efficiënt. De grote verschillen ontstaan bij multimodale modellen: beeldgeneratie verbruikt ~50x meer dan tekst, videogeneratie nog aanzienlijk meer.',
    tip: 'Bewust gebruik is de sleutel. AI inzetten voor leren en ontwikkeling is de energie waard - mindloos content genereren niet.',
  },
}

export default function S3Page() {
  const router = useRouter()
  const { niveau, updateProgress } = useNiveau()

  const [gekozenAntwoord, setGekozenAntwoord] = useState<Antwoord>(null)
  const [toonResultaat, setToonResultaat] = useState(false)
  const [toonAfronding, setToonAfronding] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!niveau.schoolType || !niveau.leerjaar) {
      router.push('/')
    }
  }, [niveau, router])

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.gekozenAntwoord) setGekozenAntwoord(data.gekozenAntwoord)
        if (data.toonResultaat) setToonResultaat(data.toonResultaat)
        if (data.toonAfronding) setToonAfronding(data.toonAfronding)
      } catch (e) {
        console.error('Error loading S3 state:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save state
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        gekozenAntwoord,
        toonResultaat,
        toonAfronding
      }))
    }
  }, [gekozenAntwoord, toonResultaat, toonAfronding, isLoaded])

  if (!niveau.schoolType || !niveau.leerjaar) {
    return null
  }

  // Bepaal niveau-teksten
  const teksten = niveau.schoolType === 'vmbo'
    ? niveauTeksten.vmbo
    : niveau.schoolType === 'havo'
      ? niveauTeksten.havo
      : niveauTeksten.vwo

  const handleKiesAntwoord = (antwoord: Antwoord) => {
    setGekozenAntwoord(antwoord)
  }

  const handleCheckAntwoord = () => {
    setToonResultaat(true)
  }

  const handleComplete = () => {
    updateProgress('spelregels', 's3', true)
    setToonAfronding(true)
  }

  const isCorrect = gekozenAntwoord === '100'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Terug link */}
          <Link
            href="/leerpad/spelregels/s2"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            S2: Wanneer meld je AI-gebruik?
          </Link>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: kiesKleuren.spelregels }}
              >
                S3
              </div>
              <h1 className="text-xl font-bold text-gray-900">AI en energie</h1>
            </div>
          </div>

          {!toonAfronding && (
            <>
              {/* Intro */}
              <div className="bg-white rounded-xl border shadow-sm p-5 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="text-sm text-gray-600 pt-2">
                    {teksten.intro}
                  </p>
                </div>

                {/* Quiz vraag */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="font-medium text-gray-900 mb-4">{teksten.vraag}</p>

                  <div className="grid grid-cols-3 gap-2">
                    {(['10', '100', '1000'] as const).map((optie) => (
                      <button
                        key={optie}
                        onClick={() => handleKiesAntwoord(optie)}
                        disabled={toonResultaat}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          gekozenAntwoord === optie
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${toonResultaat ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <span className="text-2xl font-bold text-gray-900">{optie}</span>
                        <span className="block text-xs text-gray-500">
                          {optie === '10' ? 'vragen' : optie === '100' ? 'vragen' : 'vragen'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Check knop */}
                {!toonResultaat && (
                  <Button
                    onClick={handleCheckAntwoord}
                    disabled={!gekozenAntwoord}
                    className="w-full"
                  >
                    Check mijn antwoord
                  </Button>
                )}

                {/* Resultaat */}
                {toonResultaat && (
                  <div className="space-y-4">
                    <div className={`rounded-lg p-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                      <p className="font-medium text-gray-900 mb-2">
                        {isCorrect ? 'Goed!' : 'Bijna!'} Het antwoord is ongeveer 100-200 vragen.
                      </p>
                      <p className="text-sm text-gray-600">
                        {teksten.uitleg}
                      </p>
                    </div>

                    {/* Vergelijking */}
                    <div className="bg-white border rounded-lg p-4">
                      <p className="text-xs font-medium text-gray-500 mb-3">Energieverbruik vergeleken:</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 text-green-500" />
                          <div className="flex-1">
                            <div className="h-2 bg-green-200 rounded-full" style={{ width: '10%' }} />
                          </div>
                          <span className="text-xs text-gray-600 w-24">Tekstvraag</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <ImageIcon className="h-5 w-5 text-amber-500" />
                          <div className="flex-1">
                            <div className="h-2 bg-amber-200 rounded-full" style={{ width: '50%' }} />
                          </div>
                          <span className="text-xs text-gray-600 w-24">Afbeelding</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Video className="h-5 w-5 text-red-500" />
                          <div className="flex-1">
                            <div className="h-2 bg-red-200 rounded-full" style={{ width: '90%' }} />
                          </div>
                          <span className="text-xs text-gray-600 w-24">Video</span>
                        </div>
                      </div>
                    </div>

                    {/* Tip */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <strong>Tip:</strong> {teksten.tip}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Afronden knop */}
              {toonResultaat && (
                <Button
                  onClick={handleComplete}
                  size="lg"
                  className="w-full"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Spelregels afronden
                </Button>
              )}
            </>
          )}

          {/* Afronding scherm */}
          {toonAfronding && (
            <div className="bg-white rounded-xl border shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Gefeliciteerd!
              </h2>
              <p className="text-gray-600 mb-6">
                Je hebt alle KIES-onderdelen doorlopen. Je weet nu hoe je slim, kritisch en eerlijk met AI omgaat.
              </p>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Wil je een overzicht?</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Download een handig overzicht van alles wat je hebt geleerd.
                      Je kunt je naam erop zetten als je wilt - je gegevens worden nergens opgeslagen.
                    </p>
                    <Button asChild size="sm">
                      <Link href="/diploma">
                        <Award className="h-4 w-4 mr-2" />
                        Naar overzicht
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">
                  <Home className="h-4 w-4 mr-2" />
                  Terug naar dashboard
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
