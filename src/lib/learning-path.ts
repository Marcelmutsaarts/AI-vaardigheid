// =============================================================================
// learning-path.ts - Centrale route-configuratie voor de KIES leeromgeving
// =============================================================================

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface ModuleConfig {
  id: string;           // bijv. 'k1', 'k2', 'i1'
  letter: 'K' | 'I' | 'E' | 'S';
  label: string;        // bijv. 'Drie manieren'
  doel: string;         // contextbanner doel tekst
  actie: string;        // contextbanner actie tekst
  next: string | null;  // id van volgende module, null bij laatste
  path: string;         // bijv. '/leerpad/kiezen/k1'
  letterLabel: string;  // bijv. 'Kiezen'
}

export interface K2PhaseConfig {
  id: string;
  label: string;
  doel: string;
  actie: string;
}

export interface LetterColor {
  bg: string;
  text: string;
  light: string;
}

// -----------------------------------------------------------------------------
// Module configuratie
// -----------------------------------------------------------------------------

export const modules: ModuleConfig[] = [
  // K - Kiezen
  {
    id: 'k1',
    letter: 'K',
    label: 'Drie manieren',
    doel: 'Ontdek drie manieren om AI te gebruiken: zelf, samen met AI, of AI doet het',
    actie: 'Probeer minstens 1 rol uit elke kolom',
    next: 'k2',
    path: '/leerpad/kiezen/k1',
    letterLabel: 'Kiezen',
  },
  {
    id: 'k2',
    letter: 'K',
    label: 'Taak-Ontleder',
    doel: 'Splits een opdracht op in stappen en kies per stap je aanpak',
    actie: 'Kies een opdracht, bepaal de stappen en kies per stap: zelf, samen of AI doet het',
    next: 'i1',
    path: '/leerpad/kiezen/k2',
    letterLabel: 'Kiezen',
  },

  // I - Instrueren
  {
    id: 'i1',
    letter: 'I',
    label: 'Hoe bouw je een prompt?',
    doel: 'Leer de 4 onderdelen van een goede prompt: rol, context, instructies en voorbeeld',
    actie: 'Bekijk alle onderdelen om verder te gaan',
    next: 'i2',
    path: '/leerpad/instrueren/i1',
    letterLabel: 'Instrueren',
  },
  {
    id: 'i2',
    letter: 'I',
    label: 'Oefenen met prompts',
    doel: 'Bouw zelf prompts en test ze uit met AI',
    actie: 'Kies een rol, bouw je prompt, vraag feedback en voer hem uit',
    next: 'e1',
    path: '/leerpad/instrueren/i2',
    letterLabel: 'Instrueren',
  },

  // E - Evalueren
  {
    id: 'e1',
    letter: 'E',
    label: 'Mens-AI-Mens',
    doel: 'Begrijp waarom jij altijd de baas bent: jij bedenkt, AI helpt, jij checkt',
    actie: 'Klik op alle 3 de stappen om het schema te verkennen',
    next: 'e2',
    path: '/leerpad/evalueren/e1',
    letterLabel: 'Evalueren',
  },
  {
    id: 'e2',
    letter: 'E',
    label: 'Spot de valkuilen',
    doel: 'Herken drie AI-valkuilen: vooroordelen, verzinsels en ja-knikkers',
    actie: 'Vul je interesses in en doorloop de drie oefeningen',
    next: 's1',
    path: '/leerpad/evalueren/e2',
    letterLabel: 'Evalueren',
  },

  // S - Spelregels
  {
    id: 's1',
    letter: 'S',
    label: 'Wat deel je?',
    doel: 'Denk na over welke informatie je wel en niet met AI deelt',
    actie: 'Vul alle drie categorieën in: van jezelf, van anderen en vertrouwelijk',
    next: 's2',
    path: '/leerpad/spelregels/s1',
    letterLabel: 'Spelregels',
  },
  {
    id: 's2',
    letter: 'S',
    label: 'Wanneer vertel je het?',
    doel: 'Leer wanneer en hoe je transparant bent over AI-gebruik',
    actie: 'Beantwoord de schoolbeleidvraag en reflecteer op je eigen AI-strategie',
    next: 's3',
    path: '/leerpad/spelregels/s2',
    letterLabel: 'Spelregels',
  },
  {
    id: 's3',
    letter: 'S',
    label: 'AI en energie',
    doel: 'Ontdek hoeveel energie AI kost en wanneer het de moeite waard is',
    actie: 'Beantwoord de quizvraag en bekijk de energievergelijking',
    next: null,
    path: '/leerpad/spelregels/s3',
    letterLabel: 'Spelregels',
  },
];

// -----------------------------------------------------------------------------
// K2 fasen configuratie
// -----------------------------------------------------------------------------

export const k2Phases: K2PhaseConfig[] = [
  {
    id: 'kiezen',
    label: 'Kiezen',
    doel: 'Kies een opdracht om op te splitsen',
    actie: 'Selecteer een opdracht uit de lijst',
  },
  {
    id: 'onderdelen',
    label: 'Onderdelen',
    doel: 'Bepaal welke stappen nodig zijn voor deze opdracht',
    actie: 'Voeg minimaal 2 stappen toe',
  },
  {
    id: 'aanpak',
    label: 'Aanpak',
    doel: 'Kies per stap hoe je die gaat aanpakken',
    actie: 'Selecteer per stap: zelf, samen met AI of AI doet het',
  },
  {
    id: 'resultaat',
    label: 'Inschatten',
    doel: 'Reflecteer op wat je aanpak betekent voor leren, kwaliteit en snelheid',
    actie: 'Beantwoord de drie reflectievragen',
  },
  {
    id: 'experimenteren',
    label: 'Experimenteren',
    doel: 'Bekijk je strategie en pas eventueel aan',
    actie: 'Bekijk je plan, kies of je tevreden bent of wilt aanpassen',
  },
];

// -----------------------------------------------------------------------------
// Kleuren per letter
// -----------------------------------------------------------------------------

const letterColors: Record<string, LetterColor> = {
  K: { bg: '#a15df5', text: '#ffffff', light: '#f3e8ff' },
  I: { bg: '#9959ea', text: '#ffffff', light: '#ede9fe' },
  E: { bg: '#814bc6', text: '#ffffff', light: '#e8e0f0' },
  S: { bg: '#7947ba', text: '#ffffff', light: '#e4dced' },
};

// -----------------------------------------------------------------------------
// Helper functies
// -----------------------------------------------------------------------------

export function getModuleById(id: string): ModuleConfig | null {
  return modules.find((m) => m.id === id) ?? null;
}

export function getModulesByLetter(letter: string): ModuleConfig[] {
  return modules.filter((m) => m.letter === letter.toUpperCase());
}

export function getNextModule(currentId: string): ModuleConfig | null {
  const current = getModuleById(currentId);
  if (!current || !current.next) return null;
  return getModuleById(current.next) ?? null;
}

export function getPreviousModule(currentId: string): ModuleConfig | null {
  const index = modules.findIndex((m) => m.id === currentId);
  if (index <= 0) return null;
  return modules[index - 1];
}

export function getLetterColor(letter: string): LetterColor {
  return letterColors[letter.toUpperCase()] ?? letterColors.K;
}

export function getK2Phases(): K2PhaseConfig[] {
  return k2Phases;
}
