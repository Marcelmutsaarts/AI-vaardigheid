'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { kiesKleuren } from '@/lib/utils'
import { aiHelptRollen, aiDoetRollen, AIRol } from '@/lib/kiezen-content'
import { ChatModal } from '@/components/ChatModal'

export default function K1Page() {
  const router = useRouter()
  const { niveau, updateProgress } = useNiveau()
  const [selectedRole, setSelectedRole] = useState<AIRol | null>(null)
  const [selectedMode, setSelectedMode] = useState<'helpt' | 'doet'>('helpt')

  useEffect(() => {
    if (!niveau.schoolType || !niveau.leerjaar) {
      router.push('/')
    }
  }, [niveau, router])

  if (!niveau.schoolType || !niveau.leerjaar) {
    return null
  }

  const handleComplete = () => {
    updateProgress('kiezen', 'k1', true)
    router.push('/leerpad/kiezen/k2')
  }

  const openChat = (role: AIRol, mode: 'helpt' | 'doet') => {
    setSelectedRole(role)
    setSelectedMode(mode)
  }

  const closeChat = () => {
    setSelectedRole(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Terug link */}
          <Link
            href="/leerpad/kiezen"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kiezen
          </Link>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: kiesKleuren.kiezen }}
              >
                K1
              </div>
              <h1 className="text-xl font-bold text-gray-900">Drie manieren</h1>
            </div>
            <p className="text-gray-600">
              Klik op een optie om te verkennen
            </p>
          </div>

          {/* Drie kolommen */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Zelf */}
            <div className="bg-white rounded-2xl border shadow-sm p-4 flex flex-col">
              <div className="text-center mb-4 pb-4 border-b">
                <span className="text-4xl mb-2 block">👤</span>
                <h2 className="font-bold text-gray-900 text-lg">Zelf</h2>
                <p className="text-sm text-gray-500">Ik doe dit zonder AI</p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-400 text-sm text-center px-4">
                  Soms is zelf doen de beste keuze
                </p>
              </div>
            </div>

            {/* Samen met AI */}
            <div className="bg-white rounded-2xl border shadow-sm p-4">
              <div className="text-center mb-4 pb-4 border-b">
                <span className="text-4xl mb-2 block">🤝</span>
                <h2 className="font-bold text-gray-900 text-lg">Samen met AI</h2>
                <p className="text-sm text-gray-500">AI ondersteunt mij</p>
              </div>
              <div className="space-y-1">
                {aiHelptRollen.map((rol) => (
                  <button
                    key={rol.id}
                    onClick={() => openChat(rol, 'helpt')}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-primary/5 transition-colors text-left"
                  >
                    <span className="text-lg">{rol.emoji}</span>
                    <span className="text-sm font-medium text-gray-700">{rol.titel}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI doet het */}
            <div className="bg-white rounded-2xl border shadow-sm p-4">
              <div className="text-center mb-4 pb-4 border-b">
                <span className="text-4xl mb-2 block">🤖</span>
                <h2 className="font-bold text-gray-900 text-lg">AI doet het</h2>
                <p className="text-sm text-gray-500">AI maakt het, ik check</p>
              </div>
              <div className="space-y-1">
                {aiDoetRollen.map((rol) => (
                  <button
                    key={rol.id}
                    onClick={() => openChat(rol, 'doet')}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-primary/5 transition-colors text-left"
                  >
                    <span className="text-lg">{rol.emoji}</span>
                    <span className="text-sm font-medium text-gray-700">{rol.titel}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Volgende stap */}
          <Button onClick={handleComplete} size="lg" className="w-full">
            Volgende stap
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </main>

      <Footer />

      {/* Chat Modal */}
      {selectedRole && (
        <ChatModal
          isOpen={!!selectedRole}
          onClose={closeChat}
          role={selectedRole}
          mode={selectedMode}
        />
      )}
    </div>
  )
}
