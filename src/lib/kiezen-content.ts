// K-Module: Kiezen - Content en Data
// Gebaseerd op Mollick & Mollick (2023) "Assigning AI: Seven Approaches for Students"

export type Aanpak = 'zelf' | 'aihelpt' | 'aidoet'

export interface AanpakInfo {
  id: Aanpak
  emoji: string
  titel: string
  beschrijving: string
}

export const aanpakken: AanpakInfo[] = [
  {
    id: 'zelf',
    emoji: '👤',
    titel: 'Zelf',
    beschrijving: 'Ik doe dit zonder AI',
  },
  {
    id: 'aihelpt',
    emoji: '🤝',
    titel: 'AI helpt',
    beschrijving: 'AI ondersteunt mij',
  },
  {
    id: 'aidoet',
    emoji: '🤖',
    titel: 'AI doet',
    beschrijving: 'AI maakt het, ik check',
  },
]

// Opdracht opties per niveau
export interface OpdrachtOptie {
  id: string
  titel: string
  beschrijving: string
  icon: string
}

export interface NiveauOpdrachten {
  niveau: 'vmbo' | 'havo' | 'vwo'
  leerjaren: number[]
  opties: OpdrachtOptie[]
}

export const opdrachtenPerNiveau: NiveauOpdrachten[] = [
  // VMBO 1-2
  {
    niveau: 'vmbo',
    leerjaren: [1, 2],
    opties: [
      {
        id: 'ziekmelding',
        titel: 'Ziekmelding schrijven',
        beschrijving: 'Schrijf een berichtje aan je baas dat je ziek bent',
        icon: '🤒',
      },
      {
        id: 'klacht',
        titel: 'Klacht indienen',
        beschrijving: 'Schrijf een klacht over een product dat kapot is',
        icon: '📦',
      },
      {
        id: 'uitnodiging',
        titel: 'Uitnodiging maken',
        beschrijving: 'Maak een uitnodiging voor een feestje of evenement',
        icon: '🎉',
      },
    ],
  },
  // VMBO 3-4
  {
    niveau: 'vmbo',
    leerjaren: [3, 4],
    opties: [
      {
        id: 'motivatiebrief',
        titel: 'Motivatiebrief voor stage',
        beschrijving: 'Schrijf een brief waarom jij de beste stagiair bent',
        icon: '💼',
      },
      {
        id: 'verslag',
        titel: 'Verslag van een activiteit',
        beschrijving: 'Schrijf een verslag over iets dat je hebt meegemaakt',
        icon: '📝',
      },
      {
        id: 'instructie',
        titel: 'Instructie schrijven',
        beschrijving: 'Leg stap voor stap uit hoe iets werkt',
        icon: '📋',
      },
    ],
  },
  // HAVO 1-3
  {
    niveau: 'havo',
    leerjaren: [1, 2, 3],
    opties: [
      {
        id: 'boekrecensie',
        titel: 'Boekrecensie',
        beschrijving: 'Schrijf een recensie over een boek dat je hebt gelezen',
        icon: '📚',
      },
      {
        id: 'nieuwsbericht',
        titel: 'Nieuwsbericht',
        beschrijving: 'Schrijf een nieuwsartikel over een actueel onderwerp',
        icon: '📰',
      },
      {
        id: 'blog',
        titel: 'Blogpost',
        beschrijving: 'Schrijf een blog over een onderwerp dat je interesseert',
        icon: '💻',
      },
    ],
  },
  // HAVO 4-5
  {
    niveau: 'havo',
    leerjaren: [4, 5],
    opties: [
      {
        id: 'onderzoeksverslag',
        titel: 'Onderzoeksverslag',
        beschrijving: 'Schrijf een verslag over een onderzoek dat je hebt gedaan',
        icon: '🔬',
      },
      {
        id: 'betoog',
        titel: 'Betoog',
        beschrijving: 'Schrijf een overtuigende tekst over een standpunt',
        icon: '💬',
      },
      {
        id: 'analyse',
        titel: 'Tekstanalyse',
        beschrijving: 'Analyseer een tekst of artikel kritisch',
        icon: '🔍',
      },
    ],
  },
  // VWO 1-3
  {
    niveau: 'vwo',
    leerjaren: [1, 2, 3],
    opties: [
      {
        id: 'informatief',
        titel: 'Informatieve tekst',
        beschrijving: 'Leg een complex onderwerp helder uit',
        icon: '📖',
      },
      {
        id: 'recensie',
        titel: 'Film- of boekrecensie',
        beschrijving: 'Schrijf een onderbouwde recensie',
        icon: '🎬',
      },
      {
        id: 'interview',
        titel: 'Interview uitwerken',
        beschrijving: 'Werk een interview uit tot een artikel',
        icon: '🎤',
      },
    ],
  },
  // VWO 4
  {
    niveau: 'vwo',
    leerjaren: [4],
    opties: [
      {
        id: 'onderzoeksverslag',
        titel: 'Onderzoeksverslag',
        beschrijving: 'Schrijf een wetenschappelijk verslag',
        icon: '🔬',
      },
      {
        id: 'betoog',
        titel: 'Betoog',
        beschrijving: 'Bouw een overtuigend argument op',
        icon: '⚖️',
      },
      {
        id: 'beschouwing',
        titel: 'Beschouwing',
        beschrijving: 'Schrijf een beschouwende tekst over een thema',
        icon: '🤔',
      },
    ],
  },
  // VWO 5-6
  {
    niveau: 'vwo',
    leerjaren: [5, 6],
    opties: [
      {
        id: 'essay',
        titel: 'Essay',
        beschrijving: 'Schrijf een essay over een filosofisch of maatschappelijk vraagstuk',
        icon: '📝',
      },
      {
        id: 'literatuuronderzoek',
        titel: 'Literatuuronderzoek',
        beschrijving: 'Analyseer bronnen en schrijf een overzicht',
        icon: '📚',
      },
      {
        id: 'opiniestuk',
        titel: 'Opiniestuk',
        beschrijving: 'Schrijf een overtuigend opinieartikel voor een krant',
        icon: '📰',
      },
    ],
  },
]

// Helper functie om opdracht opties te vinden voor niveau en leerjaar
export function getOpdrachtenVoorNiveau(niveau: 'vmbo' | 'havo' | 'vwo', leerjaar: number): OpdrachtOptie[] {
  const found = opdrachtenPerNiveau.find(
    (o) => o.niveau === niveau && o.leerjaren.includes(leerjaar)
  )
  return found?.opties || []
}

// K1 AI Menu - Wat kan AI doen?
export interface AIRol {
  id: string
  emoji: string
  titel: string
  beschrijving: string
  voorbeeld: string
  // Gestructureerd voorbeeld voor I-module consistentie
  voorbeeldStructuur?: {
    rol: string
    context: string
    instructies: string
  }
}

export const aiHelptRollen: AIRol[] = [
  {
    id: 'uitlegger',
    emoji: '🎓',
    titel: 'Uitlegger',
    beschrijving: 'AI legt iets uit dat je niet snapt',
    voorbeeld: 'Je bent een geduldige docent biologie. Ik zit in 2 havo en snap fotosynthese niet goed voor mijn toets. Leg uit wat fotosynthese is in simpele stappen.',
    voorbeeldStructuur: {
      rol: 'Je bent een geduldige docent biologie.',
      context: 'Ik zit in 2 havo en snap fotosynthese niet goed voor mijn toets.',
      instructies: 'Leg uit wat fotosynthese is in simpele stappen.'
    }
  },
  {
    id: 'brainstormer',
    emoji: '💡',
    titel: 'Brainstormer',
    beschrijving: 'AI helpt je ideeën bedenken',
    voorbeeld: 'Je bent een creatieve denker die goed is in brainstormen. Ik moet een werkstuk maken voor geschiedenis over de Tweede Wereldoorlog. Geef me 5 originele invalshoeken waar ik over zou kunnen schrijven.',
    voorbeeldStructuur: {
      rol: 'Je bent een creatieve denker die goed is in brainstormen.',
      context: 'Ik moet een werkstuk maken voor geschiedenis over de Tweede Wereldoorlog.',
      instructies: 'Geef me 5 originele invalshoeken waar ik over zou kunnen schrijven.'
    }
  },
  {
    id: 'feedbacker',
    emoji: '💬',
    titel: 'Feedbacker',
    beschrijving: 'AI geeft feedback op jouw werk',
    voorbeeld: 'Je bent een strenge maar eerlijke docent Nederlands. Ik heb een betoog geschreven over social media voor school (500 woorden, onderbouw havo). Geef feedback op mijn inleiding. Let op: is mijn stelling duidelijk? Geef 3 concrete verbeterpunten.',
    voorbeeldStructuur: {
      rol: 'Je bent een strenge maar eerlijke docent Nederlands.',
      context: 'Ik heb een betoog geschreven over social media voor school (500 woorden, onderbouw havo).',
      instructies: 'Geef feedback op mijn inleiding. Let op: is mijn stelling duidelijk? Geef 3 concrete verbeterpunten.'
    }
  },
  {
    id: 'oefenmaatje',
    emoji: '🎭',
    titel: 'Oefenmaatje',
    beschrijving: 'AI oefent met je of speelt een rol',
    voorbeeld: 'Je bent de manager van een supermarkt waar ik solliciteer voor een bijbaan. Ik ben een leerling van 15 jaar zonder werkervaring. Stel me 5 sollicitatievragen en geef na elk antwoord korte feedback.',
    voorbeeldStructuur: {
      rol: 'Je bent de manager van een supermarkt waar ik solliciteer voor een bijbaan.',
      context: 'Ik ben een leerling van 15 jaar zonder werkervaring.',
      instructies: 'Stel me 5 sollicitatievragen en geef na elk antwoord korte feedback.'
    }
  },
]

export const aiDoetRollen: AIRol[] = [
  {
    id: 'schrijver',
    emoji: '✍️',
    titel: 'Schrijver',
    beschrijving: 'AI schrijft een tekst voor je',
    voorbeeld: 'Je bent een behulpzame schrijfassistent. Ik zit in 3 VWO en was ziek tijdens een toets. De docent heet meneer Jansen. Schrijf een korte, nette mail om te vragen of ik de toets later mag maken. Houd het onder de 100 woorden.',
    voorbeeldStructuur: {
      rol: 'Je bent een behulpzame schrijfassistent.',
      context: 'Ik zit in 3 VWO en was ziek tijdens een toets. De docent heet meneer Jansen.',
      instructies: 'Schrijf een korte, nette mail om te vragen of ik de toets later mag maken. Houd het onder de 100 woorden.'
    }
  },
  {
    id: 'vertaler',
    emoji: '🌍',
    titel: 'Vertaler',
    beschrijving: 'AI vertaalt tekst naar een andere taal',
    voorbeeld: 'Je bent een professionele vertaler Nederlands-Engels. Ik moet een formele mail naar een Engelse uitwisselingsschool sturen. Vertaal deze tekst naar goed Engels: "Beste meneer, Ik wil graag een afspraak maken om mijn presentatie te bespreken. Heeft u volgende week tijd?"',
    voorbeeldStructuur: {
      rol: 'Je bent een professionele vertaler Nederlands-Engels.',
      context: 'Ik moet een formele mail naar een Engelse uitwisselingsschool sturen.',
      instructies: 'Vertaal deze tekst naar goed Engels: "Beste meneer, Ik wil graag een afspraak maken om mijn presentatie te bespreken. Heeft u volgende week tijd?"'
    }
  },
  {
    id: 'verbeteraar',
    emoji: '✨',
    titel: 'Verbeteraar',
    beschrijving: 'AI verbetert spelling en zinnen',
    voorbeeld: 'Je bent een nauwkeurige tekstverbeteraar. Dit is een stukje uit mijn schoolverslag voor Nederlands. Verbeter alleen de spelling en grammatica, verander de inhoud niet: "Ik heb gister een hele leuke film gekijkt. Het was egt spannend en ik kon nie stoppen met kijke."',
    voorbeeldStructuur: {
      rol: 'Je bent een nauwkeurige tekstverbeteraar.',
      context: 'Dit is een stukje uit mijn schoolverslag voor Nederlands.',
      instructies: 'Verbeter alleen de spelling en grammatica, verander de inhoud niet: "Ik heb gister een hele leuke film gekijkt. Het was egt spannend en ik kon nie stoppen met kijke."'
    }
  },
  {
    id: 'samenvatter',
    emoji: '📋',
    titel: 'Samenvatter',
    beschrijving: 'AI maakt een korte samenvatting',
    voorbeeld: 'Je bent een beknopte samenvatter. Ik moet deze tekst over fotosynthese begrijpen voor mijn biologietoets. Vat deze tekst samen in precies 3 korte zinnen: "Fotosynthese is het proces waarbij planten zonlicht gebruiken om energie te maken. Ze nemen koolstofdioxide op uit de lucht en water uit de grond. Met behulp van chlorofyl in hun bladeren zetten ze dit om in glucose en zuurstof. De glucose gebruiken planten als brandstof om te groeien."',
    voorbeeldStructuur: {
      rol: 'Je bent een beknopte samenvatter.',
      context: 'Ik moet deze tekst over fotosynthese begrijpen voor mijn biologietoets.',
      instructies: 'Vat deze tekst samen in precies 3 korte zinnen: "Fotosynthese is het proces..."'
    }
  },
]

// Wat AI NIET kan
export const aiKanNiet = [
  'Je gedachten lezen',
  'De toekomst voorspellen',
  'Altijd de waarheid vertellen',
  'Jouw mening vormen',
  'Weten wat jij hebt meegemaakt',
]

// K2 Herkenoefening scenarios
export interface HerkenScenario {
  id: string
  situatie: string
  correcteAanpak: Aanpak
  uitleg: string
}

export const k2Scenarios: Record<'vmbo' | 'havo' | 'vwo', HerkenScenario[]> = {
  vmbo: [
    {
      id: 's1',
      situatie: 'Je wilt weten of je een tekst echt begrijpt. Je legt het uit aan AI en kijkt of AI het snapt.',
      correcteAanpak: 'nadenken',
      uitleg: 'Je gebruikt AI om je eigen begrip te testen - dat is "nadenken".',
    },
    {
      id: 's2',
      situatie: 'Je laat AI je spelling checken.',
      correcteAanpak: 'uitbesteden',
      uitleg: 'Je laat AI een taak doen - dat is "uitbesteden".',
    },
    {
      id: 's3',
      situatie: 'Je weet niet hoe je moet beginnen met je werkstuk. Je vraagt AI om ideeën.',
      correcteAanpak: 'opgang',
      uitleg: 'Je gebruikt AI om op gang te komen met ideeën - dat is "op gang komen".',
    },
  ],
  havo: [
    {
      id: 's1',
      situatie: 'Je oefent een sollicitatiegesprek met AI voordat je het echte gesprek hebt.',
      correcteAanpak: 'oefenen',
      uitleg: 'Je gebruikt AI om te oefenen in een veilige situatie - dat is "oefenen".',
    },
    {
      id: 's2',
      situatie: 'Je hebt een standpunt en vraagt AI om tegenargumenten te geven zodat je je eigen argumenten kunt versterken.',
      correcteAanpak: 'nadenken',
      uitleg: 'Je gebruikt AI om je eigen ideeën aan te scherpen - dat is "nadenken".',
    },
    {
      id: 's3',
      situatie: 'Je wilt leren rekenen en besluit de sommen zelf te maken, zonder AI.',
      correcteAanpak: 'zelf',
      uitleg: 'Je kiest bewust om zonder AI te werken om te leren - dat is "zelf".',
    },
  ],
  vwo: [
    {
      id: 's1',
      situatie: 'Je vraagt AI om een complex filosofisch concept uit te leggen en stelt vervolgvragen tot je het begrijpt.',
      correcteAanpak: 'nadenken',
      uitleg: 'Je gebruikt AI als denkpartner om iets te doorgronden - dat is "nadenken".',
    },
    {
      id: 's2',
      situatie: 'Je hebt writer\'s block. Je vraagt AI om drie mogelijke openingszinnen, kiest er één en schrijft zelf verder.',
      correcteAanpak: 'opgang',
      uitleg: 'Je gebruikt AI om over een drempel te komen - dat is "op gang komen".',
    },
    {
      id: 's3',
      situatie: 'Je simuleert een debat met AI waarbij AI de tegenpartij speelt.',
      correcteAanpak: 'oefenen',
      uitleg: 'Je gebruikt AI om een situatie te simuleren en te oefenen - dat is "oefenen".',
    },
  ],
}

// Reflectievragen voor K3
export const reflectieVragen: Record<'vmbo' | 'havo' | 'vwo', string[]> = {
  vmbo: [
    'Welke keuze vond je het makkelijkst?',
    'Is er een stap waar je anders had kunnen kiezen?',
    'Bij welke stap ben je het meest benieuwd hoe het uitpakt?',
  ],
  havo: [
    'Past elke keuze bij wat je wilt bereiken?',
    'Zijn er stappen waar je achteraf een ander doel zou kiezen?',
    'Welke combinatie van aanpakken werkt het beste voor jou?',
  ],
  vwo: [
    'Hoe beïnvloedt je keuze per subtaak het eindresultaat?',
    'Bij welke stappen is het leereffect het belangrijkst?',
    'Hoe zou je je keuzes verantwoorden tegenover een docent?',
  ],
}
