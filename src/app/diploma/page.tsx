'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Award } from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'

// K - Kiezen: 3 aanpakken
const drieAanpakken = [
  { emoji: '👤', naam: 'Zelf', beschrijving: 'Zonder AI' },
  { emoji: '🤝', naam: 'AI helpt', beschrijving: 'AI ondersteunt mij' },
  { emoji: '🤖', naam: 'AI doet', beschrijving: 'AI maakt, ik check' },
]

// K - Kiezen: 8 AI-rollen
const aiRollen = {
  helpt: [
    { emoji: '🎓', naam: 'Uitlegger' },
    { emoji: '💡', naam: 'Brainstormer' },
    { emoji: '💬', naam: 'Feedbacker' },
    { emoji: '🎭', naam: 'Oefenmaatje' },
  ],
  doet: [
    { emoji: '✍️', naam: 'Schrijver' },
    { emoji: '🌍', naam: 'Vertaler' },
    { emoji: '✨', naam: 'Verbeteraar' },
    { emoji: '📋', naam: 'Samenvatter' },
  ]
}

// I - Instrueren: 4 prompt onderdelen
const promptOnderdelen = [
  { nummer: 1, titel: 'Rol', vraag: 'Wie is de AI?', verplicht: true },
  { nummer: 2, titel: 'Context', vraag: 'Wat is de situatie?', verplicht: true },
  { nummer: 3, titel: 'Instructies', vraag: 'Wat moet AI doen?', verplicht: true },
  { nummer: 4, titel: 'Voorbeeld', vraag: 'Hoe moet het eruit zien?', verplicht: false },
]

// E - Evalueren: valkuilen
const aiValkuilen = [
  { emoji: '🎭', naam: 'Vooroordelen', tip: 'Maakt AI aannames over mensen?' },
  { emoji: '🌀', naam: 'Verzinsels', tip: 'Check feiten bij betrouwbare bron' },
  { emoji: '😊', naam: 'Ja-knikken', tip: 'AI is het snel met je eens' },
]

// S - Spelregels
const privacyChecklist = [
  'Geen persoonlijke gegevens (adres, wachtwoorden)',
  'Geen info over anderen zonder toestemming',
  'Geen vertrouwelijke info (toetsantwoorden)',
]

const transparantieTips = [
  'Schoolregels gaan altijd voor',
  'Hoe meer AI doet, hoe meer melden',
]

export default function DiplomaPage() {
  const router = useRouter()
  const { niveau } = useNiveau()
  const [naam, setNaam] = useState('')
  const diplomaRef = useRef<HTMLDivElement>(null)

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

  const niveauLabel = niveau.leerjaar
    ? `${niveau.schoolType.toUpperCase()} ${niveau.leerjaar}`
    : niveau.schoolType.toUpperCase()

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

          <div className="p-6 print:p-4 space-y-4 print:space-y-3">
            {/* K - Kiezen */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: kiesKleuren.kiezen }}
                >
                  K
                </div>
                <h2 className="font-semibold text-gray-900">Kiezen: Wanneer gebruik je AI?</h2>
              </div>
              {/* 3 aanpakken */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                {drieAanpakken.map((a) => (
                  <div key={a.naam} className="bg-gray-50 rounded-lg p-2 print:p-1 text-center">
                    <div className="text-lg print:text-base">{a.emoji}</div>
                    <div className="text-xs font-medium text-gray-900">{a.naam}</div>
                    <div className="text-[10px] text-gray-500">{a.beschrijving}</div>
                  </div>
                ))}
              </div>
              {/* 8 AI-rollen */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
                  <p className="text-[10px] font-medium text-blue-800 mb-1">🤝 AI helpt mij:</p>
                  <div className="flex flex-wrap gap-1">
                    {aiRollen.helpt.map((r) => (
                      <span key={r.naam} className="text-[10px] bg-white rounded px-1.5 py-0.5 border">
                        {r.emoji} {r.naam}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-2 border border-purple-100">
                  <p className="text-[10px] font-medium text-purple-800 mb-1">🤖 AI doet het:</p>
                  <div className="flex flex-wrap gap-1">
                    {aiRollen.doet.map((r) => (
                      <span key={r.naam} className="text-[10px] bg-white rounded px-1.5 py-0.5 border">
                        {r.emoji} {r.naam}
                      </span>
                    ))}
                  </div>
                </div>
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
                <h2 className="font-semibold text-gray-900">Instrueren: Hoe vraag je het?</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="grid grid-cols-4 gap-1">
                  {promptOnderdelen.map((o) => (
                    <div key={o.nummer} className="bg-white rounded p-1.5 border text-center">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold mb-0.5">
                        {o.nummer}
                      </span>
                      <div className="text-xs font-medium text-gray-900">{o.titel}</div>
                      <div className="text-[10px] text-gray-500">{o.vraag}</div>
                      {!o.verplicht && <div className="text-[9px] text-gray-400">(optioneel)</div>}
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
                <h2 className="font-semibold text-gray-900">Evalueren: Klopt het?</h2>
              </div>
              {/* Mens-AI-Mens */}
              <div className="flex gap-1 mb-2">
                <div className="flex-1 bg-green-50 rounded-lg p-1.5 text-center border border-green-200">
                  <div className="text-base">🧑</div>
                  <div className="text-[10px] font-medium text-gray-900">1. Begrijpen</div>
                </div>
                <div className="flex-1 bg-blue-50 rounded-lg p-1.5 text-center border border-blue-200">
                  <div className="text-base">🤖</div>
                  <div className="text-[10px] font-medium text-gray-900">2. Checken</div>
                </div>
                <div className="flex-1 bg-purple-50 rounded-lg p-1.5 text-center border border-purple-200">
                  <div className="text-base">🧑</div>
                  <div className="text-[10px] font-medium text-gray-900">3. Aanpassen</div>
                </div>
              </div>
              {/* Valkuilen */}
              <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
                <p className="text-[10px] font-medium text-amber-800 mb-1">Let op deze valkuilen:</p>
                <div className="grid grid-cols-3 gap-1">
                  {aiValkuilen.map((v) => (
                    <div key={v.naam} className="bg-white rounded p-1.5 border text-center">
                      <div className="text-sm">{v.emoji}</div>
                      <div className="text-[10px] font-medium text-gray-900">{v.naam}</div>
                      <div className="text-[9px] text-gray-500">{v.tip}</div>
                    </div>
                  ))}
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
                <h2 className="font-semibold text-gray-900">Spelregels: Wat mag?</h2>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-red-50 rounded-lg p-2 border border-red-200">
                  <p className="text-[10px] font-medium text-red-800 mb-1">🔒 Privacy</p>
                  <ul className="text-[9px] text-gray-600 space-y-0.5">
                    {privacyChecklist.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-lg p-2 border border-amber-200">
                  <p className="text-[10px] font-medium text-amber-800 mb-1">📢 Melden</p>
                  <ul className="text-[9px] text-gray-600 space-y-0.5">
                    {transparantieTips.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                  <p className="text-[10px] font-medium text-green-800 mb-1">🌱 Bewust</p>
                  <ul className="text-[9px] text-gray-600 space-y-0.5">
                    <li>• AI voor leren = de moeite waard</li>
                    <li>• Mindloos genereren = verspilling</li>
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
