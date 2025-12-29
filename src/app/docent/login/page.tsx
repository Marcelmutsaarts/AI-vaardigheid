'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDocent } from '@/contexts/DocentContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { GraduationCap, ArrowLeft, AlertCircle } from 'lucide-react'

export default function DocentLogin() {
  const router = useRouter()
  const { login, isLoggedIn } = useDocent()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Als al ingelogd, redirect naar dashboard
  if (isLoggedIn) {
    router.push('/docent')
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Kleine delay voor betere UX
    setTimeout(() => {
      const success = login(password)
      if (success) {
        router.push('/docent')
      } else {
        setError('Onjuist wachtwoord. Neem contact op met AI voor Docenten.')
        setPassword('')
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-gray-900 hover:text-primary transition-colors w-fit">
            <ArrowLeft className="h-4 w-4" />
            <span>Terug naar leerlingomgeving</span>
          </Link>
        </div>
      </header>

      {/* Login form */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Docentenomgeving</CardTitle>
            <CardDescription>
              Log in om toegang te krijgen tot de docentenhandleiding en begeleidingstools.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Wachtwoord
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Voer het docentenwachtwoord in"
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Bezig met inloggen...' : 'Inloggen'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t text-center text-sm text-gray-500">
              <p>Geen wachtwoord ontvangen?</p>
              <a
                href="https://aivoordocenten.nl/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Neem contact op met AI voor Docenten
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
