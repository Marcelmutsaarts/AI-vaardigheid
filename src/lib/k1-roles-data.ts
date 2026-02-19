// K1 Redesign: Rollen, onderwerpen, prompts en voorbeeldteksten
// Twee-fasen flow: drieluik (begrijpen) + rollen (ervaren)

import type { SchoolType } from '@/contexts/NiveauContext'

// === Types ===

export type NiveauGroep = 'vmbo' | 'havo' | 'vwo'
export type RoleCategory = 'samen' | 'aidoet'
export type RoleInputType = 'onderwerp' | 'tekst'

export interface K1Role {
  id: string
  emoji: string
  titel: string
  tagline: string
  miniScenario: string
  category: RoleCategory
  inputType: RoleInputType
}

export interface K1Category {
  id: 'zelf' | 'samen' | 'aidoet'
  emoji: string
  titel: string
  subtitel: string
  bgClass: string
  hoverClass: string
  expandable: boolean
  introTekst?: string
}

// === Categorieen ===

export const categories: K1Category[] = [
  {
    id: 'zelf',
    emoji: '\u270B',
    titel: 'Zelf',
    subtitel: 'Jij doet het werk. Geen AI nodig.',
    bgClass: 'bg-gray-50',
    hoverClass: 'hover:bg-gray-100',
    expandable: false,
  },
  {
    id: 'samen',
    emoji: '\u{1F91D}',
    titel: 'Samen met AI',
    subtitel: 'AI helpt je denken, maar jij blijft aan het stuur.',
    bgClass: 'bg-purple-50',
    hoverClass: 'hover:bg-purple-100',
    expandable: true,
    introTekst: 'AI helpt je denken. Kies een rol en probeer het:',
  },
  {
    id: 'aidoet',
    emoji: '\u{1F916}',
    titel: 'AI doet het',
    subtitel: 'AI levert het werk, jij checkt het resultaat.',
    bgClass: 'bg-purple-100',
    hoverClass: 'hover:bg-purple-200',
    expandable: true,
    introTekst: 'AI levert het werk. Kies een rol en probeer het:',
  },
]

// === Rollen ===

export const samenRollen: K1Role[] = [
  {
    id: 'uitlegger',
    emoji: '\u{1F393}',
    titel: 'Uitlegger',
    tagline: 'Legt het je uit',
    miniScenario: 'Kies een onderwerp. De Uitlegger legt het je uit.',
    category: 'samen',
    inputType: 'onderwerp',
  },
  {
    id: 'brainstormer',
    emoji: '\u{1F4A1}',
    titel: 'Brainstormer',
    tagline: 'Stelt je vragen',
    miniScenario: 'Kies een onderwerp. De Brainstormer helpt je nadenken.',
    category: 'samen',
    inputType: 'onderwerp',
  },
  {
    id: 'feedbackgever',
    emoji: '\u{1F4AC}',
    titel: 'Feedbackgever',
    tagline: 'Geeft tips op je tekst',
    miniScenario: 'Stel: je hebt dit geschreven voor school. Wat zegt de Feedbackgever ervan?',
    category: 'samen',
    inputType: 'tekst',
  },
  {
    id: 'oefenmaatje',
    emoji: '\u{1F3AF}',
    titel: 'Oefenmaatje',
    tagline: 'Toetst je kennis',
    miniScenario: 'Kies een onderwerp. Het Oefenmaatje stelt je een vraag.',
    category: 'samen',
    inputType: 'onderwerp',
  },
]

export const aiDoetRollen: K1Role[] = [
  {
    id: 'schrijver',
    emoji: '\u270D\uFE0F',
    titel: 'Schrijver',
    tagline: 'Schrijft het voor je',
    miniScenario: 'Kies een onderwerp. De Schrijver maakt een tekst voor je.',
    category: 'aidoet',
    inputType: 'onderwerp',
  },
  {
    id: 'vertaler',
    emoji: '\u{1F30D}',
    titel: 'Vertaler',
    tagline: 'Vertaalt je tekst',
    miniScenario: 'Stel: dit moet in het Engels. De Vertaler regelt het.',
    category: 'aidoet',
    inputType: 'tekst',
  },
  {
    id: 'verbeteraar',
    emoji: '\u2728',
    titel: 'Verbeteraar',
    tagline: 'Maakt je tekst beter',
    miniScenario: 'Stel: je hebt dit geschreven voor school. De Verbeteraar maakt het beter.',
    category: 'aidoet',
    inputType: 'tekst',
  },
  {
    id: 'samenvatter',
    emoji: '\u{1F4CB}',
    titel: 'Samenvatter',
    tagline: 'Vat het kort samen',
    miniScenario: 'Stel: je moet dit samenvatten. De Samenvatter doet het voor je.',
    category: 'aidoet',
    inputType: 'tekst',
  },
]

// === Onderwerpen per niveau ===

export const onderwerpPerNiveau: Record<NiveauGroep, string[]> = {
  vmbo: ['Voetbal', 'Social media', 'Gezonde voeding'],
  havo: ['Klimaatverandering', 'Kunstmatige intelligentie', 'Sociale media en mentale gezondheid'],
  vwo: ['Klimaatverandering', 'Kunstmatige intelligentie', 'Ethiek van genbewerking'],
}

// === Voorbeeldteksten per niveau (voor tekst-rollen) ===
// 6-8 zinnen, herkenbaar als leerlingtekst, bewust imperfect

export const voorbeeldTekstPerNiveau: Record<NiveauGroep, string> = {
  vmbo: 'Ik heb een werkstuk gemaakt over social media. Social media is heel populair bij jongeren. Bijna iedereen heeft Instagram of TikTok op zijn telefoon. Veel mensen gebruiken het elke dag, soms wel 3 uur of meer. Het is leuk want je kan filmpjes kijken en met vrienden chatten. Maar het kan ook verslaafd maken en dan ga je te laat naar bed. Sommige mensen worden er ook onzeker van omdat iedereen er perfect uitziet. Ik vind dat je er voorzichtig mee moet zijn maar het is ook niet alleen maar slecht ofzo.',
  havo: 'De opwarming van de aarde is een van de grootste problemen van deze tijd. Wetenschappers zeggen dat de gemiddelde temperatuur stijgt door de uitstoot van CO2 door fabrieken, auto\u2019s en vliegtuigen. Sommige mensen geloven dit niet maar het wetenschappelijk bewijs is best wel overtuigend. De gevolgen zijn onder andere overstromingen, langere periodes van droogte en het smelten van ijs op de noordpool en zuidpool. Dit heeft ook effecten op dieren die hun leefgebied verliezen. We moeten eigenlijk veel meer doen aan duurzame energie maar dat is ook weer heel duur en niet ieder land kan dat betalen. De vraag is dus hoe we dit eerlijk verdelen over alle landen.',
  vwo: 'De discussie over kunstmatige intelligentie wordt steeds relevanter in onze samenleving. Er zijn verschillende perspectieven op de impact die AI zal hebben op de arbeidsmarkt en het onderwijs. Sommige experts beweren dat AI banen zal vervangen, terwijl anderen juist wijzen op nieuwe mogelijkheden die zullen ontstaan. Een belangrijk punt van zorg is de mogelijke versterking van bestaande ongelijkheden, bijvoorbeeld doordat AI-systemen getraind worden op data die vooroordelen bevatten. Tegelijkertijd bied AI kansen voor effici\u00EBntere gezondheidszorg en wetenschappelijk onderzoek. Het is een complex vraagstuk waar geen eenvoudig antwoord op bestaat. De ethische implicaties van AI-gebruik worden vaak onderschat in het publieke debat, terwijl juist daar de discussie het hardst nodig is.',
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
    `Je bent een uitlegger voor een ${niveau.toUpperCase()}-leerling. Leg het onderwerp "${onderwerp}" uit in begrijpelijke taal. Gebruik korte alinea's. Maximaal 150 woorden. ${niveauInstructies[niveau]}`,

  brainstormer: (niveau, onderwerp) =>
    `Je bent een brainstormpartner voor een ${niveau.toUpperCase()}-leerling. Het onderwerp is "${onderwerp}". Stel 2-3 prikkelende vragen die de leerling aan het denken zetten over dit onderwerp. Geef GEEN antwoorden, alleen vragen. ${niveauInstructies[niveau]}`,

  feedbackgever: (niveau, tekst) =>
    `Je bent een feedbackgever voor een ${niveau.toUpperCase()}-leerling. Geef constructieve feedback op de volgende tekst. Noem 1 sterk punt en 2 verbeterpunten. Wees bemoedigend. ${niveauInstructies[niveau]}\n\nTekst: "${tekst}"`,

  oefenmaatje: (niveau, onderwerp) =>
    `Je bent een oefenmaatje voor een ${niveau.toUpperCase()}-leerling. Stel \u00E9\u00E9n oefenvraag over het onderwerp "${onderwerp}". Maak het uitdagend maar haalbaar. Geef nog niet het antwoord. ${niveauInstructies[niveau]}`,

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
 * MBO -> havo, HBO -> vwo.
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

/**
 * Vind een rol op ID in beide lijsten.
 */
export function findRoleById(roleId: string): K1Role | undefined {
  return samenRollen.find(r => r.id === roleId) || aiDoetRollen.find(r => r.id === roleId)
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

  if (hasSamen && !hasAiDoet) return 'Probeer ook een rol uit de andere categorie!'
  if (!hasSamen && hasAiDoet) return 'Probeer ook een rol uit de andere categorie!'
  return null
}
