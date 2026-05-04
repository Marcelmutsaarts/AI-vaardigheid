'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, BookOpen, MessageSquare, CheckCircle, Shield } from 'lucide-react'
import { getNiveauGroep, markTransitionSeen } from '@/lib/transition-utils'
import { welkomContent } from '@/lib/welkom-content'

const TRANSITION_ID = 'welkom'

const kiesItems = [
  { letter: 'K', title: 'Kiezen', subtitle: 'Wanneer wel/niet?', color: '#a15df5', icon: BookOpen },
  { letter: 'I', title: 'Instrueren', subtitle: 'Hoe vraag je het?', color: '#9959ea', icon: MessageSquare },
  { letter: 'E', title: 'Evalueren', subtitle: 'Klopt het wel?', color: '#814bc6', icon: CheckCircle },
  { letter: 'S', title: 'Spelregels', subtitle: 'Wat mag/moet?', color: '#7947ba', icon: Shield },
]

export default function WelkomPage() {
  const router = useRouter()
  const { niveau } = useNiveau()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
      return
    }
    setReady(true)
  }, [niveau, router])

  if (!ready) return null

  const groep = getNiveauGroep(niveau.schoolType)
  const content = welkomContent[groep]

  const handleStart = () => {
    markTransitionSeen(TRANSITION_ID)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-light/30 to-white">
      <Header />

      <main className="flex-1 py-10 md:py-14">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            {content.heading}
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mb-8 text-center font-medium leading-relaxed">
            {content.hook}
          </p>

          <Card className="mb-6">
            <CardContent className="p-6 md:p-8 space-y-4">
              {content.body.map((para, i) => (
                <p key={i} className="text-gray-700 leading-relaxed">
                  {para}
                </p>
              ))}
            </CardContent>
          </Card>

          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 mb-8">
            <p className="text-sm font-semibold text-gray-900 mb-4 text-center">
              {content.kiesIntro}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {kiesItems.map((item) => (
                <div
                  key={item.letter}
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: `${item.color}10` }}
                >
                  <div
                    className="text-2xl font-bold mb-1"
                    style={{ color: item.color }}
                  >
                    {item.letter}
                  </div>
                  <div className="text-xs font-semibold text-gray-900">{item.title}</div>
                  <div className="text-[11px] text-gray-600 mt-0.5">{item.subtitle}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button onClick={handleStart} size="lg" className="px-8">
              {content.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
