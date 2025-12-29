'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDocent } from '@/contexts/DocentContext'
import { Button } from '@/components/ui/button'
import {
  GraduationCap,
  LogOut,
  BookOpen,
  MessageSquare,
  CheckCircle,
  Shield,
  ExternalLink
} from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'

const modules = [
  {
    letter: 'K',
    title: 'Kiezen',
    color: kiesKleuren.kiezen,
    icon: BookOpen,
    inhoud: 'Leerlingen ontdekken AI-rollen en maken een strategie voor een opdracht. Ze kiezen per stap: zelf doen, AI laten helpen, of AI laten uitvoeren.',
    tips: [
      'Bespreek klassikaal: waarom zou je AI wel/niet inzetten?',
      'Laat de taakanalyse in tweetallen doen',
    ],
  },
  {
    letter: 'I',
    title: 'Instrueren',
    color: kiesKleuren.instrueren,
    icon: MessageSquare,
    inhoud: 'Leerlingen leren goede vragen stellen aan AI. Per niveau een ander stappenplan: simpeler voor VMBO, uitgebreider voor VWO.',
    tips: [
      'Laat prompts vergelijken en verbeteren',
      'Focus op het proces, niet alleen het resultaat',
    ],
  },
  {
    letter: 'E',
    title: 'Evalueren',
    color: kiesKleuren.evalueren,
    icon: CheckCircle,
    inhoud: 'Leerlingen leren AI-output kritisch beoordelen via de Mens-AI-Mens methode: begrijpen, checken, verbeteren.',
    tips: [
      'Geef bewust foutieve AI-output ter analyse',
      'Laat bronnen checken en vergelijken',
    ],
  },
  {
    letter: 'S',
    title: 'Spelregels',
    color: kiesKleuren.spelregels,
    icon: Shield,
    inhoud: 'Leerlingen denken na over privacy, transparantie en duurzaamheid. Plus een genuanceerde blik op AI en energieverbruik.',
    tips: [
      'Bespreek jullie schoolregels rondom AI expliciet',
      'De energie-quiz nuanceert wilde verhalen over AI en milieu',
    ],
  },
]

export default function DocentDashboard() {
  const router = useRouter()
  const { isLoggedIn, logout } = useDocent()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/docent/login')
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Docentenomgeving</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-600 hover:text-primary">
                Bekijk app
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Uit
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Intro */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">KIES Leeromgeving</h1>
          <p className="text-gray-600">
            App waar leerlingen leren om bewust met AI om te gaan.
            Geen accounts nodig - leerlingen selecteren hun niveau en kunnen direct aan de slag.
          </p>
        </div>

        {/* Hoe werkt het */}
        <div className="bg-white rounded-xl border shadow-sm p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Hoe werkt het?</h2>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="font-semibold text-primary">1.</span>
              Leerling kiest schooltype en leerjaar op de homepage
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary">2.</span>
              Dashboard toont de vier KIES-onderdelen met voortgang
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary">3.</span>
              Per onderdeel interactieve oefeningen met directe feedback
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary">4.</span>
              Voortgang wordt lokaal opgeslagen (geen login nodig)
            </li>
          </ol>
        </div>

        {/* Modules overzicht */}
        <h2 className="font-semibold text-gray-900 mb-3">De vier onderdelen</h2>
        <div className="space-y-3 mb-6">
          {modules.map((m) => {
            const Icon = m.icon
            return (
              <div key={m.letter} className="bg-white rounded-xl border shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.letter}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{m.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{m.inhoud}</p>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs font-medium text-gray-500 mb-1">Tips:</p>
                      <ul className="text-xs text-gray-600 space-y-0.5">
                        {m.tips.map((tip, i) => (
                          <li key={i}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Inzet in de les */}
        <div className="bg-white rounded-xl border shadow-sm p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Inzet in de les</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Klassikaal</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Projecteer de app en doorloop samen</li>
                <li>• Laat tweetallen de oefeningen doen</li>
                <li>• Bespreek antwoorden klassikaal na</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Zelfstandig</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Leerlingen werken in eigen tempo</li>
                <li>• Voortgang blijft bewaard in browser</li>
                <li>• Geschikt als huiswerk of extra</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="bg-gray-100 rounded-xl p-5 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Meer weten over AI in het onderwijs?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://aivoordocenten.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              aivoordocenten.nl
            </a>
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
        </div>
      </main>
    </div>
  )
}
