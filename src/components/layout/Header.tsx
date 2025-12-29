'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useNiveau } from '@/contexts/NiveauContext'
import { useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const { niveau, getNiveauLabel, setNiveau, getLeerjaarOptions } = useNiveau()
  const [showNiveauDropdown, setShowNiveauDropdown] = useState(false)
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

          {/* Niveau selector */}
          <div className="flex items-center space-x-4">
            {hasNiveau && (
              <div className="relative">
                <button
                  onClick={() => setShowNiveauDropdown(!showNiveauDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-primary-light text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  <span>{getNiveauLabel()}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {showNiveauDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-border py-2 z-50">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                      Wijzig niveau
                    </div>
                    {/* VO niveaus met leerjaar */}
                    {(['vmbo', 'havo', 'vwo'] as const).map((type) => (
                      <div key={type} className="px-3 py-1">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          {type.toUpperCase()}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(type === 'vmbo'
                            ? [1, 2, 3, 4]
                            : type === 'havo'
                            ? [1, 2, 3, 4, 5]
                            : [1, 2, 3, 4, 5, 6]
                          ).map((jaar) => (
                            <button
                              key={jaar}
                              onClick={() => {
                                setNiveau(type, jaar)
                                setShowNiveauDropdown(false)
                              }}
                              className={`px-2 py-1 text-xs rounded ${
                                niveau.schoolType === type && niveau.leerjaar === jaar
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-primary-light'
                              }`}
                            >
                              {jaar}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    {/* MBO/HBO zonder leerjaar */}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      {(['mbo', 'hbo'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setNiveau(type, null)
                            setShowNiveauDropdown(false)
                          }}
                          className={`w-full px-3 py-2 text-left text-sm font-medium rounded ${
                            niveau.schoolType === type
                              ? 'bg-primary text-white'
                              : 'text-gray-700 hover:bg-primary-light'
                          }`}
                        >
                          {type.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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

      {/* Click outside to close dropdown */}
      {showNiveauDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNiveauDropdown(false)}
        />
      )}
    </header>
  )
}
