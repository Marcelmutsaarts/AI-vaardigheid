// K-Module: Kiezen - Content en Data
// Gebaseerd op Mollick & Mollick (2023) "Assigning AI: Seven Approaches for Students"

// Type voor K2 stappen (3-weg: zelf, AI helpt met sub-rollen, AI doet met sub-rollen)
export type Aanpak = 'zelf' | 'aihelpt' | 'aidoet'

// Type voor de 5 aanpak-categorieën in herkenoefeningen
export type AanpakCategorie = 'zelf' | 'nadenken' | 'opgang' | 'oefenen' | 'uitbesteden'

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
  niveau: 'vmbo' | 'havo' | 'vwo' | 'mbo' | 'hbo'
  leerjaren: number[] | null // null voor mbo/hbo (geen leerjaar-differentiatie)
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
  // MBO
  {
    niveau: 'mbo',
    leerjaren: null,
    opties: [
      {
        id: 'stageverslag',
        titel: 'Stageverslag',
        beschrijving: 'Schrijf een verslag over je stage-ervaringen',
        icon: '📋',
      },
      {
        id: 'sollicitatiebrief',
        titel: 'Sollicitatiebrief',
        beschrijving: 'Schrijf een overtuigende sollicitatiebrief',
        icon: '💼',
      },
      {
        id: 'handleiding',
        titel: 'Werkinstructie',
        beschrijving: 'Schrijf een duidelijke instructie voor een werkproces',
        icon: '📝',
      },
    ],
  },
  // HBO
  {
    niveau: 'hbo',
    leerjaren: null,
    opties: [
      {
        id: 'onderzoeksvoorstel',
        titel: 'Onderzoeksvoorstel',
        beschrijving: 'Schrijf een voorstel voor een praktijkgericht onderzoek',
        icon: '🔬',
      },
      {
        id: 'reflectieverslag',
        titel: 'Reflectieverslag',
        beschrijving: 'Reflecteer op je professionele ontwikkeling',
        icon: '🪞',
      },
      {
        id: 'adviesrapport',
        titel: 'Adviesrapport',
        beschrijving: 'Schrijf een onderbouwd advies voor een opdrachtgever',
        icon: '📊',
      },
    ],
  },
]

// Helper functie om opdracht opties te vinden voor niveau en leerjaar
export function getOpdrachtenVoorNiveau(niveau: 'vmbo' | 'havo' | 'vwo' | 'mbo' | 'hbo', leerjaar: number | null): OpdrachtOptie[] {
  // MBO/HBO hebben geen leerjaar
  if (niveau === 'mbo' || niveau === 'hbo') {
    const found = opdrachtenPerNiveau.find((o) => o.niveau === niveau)
    return found?.opties || []
  }
  // VO heeft leerjaar
  const found = opdrachtenPerNiveau.find(
    (o) => o.niveau === niveau && o.leerjaren?.includes(leerjaar as number)
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
  // MBO/HBO specifieke voorbeelden (optioneel)
  voorbeeldMBO?: string
  voorbeeldHBO?: string
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
    voorbeeld: 'Je bent een geduldige docent biologie. Ik zit in {leerjaar} {schoolType} en snap fotosynthese niet goed voor mijn toets. Leg uit wat fotosynthese is in simpele stappen.',
    voorbeeldMBO: 'Je bent een ervaren praktijkbegeleider. Ik zit op het MBO en snap niet goed hoe ik klachtgesprekken moet voeren op mijn stage. Leg uit wat de belangrijkste stappen zijn bij het afhandelen van een klacht.',
    voorbeeldHBO: 'Je bent een onderzoeksdocent. Ik studeer HBO en snap het verschil tussen kwalitatief en kwantitatief onderzoek niet goed. Leg uit wanneer je welke methode gebruikt, met praktijkvoorbeelden.',
    voorbeeldStructuur: {
      rol: 'Je bent een geduldige docent biologie.',
      context: 'Ik zit in {leerjaar} {schoolType} en snap fotosynthese niet goed voor mijn toets.',
      instructies: 'Leg uit wat fotosynthese is in simpele stappen.'
    }
  },
  {
    id: 'brainstormer',
    emoji: '💡',
    titel: 'Brainstormer',
    beschrijving: 'AI helpt je ideeën bedenken',
    voorbeeld: 'Je bent een creatieve denker die goed is in brainstormen. Ik zit in {leerjaar} {schoolType} en moet een werkstuk maken voor geschiedenis over de Tweede Wereldoorlog. Geef me 5 originele invalshoeken waar ik over zou kunnen schrijven.',
    voorbeeldMBO: 'Je bent een creatieve denker die goed is in brainstormen. Ik zit op het MBO en moet een stageverslag schrijven over mijn leerervaringen. Geef me 5 interessante thema\'s of situaties waar ik over zou kunnen schrijven.',
    voorbeeldHBO: 'Je bent een creatieve denker die goed is in brainstormen. Ik studeer HBO en moet een onderzoeksvoorstel schrijven voor een praktijkgericht onderzoek. Geef me 5 mogelijke onderzoeksvragen binnen het thema duurzaamheid.',
    voorbeeldStructuur: {
      rol: 'Je bent een creatieve denker die goed is in brainstormen.',
      context: 'Ik zit in {leerjaar} {schoolType} en moet een werkstuk maken voor geschiedenis over de Tweede Wereldoorlog.',
      instructies: 'Geef me 5 originele invalshoeken waar ik over zou kunnen schrijven.'
    }
  },
  {
    id: 'feedbacker',
    emoji: '💬',
    titel: 'Feedbacker',
    beschrijving: 'AI geeft feedback op jouw werk',
    voorbeeld: 'Je bent een strenge maar eerlijke docent Nederlands. Ik zit in {leerjaar} {schoolType} en heb een betoog geschreven over social media (500 woorden). Geef feedback op mijn inleiding. Let op: is mijn stelling duidelijk? Geef 3 concrete verbeterpunten.',
    voorbeeldMBO: 'Je bent een ervaren stagebegeleider. Ik zit op het MBO en heb een sollicitatiebrief geschreven voor een stageplek. Geef feedback op mijn brief. Let op: kom ik professioneel over? Geef 3 concrete verbeterpunten.',
    voorbeeldHBO: 'Je bent een onderzoeksbegeleider. Ik studeer HBO en heb de inleiding van mijn onderzoeksvoorstel geschreven. Geef feedback op mijn probleemstelling en onderzoeksvraag. Let op: is het praktijkgericht genoeg? Geef 3 concrete verbeterpunten.',
    voorbeeldStructuur: {
      rol: 'Je bent een strenge maar eerlijke docent Nederlands.',
      context: 'Ik zit in {leerjaar} {schoolType} en heb een betoog geschreven over social media (500 woorden).',
      instructies: 'Geef feedback op mijn inleiding. Let op: is mijn stelling duidelijk? Geef 3 concrete verbeterpunten.'
    }
  },
  {
    id: 'oefenmaatje',
    emoji: '🎭',
    titel: 'Oefenmaatje',
    beschrijving: 'AI oefent met je of speelt een rol',
    voorbeeld: 'Je bent de manager van een supermarkt waar ik solliciteer voor een bijbaan. Ik zit in {leerjaar} {schoolType} en heb geen werkervaring. Stel me 5 sollicitatievragen en geef na elk antwoord korte feedback.',
    voorbeeldMBO: 'Je bent een boze klant die een klacht heeft over een product. Ik zit op het MBO en oefen voor mijn stage in de detailhandel. Speel de klant en geef na mijn reacties feedback of ik het goed aanpak.',
    voorbeeldHBO: 'Je bent een opdrachtgever uit het bedrijfsleven. Ik studeer HBO en moet mijn onderzoeksvoorstel pitchen. Stel kritische vragen over de haalbaarheid en relevantie, en geef na mijn antwoorden feedback.',
    voorbeeldStructuur: {
      rol: 'Je bent de manager van een supermarkt waar ik solliciteer voor een bijbaan.',
      context: 'Ik zit in {leerjaar} {schoolType} en heb geen werkervaring.',
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
    voorbeeld: 'Je bent een behulpzame schrijfassistent. Ik zit in {leerjaar} {schoolType} en was ziek tijdens een toets. De docent heet meneer Jansen. Schrijf een korte, nette mail om te vragen of ik de toets later mag maken. Houd het onder de 100 woorden.',
    voorbeeldMBO: 'Je bent een behulpzame schrijfassistent. Ik zit op het MBO en moet mijn stagebegeleider laten weten dat ik volgende week een dag niet kan komen vanwege een schooldag. Schrijf een korte, professionele mail. Houd het onder de 100 woorden.',
    voorbeeldHBO: 'Je bent een behulpzame schrijfassistent. Ik studeer HBO en wil een opdrachtgever bedanken voor het interview dat ik mocht afnemen voor mijn onderzoek. Schrijf een korte, professionele bedankmail. Houd het onder de 100 woorden.',
    voorbeeldStructuur: {
      rol: 'Je bent een behulpzame schrijfassistent.',
      context: 'Ik zit in {leerjaar} {schoolType} en was ziek tijdens een toets. De docent heet meneer Jansen.',
      instructies: 'Schrijf een korte, nette mail om te vragen of ik de toets later mag maken. Houd het onder de 100 woorden.'
    }
  },
  {
    id: 'vertaler',
    emoji: '🌍',
    titel: 'Vertaler',
    beschrijving: 'AI vertaalt tekst naar een andere taal',
    voorbeeld: 'Je bent een professionele vertaler Nederlands-Engels. Ik zit in {leerjaar} {schoolType} en moet een formele mail naar een Engelse uitwisselingsschool sturen. Vertaal deze tekst naar goed Engels: "Beste meneer, Ik wil graag een afspraak maken om mijn presentatie te bespreken. Heeft u volgende week tijd?"',
    voorbeeldMBO: 'Je bent een professionele vertaler Nederlands-Engels. Ik zit op het MBO en werk bij een bedrijf met internationale klanten. Vertaal deze tekst naar goed Engels: "Beste klant, Uw bestelling is verzonden. U ontvangt deze binnen 3 werkdagen. Met vriendelijke groet."',
    voorbeeldHBO: 'Je bent een professionele vertaler Engels-Nederlands. Ik studeer HBO en moet deze Engelse abstract van een wetenschappelijk artikel vertalen voor mijn literatuuronderzoek: "This study examines the impact of remote work on employee productivity. Results indicate a significant increase in output."',
    voorbeeldStructuur: {
      rol: 'Je bent een professionele vertaler Nederlands-Engels.',
      context: 'Ik zit in {leerjaar} {schoolType} en moet een formele mail naar een Engelse uitwisselingsschool sturen.',
      instructies: 'Vertaal deze tekst naar goed Engels: "Beste meneer, Ik wil graag een afspraak maken om mijn presentatie te bespreken. Heeft u volgende week tijd?"'
    }
  },
  {
    id: 'verbeteraar',
    emoji: '✨',
    titel: 'Verbeteraar',
    beschrijving: 'AI verbetert spelling en zinnen',
    voorbeeld: 'Je bent een nauwkeurige tekstverbeteraar. Dit is een stukje uit mijn schoolverslag voor {schoolType}. Verbeter alleen de spelling en grammatica, verander de inhoud niet: "Ik heb gister een hele leuke film gekijkt. Het was egt spannend en ik kon nie stoppen met kijke."',
    voorbeeldMBO: 'Je bent een nauwkeurige tekstverbeteraar. Dit is een stukje uit mijn stageverslag voor het MBO. Verbeter alleen de spelling en grammatica, verander de inhoud niet: "Op mijn stage heb ik veel geleerd over klantcontakt. Ik vondt het lastig in het begin maar nu gaat het beter."',
    voorbeeldHBO: 'Je bent een nauwkeurige tekstverbeteraar. Dit is een stukje uit mijn onderzoeksverslag voor het HBO. Verbeter alleen de spelling en grammatica, verander de inhoud niet: "De resultaten laten zien dat er een positieve correlatie is. Dit is in lijn met wat wij verwachte op basis van de theorie."',
    voorbeeldStructuur: {
      rol: 'Je bent een nauwkeurige tekstverbeteraar.',
      context: 'Dit is een stukje uit mijn schoolverslag voor {schoolType}.',
      instructies: 'Verbeter alleen de spelling en grammatica, verander de inhoud niet: "Ik heb gister een hele leuke film gekijkt. Het was egt spannend en ik kon nie stoppen met kijke."'
    }
  },
  {
    id: 'samenvatter',
    emoji: '📋',
    titel: 'Samenvatter',
    beschrijving: 'AI maakt een korte samenvatting',
    voorbeeld: 'Je bent een beknopte samenvatter. Ik zit in {leerjaar} {schoolType} en moet deze tekst over fotosynthese begrijpen voor mijn biologietoets. Vat deze tekst samen in precies 3 korte zinnen: "Fotosynthese is het proces waarbij planten zonlicht gebruiken om energie te maken. Ze nemen koolstofdioxide op uit de lucht en water uit de grond. Met behulp van chlorofyl in hun bladeren zetten ze dit om in glucose en zuurstof. De glucose gebruiken planten als brandstof om te groeien."',
    voorbeeldMBO: 'Je bent een beknopte samenvatter. Ik zit op het MBO en moet dit stuk uit een werkprocesbeschrijving onthouden. Vat samen in precies 3 korte zinnen: "Bij het aannemen van een klacht moet je eerst de klant laten uitpraten. Toon begrip en herhaal het probleem. Bied een oplossing aan en vraag of de klant tevreden is. Noteer de klacht in het systeem."',
    voorbeeldHBO: 'Je bent een beknopte samenvatter. Ik studeer HBO en moet dit theoretisch kader samenvatten voor mijn onderzoek. Vat samen in precies 3 korte zinnen: "Intrinsieke motivatie verwijst naar gedrag dat voortkomt uit interne beloningen. Volgens de zelfdeterminatietheorie zijn autonomie, competentie en verbondenheid de drie basisbehoeften. Wanneer deze behoeften vervuld worden, neemt de intrinsieke motivatie toe."',
    voorbeeldStructuur: {
      rol: 'Je bent een beknopte samenvatter.',
      context: 'Ik zit in {leerjaar} {schoolType} en moet deze tekst over fotosynthese begrijpen voor mijn biologietoets.',
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
  correcteAanpak: AanpakCategorie
  uitleg: string
}

export const k2Scenarios: Record<'vmbo' | 'havo' | 'vwo' | 'mbo' | 'hbo', HerkenScenario[]> = {
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
  mbo: [
    {
      id: 's1',
      situatie: 'Je oefent een klantgesprek met AI voordat je een echte klacht moet afhandelen op je stage.',
      correcteAanpak: 'oefenen',
      uitleg: 'Je gebruikt AI om een praktijksituatie te oefenen - dat is "oefenen".',
    },
    {
      id: 's2',
      situatie: 'Je laat AI een werkbriefje schrijven voor je collega.',
      correcteAanpak: 'uitbesteden',
      uitleg: 'Je laat AI de taak uitvoeren - dat is "uitbesteden".',
    },
    {
      id: 's3',
      situatie: 'Je weet niet hoe je je stageverslag moet beginnen. Je vraagt AI om een opzet met kopjes.',
      correcteAanpak: 'opgang',
      uitleg: 'Je gebruikt AI om op gang te komen - dat is "op gang komen".',
    },
  ],
  hbo: [
    {
      id: 's1',
      situatie: 'Je bespreekt je onderzoeksvraag met AI en stelt kritische vervolgvragen om je vraag aan te scherpen.',
      correcteAanpak: 'nadenken',
      uitleg: 'Je gebruikt AI als sparringpartner om je ideeën te toetsen - dat is "nadenken".',
    },
    {
      id: 's2',
      situatie: 'Je laat AI een literatuurlijst omzetten naar APA-stijl.',
      correcteAanpak: 'uitbesteden',
      uitleg: 'Je laat AI een administratieve taak uitvoeren - dat is "uitbesteden".',
    },
    {
      id: 's3',
      situatie: 'Je zit vast bij je adviesrapport. Je vraagt AI om drie mogelijke structuren en kiest er zelf één.',
      correcteAanpak: 'opgang',
      uitleg: 'Je gebruikt AI om over een drempel te komen - dat is "op gang komen".',
    },
  ],
}

// Reflectievragen voor K3
export const reflectieVragen: Record<'vmbo' | 'havo' | 'vwo' | 'mbo' | 'hbo', string[]> = {
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
  mbo: [
    'Past elke keuze bij wat je nodig hebt op stage of werk?',
    'Welke stappen zou je anders aanpakken als je meer tijd had?',
    'Hoe zou je je keuzes uitleggen aan je stagebegeleider?',
  ],
  hbo: [
    'Hoe verantwoord je deze aanpak professioneel?',
    'Bij welke stappen is je eigen inbreng het belangrijkst?',
    'Hoe draagt deze aanpak bij aan je professionele ontwikkeling?',
  ],
}
