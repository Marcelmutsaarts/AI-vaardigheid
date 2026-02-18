// K1 Redesign: Rollen, onderwerpen, prompts en voorbeeldteksten
// Twee-fasen flow: drieluik (begrijpen) → rollen (ervaren)

import type { SchoolType } from '@/contexts/NiveauContext'

// === Types ===

export type NiveauGroep = 'vmbo' | 'havo' | 'vwo'
export type RoleCategory = 'samen' | 'aidoet'
export type RoleInputType = 'onderwerp' | 'tekst'

export interface K1Role {
  id: string
  emoji: string
  titel: string
  category: RoleCategory
  inputType: RoleInputType
}

// === Rollen ===

export const samenRollen: K1Role[] = [
  { id: 'uitlegger', emoji: '🎓', titel: 'Uitlegger', category: 'samen', inputType: 'onderwerp' },
  { id: 'brainstormer', emoji: '💡', titel: 'Brainstormer', category: 'samen', inputType: 'onderwerp' },
  { id: 'feedbackgever', emoji: '💬', titel: 'Feedbackgever', category: 'samen', inputType: 'tekst' },
  { id: 'oefenmaatje', emoji: '🎯', titel: 'Oefenmaatje', category: 'samen', inputType: 'onderwerp' },
]

export const aiDoetRollen: K1Role[] = [
  { id: 'schrijver', emoji: '✍️', titel: 'Schrijver', category: 'aidoet', inputType: 'onderwerp' },
  { id: 'vertaler', emoji: '🌍', titel: 'Vertaler', category: 'aidoet', inputType: 'tekst' },
  { id: 'verbeteraar', emoji: '✨', titel: 'Verbeteraar', category: 'aidoet', inputType: 'tekst' },
  { id: 'samenvatter', emoji: '📋', titel: 'Samenvatter', category: 'aidoet', inputType: 'tekst' },
]

// === Onderwerpen per niveau ===

export const onderwerpPerNiveau: Record<NiveauGroep, string[]> = {
  vmbo: ['Voetbal', 'Social media', 'Gezonde voeding'],
  havo: ['Klimaatverandering', 'Kunstmatige intelligentie', 'Sociale media en mentale gezondheid'],
  vwo: ['Klimaatverandering', 'Kunstmatige intelligentie', 'Ethiek van genbewerking'],
}

// === Voorbeeldteksten per niveau (voor tekst-rollen) ===

export const voorbeeldTekstPerNiveau: Record<NiveauGroep, string> = {
  vmbo: 'Ik heb een werkstuk gemaakt over social media. Social media is heel populair bij jongeren. Veel mensen gebruiken het elke dag, soms wel 3 uur. Het is leuk maar het kan ook verslaafd maken. Ik vind dat je er voorzichtig mee moet zijn maar het is ook niet alleen maar slecht ofzo.',
  havo: 'De opwarming van de aarde is een groot probleem. Wetenschappers zeggen dat de temperatuur stijgt door CO2 uitstoot van fabrieken en auto\'s. Sommige mensen geloven dit niet maar het bewijs is best wel duidelijk. De gevolgen zijn overstromingen en droogte en het smelten van ijs op de noordpool. We moeten eigenlijk meer doen aan duurzame energie maar dat is ook weer heel duur.',
  vwo: 'De discussie over kunstmatige intelligentie wordt steeds relevanter in onze samenleving. Er zijn verschillende perspectieven op de impact die AI zal hebben op de arbeidsmarkt en het onderwijs. Sommige experts beweren dat AI banen zal vervangen terwijl anderen juist nieuwe mogelijkheden zien. Het is een complex vraagstuk waar geen eenvoudig antwoord op bestaat. De ethische implicaties van AI-gebruik worden vaak onderschat in het publieke debat.',
}

// === Niveau-instructies voor prompts ===

const niveauInstructies: Record<NiveauGroep, string> = {
  vmbo: 'Gebruik simpele woorden en korte zinnen. Maximaal 3 zinnen per alinea.',
  havo: 'Gebruik normale taal, niet te formeel. Wees helder en bondig.',
  vwo: 'Je mag academischer taalgebruik hanteren. Wees precies en genuanceerd.',
}

// === Systeem-prompts per rol ===

type PromptBuilder = (niveau: NiveauGroep, input: string) => string

const rolPrompts: Record<string, PromptBuilder> = {
  uitlegger: (niveau, onderwerp) =>
    `Je bent een uitlegger voor een ${niveau.toUpperCase()}-leerling. Leg het onderwerp "${onderwerp}" uit in begrijpelijke taal. Gebruik korte alinea's. ${niveauInstructies[niveau]}`,

  brainstormer: (niveau, onderwerp) =>
    `Je bent een brainstormpartner voor een ${niveau.toUpperCase()}-leerling. Het onderwerp is "${onderwerp}". Stel 2-3 prikkelende vragen die de leerling aan het denken zetten over dit onderwerp. Geef GEEN antwoorden, alleen vragen. ${niveauInstructies[niveau]}`,

  feedbackgever: (niveau, tekst) =>
    `Je bent een feedbackgever voor een ${niveau.toUpperCase()}-leerling. Geef constructieve feedback op de volgende tekst. Noem 1 sterk punt en 2 verbeterpunten. Wees bemoedigend. ${niveauInstructies[niveau]}\n\nTekst: "${tekst}"`,

  oefenmaatje: (niveau, onderwerp) =>
    `Je bent een oefenmaatje voor een ${niveau.toUpperCase()}-leerling. Stel één oefenvraag over het onderwerp "${onderwerp}". Maak het uitdagend maar haalbaar. Geef nog niet het antwoord. ${niveauInstructies[niveau]}`,

  schrijver: (niveau, onderwerp) =>
    `Je bent een schrijver die werkt voor een ${niveau.toUpperCase()}-leerling. Schrijf een korte alinea (3-5 zinnen) over "${onderwerp}". Lever een af tekst die de leerling direct zou kunnen gebruiken. ${niveauInstructies[niveau]}`,

  vertaler: (niveau, tekst) =>
    `Je bent een vertaler. Vertaal de volgende Nederlandse tekst naar het Engels. Lever alleen de vertaling, geen uitleg. Pas het taalniveau aan op ${niveau.toUpperCase()}.\n\nTekst: "${tekst}"`,

  verbeteraar: (niveau, tekst) =>
    `Je bent een verbeteraar die werkt voor een ${niveau.toUpperCase()}-leerling. Verbeter de volgende tekst: maak de taal beter, fix spelfouten, en verbeter de structuur. Lever de verbeterde tekst op, gevolgd door een kort lijstje van wat je hebt veranderd. ${niveauInstructies[niveau]}\n\nTekst: "${tekst}"`,

  samenvatter: (niveau, tekst) =>
    `Je bent een samenvatter voor een ${niveau.toUpperCase()}-leerling. Vat de volgende tekst samen in 1-2 zinnen. Pak alleen de kern. ${niveauInstructies[niveau]}\n\nTekst: "${tekst}"`,
}

// === Helpers ===

/**
 * Map schoolType naar niveaugroep.
 * MBO → havo, HBO → vwo.
 */
export function getNiveauGroepVoorK1(schoolType: SchoolType | null): NiveauGroep {
  if (!schoolType) return 'havo'
  if (schoolType === 'vmbo') return 'vmbo'
  if (schoolType === 'vwo' || schoolType === 'hbo') return 'vwo'
  return 'havo' // havo, mbo
}

/**
 * Bouw de systeem-prompt voor een rol met de gegeven input.
 */
export function buildRolePrompt(roleId: string, niveau: NiveauGroep, input: string): string {
  const builder = rolPrompts[roleId]
  if (!builder) return ''
  return builder(niveau, input)
}

// === localStorage tracking ===

const K1_ROLES_KEY = 'kies-k1-roles-tried'

export interface K1RolesState {
  triedRoles: string[] // role IDs
  openedCategories: string[] // 'samen' | 'aidoet'
}

export function getK1RolesState(): K1RolesState {
  try {
    const saved = localStorage.getItem(K1_ROLES_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* graceful fail */ }
  return { triedRoles: [], openedCategories: [] }
}

export function saveK1RolesState(state: K1RolesState): void {
  try {
    localStorage.setItem(K1_ROLES_KEY, JSON.stringify(state))
  } catch { /* graceful fail */ }
}

export function markRoleTried(roleId: string): K1RolesState {
  const state = getK1RolesState()
  if (!state.triedRoles.includes(roleId)) {
    state.triedRoles.push(roleId)
  }
  saveK1RolesState(state)
  return state
}

export function markCategoryOpened(category: string): K1RolesState {
  const state = getK1RolesState()
  if (!state.openedCategories.includes(category)) {
    state.openedCategories.push(category)
  }
  saveK1RolesState(state)
  return state
}

/**
 * Check of de leerling voldoende rollen heeft geprobeerd om door te gaan.
 * Vereist: minstens 1 rol uit "samen" EN 1 rol uit "aidoet".
 */
export function canProceed(triedRoles: string[]): boolean {
  const samenIds = samenRollen.map(r => r.id)
  const aidoetIds = aiDoetRollen.map(r => r.id)

  const hasSamen = triedRoles.some(id => samenIds.includes(id))
  const hasAiDoet = triedRoles.some(id => aidoetIds.includes(id))

  return hasSamen && hasAiDoet
}

/**
 * Geeft een hint als de leerling maar 1 categorie heeft geprobeerd.
 */
export function getProgressHint(triedRoles: string[]): string | null {
  const samenIds = samenRollen.map(r => r.id)
  const aidoetIds = aiDoetRollen.map(r => r.id)

  const hasSamen = triedRoles.some(id => samenIds.includes(id))
  const hasAiDoet = triedRoles.some(id => aidoetIds.includes(id))

  if (hasSamen && !hasAiDoet) return 'Probeer ook een rol uit "AI doet het"!'
  if (!hasSamen && hasAiDoet) return 'Probeer ook een rol uit "Samen met AI"!'
  return null
}
