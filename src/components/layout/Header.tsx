'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useNiveau } from '@/contexts/NiveauContext'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Header() {
  const { niveau } = useNiveau()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // MBO/HBO hebben geen leerjaar, dus alleen schoolType checken voor die gevallen
  const hasNiveau = niveau.schoolType && (
    niveau.schoolType === 'mbo' || niveau.schoolType === 'hbo' || niveau.leerjaar
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="AI voor Docenten"
              width={180}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          {hasNiveau && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          )}

          {/* Mobile menu button */}
          {hasNiveau && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && hasNiveau && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              <Link
                href="/dashboard"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary-light rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
