import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Niveau categorie helpers
export type NiveauCategorie =
  | 'vmbo-1-2'
  | 'vmbo-3-4'
  | 'havo-1-3'
  | 'havo-4-5'
  | 'vwo-1-3'
  | 'vwo-4-6'
  | 'mbo'
  | 'hbo'

export function getNiveauCategorie(
  schoolType: 'vmbo' | 'havo' | 'vwo' | 'mbo' | 'hbo',
  leerjaar: number | null
): NiveauCategorie {
  if (schoolType === 'mbo') return 'mbo'
  if (schoolType === 'hbo') return 'hbo'

  // Voor vmbo/havo/vwo is leerjaar verplicht
  const jaar = leerjaar || 1
  if (schoolType === 'vmbo') {
    return jaar <= 2 ? 'vmbo-1-2' : 'vmbo-3-4'
  }
  if (schoolType === 'havo') {
    return jaar <= 3 ? 'havo-1-3' : 'havo-4-5'
  }
  // vwo
  return jaar <= 3 ? 'vwo-1-3' : 'vwo-4-6'
}

// KIES letter kleuren
export const kiesKleuren = {
  kiezen: '#a15df5',
  instrueren: '#9959ea',
  evalueren: '#814bc6',
  spelregels: '#7947ba',
} as const

// Prompt model per niveau
export function getPromptModel(categorie: NiveauCategorie): 'DWH' | 'DWCH' | 'RDCFR' {
  switch (categorie) {
    case 'vmbo-1-2':
    case 'vmbo-3-4':
      return 'DWH'
    case 'havo-1-3':
    case 'havo-4-5':
    case 'mbo': // MBO gebruikt DWCH (vergelijkbaar met HAVO)
      return 'DWCH'
    case 'vwo-1-3':
    case 'vwo-4-6':
    case 'hbo': // HBO gebruikt RDCFR (vergelijkbaar met VWO bovenbouw)
      return 'RDCFR'
  }
}
