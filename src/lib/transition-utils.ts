import type { NiveauGroep } from './transition-texts'

const TRANSITION_SEEN_KEY = 'kies-transitions-seen'

/**
 * Bepaal de niveaugroep op basis van schoolType.
 * MBO wordt behandeld als HAVO, HBO als VWO.
 */
export function getNiveauGroep(schoolType: string | null): NiveauGroep {
  if (!schoolType) return 'havo' // fallback
  if (schoolType.startsWith('vmbo') || schoolType === 'vmbo') return 'vmbo'
  if (schoolType.startsWith('vwo') || schoolType === 'vwo' || schoolType === 'hbo') return 'vwo'
  // havo, mbo, en alles anders → havo
  return 'havo'
}

/**
 * Check of een transitiescherm al gezien is.
 */
export function isTransitionSeen(transitionId: string): boolean {
  try {
    const seen = localStorage.getItem(TRANSITION_SEEN_KEY)
    if (!seen) return false
    const parsed: string[] = JSON.parse(seen)
    return parsed.includes(transitionId)
  } catch {
    return false
  }
}

/**
 * Markeer een transitiescherm als gezien.
 */
export function markTransitionSeen(transitionId: string): void {
  try {
    const seen = localStorage.getItem(TRANSITION_SEEN_KEY)
    const parsed: string[] = seen ? JSON.parse(seen) : []
    if (!parsed.includes(transitionId)) {
      parsed.push(transitionId)
      localStorage.setItem(TRANSITION_SEEN_KEY, JSON.stringify(parsed))
    }
  } catch {
    // Graceful fail - als localStorage niet werkt, sla we het over
  }
}
