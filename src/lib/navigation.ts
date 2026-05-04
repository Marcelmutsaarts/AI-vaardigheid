import { Progress } from '@/contexts/NiveauContext'

export interface SubStep {
  id: string           // 'k1', 'k2', 'i1', etc.
  title: string        // 'Drie manieren', 'Oefenen', etc.
  description: string  // Short description
  href: string         // '/leerpad/kiezen/k1'
}

export interface KiesLetter {
  key: 'kiezen' | 'instrueren' | 'evalueren' | 'spelregels'
  letter: string       // 'K', 'I', 'E', 'S'
  title: string        // 'Kiezen', 'Instrueren', etc.
  description: string  // 'Wanneer gebruik je AI?'
  color: string        // from kiesKleuren
  href: string         // '/leerpad/kiezen'
  subSteps: SubStep[]
}

export const kiesStructuur: KiesLetter[] = [
  {
    key: 'kiezen', letter: 'K', title: 'Kiezen',
    description: 'Wanneer gebruik je AI?',
    color: '#a15df5', href: '/leerpad/kiezen',
    subSteps: [
      { id: 'k1', title: 'Drie manieren', description: 'Zelf, samen met AI, of AI doet het', href: '/leerpad/kiezen/k1' },
      { id: 'k2', title: 'Oefenen', description: 'Pas je keuzes toe op een opdracht', href: '/leerpad/kiezen/k2' },
    ]
  },
  {
    key: 'instrueren', letter: 'I', title: 'Instrueren',
    description: 'Hoe vraag je het goed?',
    color: '#9959ea', href: '/leerpad/instrueren',
    subSteps: [
      { id: 'intro', title: 'Waarom prompten?', description: 'Snap waarom goede prompts ertoe doen', href: '/leerpad/instrueren/intro' },
      { id: 'i1', title: 'Hoe bouw je een prompt?', description: 'Leer de onderdelen van een goede prompt', href: '/leerpad/instrueren/i1' },
      { id: 'i2', title: 'Oefenen met prompts', description: 'Bouw zelf prompts en test ze uit', href: '/leerpad/instrueren/i2' },
    ]
  },
  {
    key: 'evalueren', letter: 'E', title: 'Evalueren',
    description: 'Klopt wat AI zegt?',
    color: '#814bc6', href: '/leerpad/evalueren',
    subSteps: [
      { id: 'e1', title: 'Evalueren', description: 'Leer AI-output kritisch beoordelen', href: '/leerpad/evalueren' },
    ]
  },
  {
    key: 'spelregels', letter: 'S', title: 'Spelregels',
    description: 'Wat mag en moet?',
    color: '#7947ba', href: '/leerpad/spelregels',
    subSteps: [
      { id: 's1', title: 'Wat deel je?', description: 'Denk na over wat je aan AI vertelt', href: '/leerpad/spelregels' },
      { id: 's2', title: 'Wanneer vertel je het?', description: 'Transparantie over AI-gebruik', href: '/leerpad/spelregels' },
      { id: 's3', title: 'AI en energie', description: 'Hoeveel stroom kost AI eigenlijk?', href: '/leerpad/spelregels' },
    ]
  },
]

/**
 * Find a KiesLetter by its key (e.g. 'kiezen', 'instrueren')
 */
export function getLetterByKey(key: string): KiesLetter | undefined {
  return kiesStructuur.find((letter) => letter.key === key)
}

/**
 * Find the KiesLetter that contains a given substep id (e.g. 'k1', 'i2')
 */
export function getLetterBySubStepId(subStepId: string): KiesLetter | undefined {
  return kiesStructuur.find((letter) =>
    letter.subSteps.some((step) => step.id === subStepId)
  )
}

/**
 * Get the globally next incomplete substep across all letters.
 * Follows the order: K1, K2, I1, I2, E1, S1, S2, S3.
 * Returns null if everything is completed.
 */
export function getNextSubStep(progress: Progress): { letter: KiesLetter; subStep: SubStep } | null {
  for (const letter of kiesStructuur) {
    const letterProgress = progress[letter.key] as Record<string, boolean>
    for (const subStep of letter.subSteps) {
      if (!letterProgress[subStep.id]) {
        return { letter, subStep }
      }
    }
  }
  return null
}

/**
 * Get the next incomplete substep within a specific letter.
 * Returns null if all substeps in the letter are completed or the key is not found.
 */
export function getNextSubStepInLetter(letterKey: string, progress: Progress): SubStep | null {
  const letter = getLetterByKey(letterKey)
  if (!letter) return null

  const letterProgress = progress[letter.key] as Record<string, boolean>
  for (const subStep of letter.subSteps) {
    if (!letterProgress[subStep.id]) {
      return subStep
    }
  }
  return null
}

/**
 * Check if all substeps of a letter are completed.
 */
export function isLetterComplete(letterKey: string, progress: Progress): boolean {
  const letter = getLetterByKey(letterKey)
  if (!letter) return false

  const letterProgress = progress[letter.key] as Record<string, boolean>
  return letter.subSteps.every((subStep) => letterProgress[subStep.id])
}

/**
 * Check if a substep is accessible.
 * A substep is accessible if:
 * - It is the first substep in its letter, OR
 * - The previous substep within the same letter is completed.
 */
export function isSubStepAccessible(subStepId: string, progress: Progress): boolean {
  const letter = getLetterBySubStepId(subStepId)
  if (!letter) return false

  const letterProgress = progress[letter.key] as Record<string, boolean>
  const index = letter.subSteps.findIndex((step) => step.id === subStepId)

  // First substep is always accessible
  if (index === 0) return true

  // Otherwise, the previous substep must be completed
  const previousStep = letter.subSteps[index - 1]
  return letterProgress[previousStep.id] === true
}
