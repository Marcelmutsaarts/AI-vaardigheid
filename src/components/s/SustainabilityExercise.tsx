'use client'

import { useState, useEffect } from 'react'
import { useNiveau } from '@/contexts/NiveauContext'
import { Button } from '@/components/ui/button'
import { Zap, Image as ImageIcon, Video, MessageSquare } from 'lucide-react'

type Antwoord = '10' | '100' | '1000' | null

const STORAGE_KEY = 'kies-s3-state'

// Niveau-aangepaste teksten
const niveauTeksten = {
  vmbo: {
    intro: 'Nog \u00e9\u00e9n ding. Je hoort veel verhalen over AI en het milieu. Sommige kloppen, andere niet. Laten we even kijken hoe het echt zit.',
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
    intro: 'Je hoort veel beweringen over AI en energieverbruik. De werkelijkheid is genuanceerder dan de koppen suggereren.',
    vraag: 'Hoeveel tekst-vragen aan ChatGPT kosten evenveel energie als \u00e9\u00e9n uur videostreaming?',
    uitleg: 'AI-chatbots voor tekst zijn energetisch relatief effici\u00ebnt. De grote verschillen ontstaan bij andere AI-toepassingen: beeldgeneratie verbruikt ~50x meer dan tekst, videogeneratie nog aanzienlijk meer.',
    tip: 'Bewust gebruik is de sleutel. AI inzetten voor leren en ontwikkeling is de energie waard - mindloos content genereren niet.',
  },
  mbo: {
    intro: 'Op je werk of stage zul je AI gaan gebruiken. Goed om te weten hoeveel energie dat kost - want niet alles wat je hoort klopt.',
    vraag: 'Hoeveel ChatGPT-vragen kun je stellen voor dezelfde stroom als 1 uur Netflix kijken?',
    uitleg: 'Tekst-AI is best zuinig. Afbeeldingen genereren kost veel meer energie. En video\'s maken nog veel meer.',
    tip: 'Gebruik AI slim voor je werk en opleiding. Dat is de energie waard - eindeloos plaatjes genereren niet.',
  },
  hbo: {
    intro: 'AI wordt steeds belangrijker in je beroep. Er wordt veel gezegd over energieverbruik - tijd om dat te nuanceren.',
    vraag: 'Hoeveel tekst-vragen aan ChatGPT kosten evenveel energie als \u00e9\u00e9n uur Netflix streamen?',
    uitleg: 'Tekst-gebaseerde AI is energetisch effici\u00ebnt. De impact zit vooral bij beeldgeneratie (~50x meer) en videogeneratie (nog veel meer).',
    tip: 'Professioneel AI-gebruik voor productiviteit en ontwikkeling is de energie waard. Bewust omgaan met generatieve content is de sleutel.',
  },
}

interface SustainabilityExerciseProps {
  level: string
  onComplete: () => void
}

export default function SustainabilityExercise({ level, onComplete }: SustainabilityExerciseProps) {
  const { niveau } = useNiveau()

  const [gekozenAntwoord, setGekozenAntwoord] = useState<Antwoord>(null)
  const [toonResultaat, setToonResultaat] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.gekozenAntwoord) setGekozenAntwoord(data.gekozenAntwoord)
        if (data.toonResultaat) setToonResultaat(data.toonResultaat)
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
      }))
    }
  }, [gekozenAntwoord, toonResultaat, isLoaded])

  // Call onComplete when toonResultaat becomes true
  useEffect(() => {
    if (toonResultaat && isLoaded) {
      onComplete()
    }
  }, [toonResultaat, isLoaded, onComplete])

  // Bepaal niveau-teksten
  const teksten = niveau.schoolType === 'mbo'
    ? niveauTeksten.mbo
    : niveau.schoolType === 'hbo'
      ? niveauTeksten.hbo
      : niveau.schoolType === 'vmbo'
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

  const isCorrect = gekozenAntwoord === '100'

  return (
    <div>
      {/* Intro + Quiz */}
      <div className="bg-white rounded-xl border shadow-sm p-5">
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
                <span className="block text-xs text-gray-500">vragen</span>
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
    </div>
  )
}
