'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'

export default function OverPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Terug
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">Over KIES</h1>

          {/* Wat is KIES */}
          <div className="bg-white rounded-xl border shadow-sm p-5 mb-4">
            <h2 className="font-semibold text-gray-900 mb-3">Wat is KIES?</h2>
            <p className="text-sm text-gray-600 mb-4">
              KIES is een leeromgeving waar je leert om slim met AI om te gaan.
              Niet alleen hoe je AI gebruikt, maar ook wanneer, waarom en wat de spelregels zijn.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2" style={{ backgroundColor: kiesKleuren.kiezen }}>K</div>
                <p className="text-xs text-gray-600"><strong>Kiezen</strong> - Wanneer zet je AI in?</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2" style={{ backgroundColor: kiesKleuren.instrueren }}>I</div>
                <p className="text-xs text-gray-600"><strong>Instrueren</strong> - Hoe vraag je het goed?</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2" style={{ backgroundColor: kiesKleuren.evalueren }}>E</div>
                <p className="text-xs text-gray-600"><strong>Evalueren</strong> - Klopt wat AI zegt?</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2" style={{ backgroundColor: kiesKleuren.spelregels }}>S</div>
                <p className="text-xs text-gray-600"><strong>Spelregels</strong> - Wat mag en moet?</p>
              </div>
            </div>
          </div>

          {/* Gemaakt door */}
          <div className="bg-white rounded-xl border shadow-sm p-5 mb-4">
            <h2 className="font-semibold text-gray-900 mb-3">Gemaakt door</h2>
            <p className="text-sm text-gray-600 mb-3">
              KIES is ontwikkeld door <strong>AI voor Docenten</strong>, een platform dat docenten helpt
              om AI op een goede manier in te zetten in het onderwijs.
            </p>
            <a
              href="https://aivoordocenten.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              aivoordocenten.nl
            </a>
          </div>

          {/* Tip voor leerlingen */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-4">
            <h2 className="font-semibold text-gray-900 mb-3">Meer leren over AI?</h2>
            <p className="text-sm text-gray-600 mb-3">
              Op AI voor Leerlingen vind je AI-tutoren voor verschillende vakken,
              handige tools en nog veel meer om je te helpen met school.
            </p>
            <a
              href="https://aivoorleerlingen.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              aivoorleerlingen.nl
            </a>
          </div>

          {/* Theoretische basis */}
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Achtergrond</h2>
            <p className="text-sm text-gray-600">
              KIES is gebaseerd op het AI Fluency Framework van Anthropic,
              ontwikkeld door onderzoekers van Ringling College en University College Cork.
              Het framework helpt om AI-vaardigheden op een gestructureerde manier te leren.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
