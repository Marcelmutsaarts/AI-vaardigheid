import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NiveauProvider } from '@/contexts/NiveauContext'
import { DocentProvider } from '@/contexts/DocentContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'KIES Leeromgeving | AI voor Docenten',
  description: 'Word AI-vaardig met het KIES-framework. Leer hoe je slim en verantwoord met AI omgaat.',
  keywords: ['AI', 'onderwijs', 'KIES', 'prompting', 'AI-vaardig', 'voortgezet onderwijs'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className={`${inter.variable} font-sans antialiased`}>
        <DocentProvider>
          <NiveauProvider>
            {children}
          </NiveauProvider>
        </DocentProvider>
      </body>
    </html>
  )
}
