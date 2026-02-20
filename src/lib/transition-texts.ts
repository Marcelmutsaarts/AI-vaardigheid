type NiveauGroep = 'vmbo' | 'havo' | 'vwo'

interface TransitionTexts {
  heading: string
  subtext: string
  buttonLabel: string
}

type TransitionKey =
  | 'k-intro' | 'k1-complete' | 'k-complete'
  | 'i-intro' | 'i1-complete' | 'i-complete'
  | 'e-intro' | 'e-complete'
  | 's-intro' | 's1-complete' | 's2-complete' | 's-complete'

const transitionTexts: Record<TransitionKey, Record<NiveauGroep, TransitionTexts>> = {
  // ===== K-MODULE =====
  'k-intro': {
    vmbo: {
      heading: 'Kiezen',
      subtext: 'Wanneer gebruik je AI? En wanneer niet? Dat ga je hier ontdekken.',
      buttonLabel: 'Aan de slag \u2192',
    },
    havo: {
      heading: 'Kiezen',
      subtext: 'Je leert wanneer AI handig is en wanneer je beter zelf aan de slag gaat. In twee stappen.',
      buttonLabel: 'Aan de slag \u2192',
    },
    vwo: {
      heading: 'Kiezen',
      subtext: 'Je ontwikkelt een strategie: wanneer zet je AI in, en met welk doel? In twee stappen.',
      buttonLabel: 'Aan de slag \u2192',
    },
  },
  'k1-complete': {
    vmbo: {
      heading: 'K1 klaar \u2713',
      subtext: 'Je gaat zo een opdracht uitvoeren. Maar niet in één keer — je bekijkt eerst welke stappen erbij horen.',
      buttonLabel: 'Ga verder \u2192',
    },
    havo: {
      heading: 'K1 afgerond \u2713',
      subtext: 'Je gaat zo met een opdracht aan de slag. Eerst bekijk je welke stappen er nodig zijn. Daarna bepaal je per stap hoe je AI wilt inzetten.',
      buttonLabel: 'Ga verder \u2192',
    },
    vwo: {
      heading: 'K1 afgerond \u2713',
      subtext: 'Je gaat een opdracht aanpakken door deze te ontleden in stappen. Per stap bepaal je je strategie: zelf doen, samenwerken met AI, of uitbesteden.',
      buttonLabel: 'Ga verder \u2192',
    },
  },
  'k-complete': {
    vmbo: {
      heading: 'Kiezen: klaar! \ud83c\udf89',
      subtext: 'Je weet nu wanneer je AI gebruikt. Volgende stap: leren hoe je AI de juiste vraag stelt.',
      buttonLabel: 'Door naar Instrueren \u2192',
    },
    havo: {
      heading: 'Kiezen afgerond! \ud83c\udf89',
      subtext: 'Je kunt nu bewust kiezen wanneer en hoe je AI inzet. Volgende stap: leren hoe je goede prompts schrijft.',
      buttonLabel: 'Door naar Instrueren \u2192',
    },
    vwo: {
      heading: 'Kiezen afgerond! \ud83c\udf89',
      subtext: 'Je hebt een strategie voor bewust AI-gebruik. Volgende stap: effectieve prompts formuleren.',
      buttonLabel: 'Door naar Instrueren \u2192',
    },
  },

  // ===== I-MODULE (placeholders) =====
  'i-intro': {
    vmbo: { heading: 'Instrueren', subtext: 'Leer hoe je AI de juiste vraag stelt.', buttonLabel: 'Aan de slag \u2192' },
    havo: { heading: 'Instrueren', subtext: 'Leer hoe je effectieve prompts schrijft.', buttonLabel: 'Aan de slag \u2192' },
    vwo: { heading: 'Instrueren', subtext: 'Leer hoe je effectieve prompts formuleert.', buttonLabel: 'Aan de slag \u2192' },
  },
  'i1-complete': {
    vmbo: { heading: 'I1 klaar \u2713', subtext: 'Nu ga je zelf oefenen met prompts.', buttonLabel: 'Ga verder \u2192' },
    havo: { heading: 'I1 afgerond \u2713', subtext: 'Nu ga je zelf prompts bouwen en testen.', buttonLabel: 'Ga verder \u2192' },
    vwo: { heading: 'I1 afgerond \u2713', subtext: 'Nu ga je zelf prompts formuleren en evalueren.', buttonLabel: 'Ga verder \u2192' },
  },
  'i-complete': {
    vmbo: { heading: 'Instrueren: klaar! \ud83c\udf89', subtext: 'Je kunt nu goede vragen stellen aan AI.', buttonLabel: 'Door naar Evalueren \u2192' },
    havo: { heading: 'Instrueren afgerond! \ud83c\udf89', subtext: 'Je kunt nu effectieve prompts schrijven.', buttonLabel: 'Door naar Evalueren \u2192' },
    vwo: { heading: 'Instrueren afgerond! \ud83c\udf89', subtext: 'Je beheerst het formuleren van effectieve prompts.', buttonLabel: 'Door naar Evalueren \u2192' },
  },

  // ===== E-MODULE (placeholders) =====
  'e-intro': {
    vmbo: { heading: 'Evalueren', subtext: 'Leer checken of AI het goed heeft gedaan.', buttonLabel: 'Aan de slag \u2192' },
    havo: { heading: 'Evalueren', subtext: 'Leer hoe je AI-output kritisch beoordeelt.', buttonLabel: 'Aan de slag \u2192' },
    vwo: { heading: 'Evalueren', subtext: 'Leer hoe je AI-output systematisch evalueert.', buttonLabel: 'Aan de slag \u2192' },
  },
  'e-complete': {
    vmbo: { heading: 'Evalueren: klaar! \ud83c\udf89', subtext: 'Je kunt nu checken of AI het goed doet.', buttonLabel: 'Door naar Spelregels \u2192' },
    havo: { heading: 'Evalueren afgerond! \ud83c\udf89', subtext: 'Je kunt nu AI-output kritisch beoordelen.', buttonLabel: 'Door naar Spelregels \u2192' },
    vwo: { heading: 'Evalueren afgerond! \ud83c\udf89', subtext: 'Je kunt AI-output systematisch evalueren.', buttonLabel: 'Door naar Spelregels \u2192' },
  },

  // ===== S-MODULE (placeholders) =====
  's-intro': {
    vmbo: { heading: 'Spelregels', subtext: 'Leer wat mag en moet als je AI gebruikt.', buttonLabel: 'Aan de slag \u2192' },
    havo: { heading: 'Spelregels', subtext: 'Leer de regels en afspraken rond AI-gebruik.', buttonLabel: 'Aan de slag \u2192' },
    vwo: { heading: 'Spelregels', subtext: 'Verken de ethische en praktische kaders rond AI-gebruik.', buttonLabel: 'Aan de slag \u2192' },
  },
  's1-complete': {
    vmbo: { heading: 'S1 klaar \u2713', subtext: 'Nu leer je wanneer je vertelt dat je AI hebt gebruikt.', buttonLabel: 'Ga verder \u2192' },
    havo: { heading: 'S1 afgerond \u2713', subtext: 'Nu leer je over transparantie bij AI-gebruik.', buttonLabel: 'Ga verder \u2192' },
    vwo: { heading: 'S1 afgerond \u2713', subtext: 'Nu verken je transparantie en verantwoording bij AI-gebruik.', buttonLabel: 'Ga verder \u2192' },
  },
  's2-complete': {
    vmbo: { heading: 'S2 klaar \u2713', subtext: 'Nu leer je hoeveel energie AI kost.', buttonLabel: 'Ga verder \u2192' },
    havo: { heading: 'S2 afgerond \u2713', subtext: 'Nu leer je over de duurzaamheid van AI.', buttonLabel: 'Ga verder \u2192' },
    vwo: { heading: 'S2 afgerond \u2713', subtext: 'Nu verken je de ecologische impact van AI-gebruik.', buttonLabel: 'Ga verder \u2192' },
  },
  's-complete': {
    vmbo: { heading: 'Spelregels: klaar! \ud83c\udf89', subtext: 'Je weet nu wat de regels zijn voor AI. Alles af!', buttonLabel: 'Terug naar dashboard \u2192' },
    havo: { heading: 'Spelregels afgerond! \ud83c\udf89', subtext: 'Je kent de spelregels voor AI-gebruik. Alles afgerond!', buttonLabel: 'Terug naar dashboard \u2192' },
    vwo: { heading: 'Spelregels afgerond! \ud83c\udf89', subtext: 'Je beheerst de ethische kaders voor AI-gebruik. Alles afgerond!', buttonLabel: 'Terug naar dashboard \u2192' },
  },
}

export function getTransitionTexts(key: TransitionKey, niveauGroep: NiveauGroep): TransitionTexts {
  return transitionTexts[key][niveauGroep]
}

export type { NiveauGroep, TransitionTexts, TransitionKey }
