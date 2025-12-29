'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Award } from 'lucide-react'
import { kiesKleuren, getNiveauCategorie, getPromptModel } from '@/lib/utils'

// Content per niveau voor Instrueren
const promptModelContent = {
  DWH: {
    naam: 'DWH-model',
    uitleg: 'Doel - Wie - Hoe',
    stappen: [
      { letter: 'D', titel: 'Doel', vraag: 'Wat wil je bereiken?' },
      { letter: 'W', titel: 'Wie', vraag: 'Voor wie is het?' },
      { letter: 'H', titel: 'Hoe', vraag: 'Hoe moet het eruit zien?' },
    ]
  },
  DWCH: {
    naam: 'DWCH-model',
    uitleg: 'Doel - Wie - Context - Hoe',
    stappen: [
      { letter: 'D', titel: 'Doel', vraag: 'Wat wil je bereiken?' },
      { letter: 'W', titel: 'Wie', vraag: 'Voor wie is het?' },
      { letter: 'C', titel: 'Context', vraag: 'Wat is de situatie?' },
      { letter: 'H', titel: 'Hoe', vraag: 'Hoe moet het eruit zien?' },
    ]
  },
  RDCFR: {
    naam: 'RDCFR-model',
    uitleg: 'Rol - Doel - Context - Format - Restricties',
    stappen: [
      { letter: 'R', titel: 'Rol', vraag: 'Welke rol heeft de AI?' },
      { letter: 'D', titel: 'Doel', vraag: 'Wat wil je bereiken?' },
      { letter: 'C', titel: 'Context', vraag: 'Wat is de achtergrond?' },
      { letter: 'F', titel: 'Format', vraag: 'Hoe moet het eruit zien?' },
      { letter: 'R', titel: 'Restricties', vraag: 'Wat mag niet?' },
    ]
  }
}

const vijfAanpakken = [
  { emoji: '✋', naam: 'Zelf doen', beschrijving: 'Zonder AI' },
  { emoji: '🧠', naam: 'Nadenken', beschrijving: 'AI helpt doordenken' },
  { emoji: '💡', naam: 'Op gang komen', beschrijving: 'AI geeft ideeën' },
  { emoji: '🎯', naam: 'Oefenen', beschrijving: 'AI helpt oefenen' },
  { emoji: '⚙️', naam: 'Uitbesteden', beschrijving: 'AI voert uit' },
]

const privacyChecklist = [
  'Deel geen persoonlijke gegevens (adres, telefoon, wachtwoorden)',
  'Deel geen informatie over anderen zonder toestemming',
  'Deel geen vertrouwelijke info (toetsantwoorden, geheimen)',
]

const transparantieTips = [
  'Schoolregels gaan altijd voor',
  'Hoe meer AI het werk doet, hoe belangrijker om te melden',
  'Vraag jezelf: zou de ander willen weten dat ik AI gebruikte?',
]

export default function DiplomaPage() {
  const router = useRouter()
  const { niveau } = useNiveau()
  const [naam, setNaam] = useState('')
  const diplomaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!niveau.schoolType || !niveau.leerjaar) {
      router.push('/')
    }
  }, [niveau, router])

  if (!niveau.schoolType || !niveau.leerjaar) {
    return null
  }

  const niveauCategorie = getNiveauCategorie(niveau.schoolType, niveau.leerjaar)
  const promptModel = niveauCategorie ? getPromptModel(niveauCategorie) : 'DWH'
  const promptContent = promptModelContent[promptModel]

  const niveauLabel = `${niveau.schoolType.toUpperCase()} ${niveau.leerjaar}`

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - hidden when printing */}
      <div className="print:hidden bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Terug naar dashboard
          </Link>
        </div>
      </div>

      {/* Intro section - hidden when printing */}
      <div className="print:hidden container mx-auto px-4 py-6 max-w-2xl">
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Je KIES overzicht</h1>
              <p className="text-sm text-gray-600">Download een overzicht van wat je hebt geleerd</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wil je je naam op het overzicht? (optioneel)
            </label>
            <input
              type="text"
              value={naam}
              onChange={(e) => setNaam(e.target.value)}
              placeholder="Je naam..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <p className="text-xs text-gray-500 mt-2">
              Je gegevens worden nergens opgeslagen. Dit is alleen voor op je overzicht.
            </p>
          </div>

          <Button onClick={handlePrint} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download / Print overzicht
          </Button>
        </div>
      </div>

      {/* Diploma - visible when printing */}
      <div
        ref={diplomaRef}
        className="container mx-auto px-4 py-6 max-w-2xl print:max-w-none print:px-8 print:py-4"
      >
        <div className="bg-white rounded-xl border shadow-sm print:shadow-none print:border-2 print:border-primary/30 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6 print:p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl print:text-xl font-bold">KIES Overzicht</h1>
                <p className="text-white/80 text-sm">AI-vaardigheden voor {niveauLabel}</p>
              </div>
              <div className="text-right">
                {naam && <p className="font-semibold">{naam}</p>}
                <p className="text-sm text-white/80">{new Date().toLocaleDateString('nl-NL')}</p>
              </div>
            </div>
          </div>

          <div className="p-6 print:p-4 space-y-5 print:space-y-3">
            {/* K - Kiezen */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: kiesKleuren.kiezen }}
                >
                  K
                </div>
                <h2 className="font-semibold text-gray-900">Kiezen: De 5 aanpakken</h2>
              </div>
              <div className="grid grid-cols-5 gap-1 text-center">
                {vijfAanpakken.map((a) => (
                  <div key={a.naam} className="bg-gray-50 rounded-lg p-2 print:p-1">
                    <div className="text-lg print:text-base">{a.emoji}</div>
                    <div className="text-xs font-medium text-gray-900">{a.naam}</div>
                    <div className="text-xs text-gray-500 print:text-[10px]">{a.beschrijving}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* I - Instrueren */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: kiesKleuren.instrueren }}
                >
                  I
                </div>
                <h2 className="font-semibold text-gray-900">Instrueren: {promptContent.naam}</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 print:p-2">
                <div className="flex flex-wrap gap-2">
                  {promptContent.stappen.map((s) => (
                    <div key={s.letter} className="flex items-center gap-1 bg-white rounded px-2 py-1 border">
                      <span className="font-bold text-primary text-sm">{s.letter}</span>
                      <span className="text-xs text-gray-600">{s.titel}: {s.vraag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* E - Evalueren */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: kiesKleuren.evalueren }}
                >
                  E
                </div>
                <h2 className="font-semibold text-gray-900">Evalueren: Mens-AI-Mens</h2>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-green-50 rounded-lg p-2 text-center border border-green-200">
                  <div className="text-lg">🧑</div>
                  <div className="text-xs font-medium text-gray-900">1. Begrijpen</div>
                  <div className="text-xs text-gray-500">Snap je het zelf?</div>
                </div>
                <div className="flex-1 bg-blue-50 rounded-lg p-2 text-center border border-blue-200">
                  <div className="text-lg">🤖</div>
                  <div className="text-xs font-medium text-gray-900">2. Checken</div>
                  <div className="text-xs text-gray-500">Klopt het?</div>
                </div>
                <div className="flex-1 bg-purple-50 rounded-lg p-2 text-center border border-purple-200">
                  <div className="text-lg">🧑</div>
                  <div className="text-xs font-medium text-gray-900">3. Verbeteren</div>
                  <div className="text-xs text-gray-500">Maak het af</div>
                </div>
              </div>
            </div>

            {/* S - Spelregels */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: kiesKleuren.spelregels }}
                >
                  S
                </div>
                <h2 className="font-semibold text-gray-900">Spelregels</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-2 print:grid-cols-2">
                <div className="bg-red-50 rounded-lg p-2 border border-red-200">
                  <p className="text-xs font-medium text-gray-900 mb-1">Privacy - Deel niet:</p>
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    {privacyChecklist.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-lg p-2 border border-amber-200">
                  <p className="text-xs font-medium text-gray-900 mb-1">Transparantie:</p>
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    {transparantieTips.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-2 border-t print:pt-1">
              <p className="text-xs text-gray-400">
                KIES Leeromgeving • aivoordocenten.nl
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
