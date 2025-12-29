// Content per niveau categorie
export type NiveauCategorie = 'vmbo-1-2' | 'vmbo-3-4' | 'havo-1-3' | 'havo-4-5' | 'vwo-1-3' | 'vwo-4-6'

export function getNiveauCategorie(
  schoolType: 'vmbo' | 'havo' | 'vwo',
  leerjaar: number
): NiveauCategorie {
  if (schoolType === 'vmbo') {
    return leerjaar <= 2 ? 'vmbo-1-2' : 'vmbo-3-4'
  }
  if (schoolType === 'havo') {
    return leerjaar <= 3 ? 'havo-1-3' : 'havo-4-5'
  }
  return leerjaar <= 3 ? 'vwo-1-3' : 'vwo-4-6'
}

// Kiezen Module 1: Wat kan AI wel en niet?
export const kiezenModule1Content: Record<NiveauCategorie, {
  title: string
  intro: string
  sections: Array<{
    heading: string
    content: string
    examples?: string[]
  }>
  exercise: {
    question: string
    options: Array<{ text: string; correct: boolean; feedback: string }>
  }
}> = {
  'vmbo-1-2': {
    title: 'Wat kan AI wel en niet?',
    intro: 'AI is een slimme computer die veel kan, maar niet alles. Laten we kijken wat AI wel en niet kan!',
    sections: [
      {
        heading: 'Wat kan AI WEL?',
        content: 'AI is goed in sommige dingen:',
        examples: [
          '📝 Teksten schrijven en samenvatten',
          '🔍 Informatie opzoeken en uitleggen',
          '💡 Ideeën bedenken',
          '🌍 Vertalen naar andere talen',
          '🎨 Plaatjes maken',
        ],
      },
      {
        heading: 'Wat kan AI NIET?',
        content: 'Maar AI kan niet alles:',
        examples: [
          '❌ Altijd de waarheid vertellen (AI maakt fouten!)',
          '❌ Weten wat er vandaag gebeurt',
          '❌ Jouw mening hebben',
          '❌ Echt begrijpen wat je bedoelt',
          '❌ Je huiswerk beter maken dan jij zelf',
        ],
      },
    ],
    exercise: {
      question: 'Je wilt weten wat je vriendinnen van jouw nieuwe schoenen vinden. Vraag je dat aan AI?',
      options: [
        { text: 'Ja, AI weet alles', correct: false, feedback: 'Nee! AI kent je vriendinnen niet en weet niet wat zij mooi vinden.' },
        { text: 'Nee, dat kan AI niet', correct: true, feedback: 'Goed zo! AI kent je vriendinnen niet. Dit moet je zelf vragen!' },
      ],
    },
  },
  'vmbo-3-4': {
    title: 'Wat kan AI wel en niet?',
    intro: 'AI kan veel, maar heeft ook beperkingen. Het is belangrijk dit te weten voordat je AI gebruikt voor school of stage.',
    sections: [
      {
        heading: 'Waar is AI goed in?',
        content: 'AI kan je helpen met:',
        examples: [
          'Teksten schrijven en verbeteren',
          'Moeilijke onderwerpen uitleggen',
          'Brainstormen over ideeën',
          'Vertalen en samenvatten',
          'Oefenen voor toetsen (door vragen te stellen)',
        ],
      },
      {
        heading: 'Waar is AI NIET goed in?',
        content: 'Hier moet je opletten:',
        examples: [
          'AI maakt regelmatig fouten - check altijd!',
          'AI weet niets over recente gebeurtenissen',
          'AI kan niet creatief denken zoals jij',
          'AI kent jouw specifieke situatie niet',
          'AI vervangt niet jouw eigen vaardigheden',
        ],
      },
    ],
    exercise: {
      question: 'Je moet voor je stage een motivatiebrief schrijven. Hoe gebruik je AI het beste?',
      options: [
        { text: 'AI de hele brief laten schrijven', correct: false, feedback: 'Niet slim! De brief moet over JOU gaan, en AI kent jou niet. Plus: je stagebegeleider merkt dat het niet echt is.' },
        { text: 'Eerst zelf schrijven, dan AI om tips vragen', correct: true, feedback: 'Top! Zo blijft het jouw verhaal, maar krijg je wel hulp om het beter te maken.' },
        { text: 'Geen AI gebruiken', correct: false, feedback: 'AI kan je wel helpen met tips - je hoeft het niet helemaal alleen te doen.' },
      ],
    },
  },
  'havo-1-3': {
    title: 'Wat kan AI wel en niet?',
    intro: 'Kunstmatige intelligentie (AI) is een krachtig hulpmiddel, maar het heeft duidelijke mogelijkheden én beperkingen. Begrijpen wat AI wel en niet kan, helpt je om het effectief in te zetten.',
    sections: [
      {
        heading: 'De mogelijkheden van AI',
        content: 'AI-systemen zoals ChatGPT zijn getraind op enorme hoeveelheden tekst en kunnen:',
        examples: [
          'Teksten genereren, samenvatten en herschrijven',
          'Complexe onderwerpen op verschillende niveaus uitleggen',
          'Helpen bij brainstormen en structureren',
          'Vertalen en grammatica controleren',
          'Vragen beantwoorden over veel onderwerpen',
        ],
      },
      {
        heading: 'De beperkingen van AI',
        content: 'Maar er zijn belangrijke beperkingen:',
        examples: [
          'AI "hallucineert" - het verzint soms informatie die niet klopt',
          'Kennis is niet up-to-date (afhankelijk van trainingsdata)',
          'AI begrijpt context en nuance niet altijd goed',
          'Het kan geen origineel onderzoek doen',
          'AI heeft geen eigen mening of ervaring',
        ],
      },
    ],
    exercise: {
      question: 'Je moet een werkstuk maken over een recent nieuwsonderwerp. Hoe zet je AI het beste in?',
      options: [
        { text: 'AI het hele werkstuk laten schrijven', correct: false, feedback: 'Dit is riskant: AI heeft mogelijk geen actuele informatie en kan fouten maken die jij dan als feit presenteert.' },
        { text: 'AI gebruiken voor de structuur en bronnen zelf checken', correct: true, feedback: 'Slim! AI kan helpen met opzet en uitleg, maar voor actuele informatie moet je betrouwbare bronnen raadplegen.' },
        { text: 'AI helemaal niet gebruiken bij nieuwsonderwerpen', correct: false, feedback: 'AI kan nog steeds helpen met structuur, achtergrondkennis, en het formuleren van je tekst.' },
      ],
    },
  },
  'havo-4-5': {
    title: 'Wat kan AI wel en niet?',
    intro: 'Om AI effectief te gebruiken voor je schoolwerk en examens, moet je begrijpen waar AI sterk in is en waar de valkuilen liggen.',
    sections: [
      {
        heading: 'Sterke punten van AI',
        content: 'Large Language Models (LLMs) zoals GPT zijn getraind op miljarden teksten en excelleren in:',
        examples: [
          'Tekstgeneratie en -bewerking in diverse stijlen',
          'Synthese van informatie uit verschillende bronnen',
          'Uitleg van complexe concepten op maat',
          'Brainstormen en het genereren van alternatieven',
          'Taalkundige taken: vertalen, samenvatten, parafraseren',
        ],
      },
      {
        heading: 'Fundamentele beperkingen',
        content: 'Ondanks hun kracht hebben LLMs belangrijke beperkingen:',
        examples: [
          'Hallucinatie: AI genereert soms plausibel klinkende maar incorrecte informatie',
          'Geen realtime kennis: trainingsdata heeft een cutoff-datum',
          'Geen begrip: AI simuleert begrip maar "begrijpt" niet echt',
          'Bias: trainingsdata bevat vooroordelen die doorwerken',
          'Geen bronverificatie: AI kan bronnen niet echt checken',
        ],
      },
    ],
    exercise: {
      question: 'Voor je profielwerkstuk wil je AI gebruiken. Welke aanpak is het meest verstandig?',
      options: [
        { text: 'AI laten schrijven en zelf alleen de bronnen toevoegen', correct: false, feedback: 'Dit ondermijnt het doel van een PWS: laten zien dat JIJ kunt onderzoeken en analyseren. Bovendien kan AI fouten maken die je dan overneemt.' },
        { text: 'AI als sparringpartner gebruiken voor je onderzoeksopzet', correct: true, feedback: 'Goed! AI kan helpen je ideeën te structureren en kritische vragen te stellen, terwijl het onderzoek en de analyse van jou blijven.' },
        { text: 'AI alleen gebruiken voor spellingcontrole', correct: false, feedback: 'Je mag AI breder inzetten - het kan ook helpen met structuur en feedback. Maar het eigenlijke onderzoek blijft jouw werk.' },
      ],
    },
  },
  'vwo-1-3': {
    title: 'Wat kan AI wel en niet?',
    intro: 'Kunstmatige intelligentie transformeert hoe we werken en leren. Om AI effectief en kritisch te gebruiken, is het essentieel om zowel de capaciteiten als de fundamentele beperkingen te begrijpen.',
    sections: [
      {
        heading: 'Capaciteiten van moderne AI',
        content: 'Grote taalmodellen (Large Language Models) zijn getraind op enorme tekstcorpora en kunnen:',
        examples: [
          'Coherente tekst genereren in diverse genres en stijlen',
          'Complexe informatie synthetiseren en toegankelijk maken',
          'Logische verbanden leggen binnen hun kennisdomein',
          'Creatieve taken uitvoeren zoals brainstormen',
          'Meertalige taken uitvoeren met hoge kwaliteit',
        ],
      },
      {
        heading: 'Fundamentele beperkingen',
        content: 'Ondanks indrukwekkende prestaties kennen LLMs structurele beperkingen:',
        examples: [
          'Hallucinatie: het genereren van plausibele maar feitelijk onjuiste informatie',
          'Temporele beperking: geen toegang tot informatie na de trainingsdatum',
          'Geen werkelijk begrip: patronen herkennen is niet hetzelfde als begrijpen',
          'Inherente bias: vooroordelen in trainingsdata worden gereproduceerd',
          'Geen causaliteit: correlatie wordt niet onderscheiden van oorzakelijkheid',
        ],
      },
    ],
    exercise: {
      question: 'Je wilt AI gebruiken voor een betoog over een filosofisch vraagstuk. Wat is de beste strategie?',
      options: [
        { text: 'AI een volledig betoog laten genereren', correct: false, feedback: 'Een betoog vraagt om jouw argumentatie en standpunt. AI kan helpen met structuur, maar het denken moet van jou komen.' },
        { text: 'AI gebruiken om tegenargumenten te genereren voor je eigen standpunt', correct: true, feedback: 'Uitstekend! Dit versterkt je eigen argumentatie door je te dwingen tegenargumenten te weerleggen - een kernvaardigheid in filosofisch denken.' },
        { text: 'AI vermijden bij filosofische onderwerpen', correct: false, feedback: 'AI kan juist waardevol zijn als sparringpartner bij filosofische vraagstukken, zolang je kritisch blijft.' },
      ],
    },
  },
  'vwo-4-6': {
    title: 'Wat kan AI wel en niet?',
    intro: 'Als voorbereiding op academisch werk is een genuanceerd begrip van AI-capaciteiten en -beperkingen cruciaal. Dit module analyseert zowel de technische mogelijkheden als de epistemologische grenzen van grote taalmodellen.',
    sections: [
      {
        heading: 'Technische capaciteiten',
        content: 'Large Language Models zijn statistisch getraind op tekstuele patronen en demonstreren:',
        examples: [
          'Geavanceerde tekstgeneratie met contextbewustzijn',
          'In-context learning: aanpassing aan nieuwe taken zonder hertraining',
          'Chain-of-thought reasoning: stapsgewijze probleemoplossing',
          'Multimodale verwerking (nieuwere modellen)',
          'Code-generatie en -analyse',
        ],
      },
      {
        heading: 'Epistemologische beperkingen',
        content: 'De fundamentele aard van LLMs brengt structurele beperkingen met zich mee:',
        examples: [
          'Stochastische hallucinatie: plausibiliteit impliceert geen waarheid',
          'Geen grounding: geen directe toegang tot de werkelijkheid',
          'Temporal isolation: kennis bevroren op trainingsmoment',
          'Geen metacognitie: beperkt zelfinzicht in eigen beperkingen',
          'Sycofantie: neiging om gebruikersverwachtingen te bevestigen',
        ],
      },
    ],
    exercise: {
      question: 'Voor je profielwerkstuk overweeg je AI te gebruiken bij je literatuuronderzoek. Welke benadering is academisch het meest verantwoord?',
      options: [
        { text: 'AI laten zoeken naar relevante bronnen en deze overnemen', correct: false, feedback: 'Riskant: AI kan bronnen verzinnen of verkeerd citeren. Academische integriteit vereist dat je bronnen zelf verifieert.' },
        { text: 'AI gebruiken om je zoekstrategie te verfijnen en begrippen te verkennen', correct: true, feedback: 'Dit is een verantwoorde aanpak: AI helpt je denken structureren, maar de academische verificatie blijft bij jou.' },
        { text: 'AI alleen gebruiken voor tekstredactie, niet voor inhoud', correct: false, feedback: 'AI kan ook inhoudelijk waardevol zijn, mits kritisch toegepast. De sleutel is verificatie en transparantie.' },
      ],
    },
  },
}

// Kiezen Module 2: Wanneer kies je voor AI?
export const kiezenModule2Content: Record<NiveauCategorie, {
  title: string
  intro: string
  welAI: { title: string; items: string[] }
  nietAI: { title: string; items: string[] }
  exercise: {
    scenarios: Array<{
      situation: string
      options: Array<{ text: string; correct: boolean; feedback: string }>
    }>
  }
}> = {
  'vmbo-1-2': {
    title: 'Wanneer kies je voor AI?',
    intro: 'Soms is AI handig, maar soms kun je iets beter zelf doen. Hier leer je wanneer je AI kunt gebruiken.',
    welAI: {
      title: 'Wanneer WEL AI? ✅',
      items: [
        'Je wilt ideeën opdoen',
        'Je snapt iets niet en wilt uitleg',
        'Je wilt iets verbeteren dat je zelf hebt gemaakt',
        'Je wilt oefenen met vragen',
      ],
    },
    nietAI: {
      title: 'Wanneer NIET AI? ❌',
      items: [
        'Je moet laten zien wat JIJ kunt',
        'Het is een toets of examen',
        'Je weet niet wat je eigenlijk wilt',
        'Het gaat over je eigen mening',
      ],
    },
    exercise: {
      scenarios: [
        {
          situation: 'Je moet 10 wiskundesommen maken. Mag je AI gebruiken?',
          options: [
            { text: 'Ja', correct: false, feedback: 'Nee! Je moet laten zien dat JIJ de sommen kunt maken. Anders leer je niks!' },
            { text: 'Nee', correct: true, feedback: 'Goed! Sommen moet je zelf maken om te leren. AI mag je wel om uitleg vragen als je iets niet snapt.' },
          ],
        },
        {
          situation: 'Je begrijpt breuken niet. Mag je AI om uitleg vragen?',
          options: [
            { text: 'Ja', correct: true, feedback: 'Ja! AI kan dingen goed uitleggen. Daarna kun je zelf oefenen.' },
            { text: 'Nee', correct: false, feedback: 'AI is juist goed in uitleg geven. Dat mag zeker!' },
          ],
        },
      ],
    },
  },
  'vmbo-3-4': {
    title: 'Wanneer kies je voor AI?',
    intro: 'Bij schoolwerk en stage moet je weten wanneer AI helpt en wanneer het juist niet slim is.',
    welAI: {
      title: 'AI kan helpen bij:',
      items: [
        'Brainstormen over ideeën',
        'Uitleg krijgen over moeilijke onderwerpen',
        'Je eigen tekst verbeteren',
        'Oefenen voor toetsen',
        'Informatie samenvatten',
      ],
    },
    nietAI: {
      title: 'Gebruik geen AI bij:',
      items: [
        'Toetsen en examens',
        'Opdrachten waar je eigen werk moet inleveren',
        'Dingen over jezelf (motivatiebrieven, reflecties)',
        'Als je niet weet wat je eigenlijk zoekt',
      ],
    },
    exercise: {
      scenarios: [
        {
          situation: 'Je moet een stageverslag schrijven over je ervaringen. Gebruik je AI?',
          options: [
            { text: 'Ja, AI schrijft beter', correct: false, feedback: 'Nee! Het verslag gaat over JOUW ervaringen. Die kent AI niet. Schrijf zelf en vraag eventueel om tips.' },
            { text: 'Nee, dit is mijn eigen ervaring', correct: true, feedback: 'Precies! Jouw ervaringen kun je alleen zelf beschrijven. AI kan wel helpen met de spelling of structuur.' },
          ],
        },
        {
          situation: 'Je snapt een theorie voor biologie niet. Vraag je AI om uitleg?',
          options: [
            { text: 'Ja', correct: true, feedback: 'Goed! AI is prima voor uitleg. Check wel of het klopt met je boek.' },
            { text: 'Nee', correct: false, feedback: 'AI kan juist goed uitleggen! Gebruik het om dingen te snappen, dan kun je daarna zelf oefenen.' },
          ],
        },
      ],
    },
  },
  'havo-1-3': {
    title: 'Wanneer kies je voor AI?',
    intro: 'Het bewust kiezen wanneer je AI inzet is een belangrijke vaardigheid. Niet elke taak is geschikt voor AI-ondersteuning.',
    welAI: {
      title: 'AI is geschikt voor:',
      items: [
        'Brainstormen en ideeën genereren',
        'Concepten en theorieën laten uitleggen',
        'Feedback krijgen op je eigen werk',
        'Structuur aanbrengen in je gedachten',
        'Oefenen door vragen te stellen',
      ],
    },
    nietAI: {
      title: 'Vermijd AI bij:',
      items: [
        'Summatieve toetsen en examens',
        'Taken waar je eigen inzicht moet tonen',
        'Persoonlijke reflecties en meningen',
        'Als je de opdracht niet begrijpt',
        'Creatieve opdrachten die originaliteit vereisen',
      ],
    },
    exercise: {
      scenarios: [
        {
          situation: 'Je moet een boekverslag schrijven over een boek dat je hebt gelezen. Hoe gebruik je AI?',
          options: [
            { text: 'AI het verslag laten schrijven', correct: false, feedback: 'Niet doen! Je leraar wil JOUW analyse zien. Als je AI gebruikt, leer je niet kritisch lezen.' },
            { text: 'AI vragen om je eigen analyse te verbeteren', correct: true, feedback: 'Slim! Eerst zelf analyseren, dan AI gebruiken voor feedback op je formulering of structuur.' },
            { text: 'AI vragen om het boek samen te vatten', correct: false, feedback: 'Dit helpt niet - je moet het boek zelf gelezen hebben om een goed verslag te schrijven.' },
          ],
        },
      ],
    },
  },
  'havo-4-5': {
    title: 'Wanneer kies je voor AI?',
    intro: 'Met examens in zicht is het cruciaal om bewust te kiezen wanneer AI je helpt leren en wanneer het je leerdoel ondermijnt.',
    welAI: {
      title: 'Effectief AI-gebruik:',
      items: [
        'Complexe concepten laten uitleggen op jouw niveau',
        'Oefenvragen genereren voor toetsvoorbereiding',
        'Feedback krijgen op oefenwerk',
        'Verbanden leggen tussen onderwerpen',
        'Samenvattingen controleren op volledigheid',
      ],
    },
    nietAI: {
      title: 'AI ondermijnt leren bij:',
      items: [
        'Opgaven waar je zelf moet leren analyseren',
        'Het oefenen van examenvragen (doe ze eerst zelf!)',
        'Taken die originaliteit of eigen perspectief vereisen',
        'Alles wat meetelt voor je cijfer',
      ],
    },
    exercise: {
      scenarios: [
        {
          situation: 'Je bereidt je voor op het examen geschiedenis. Hoe gebruik je AI het beste?',
          options: [
            { text: 'AI antwoorden laten genereren op oude examenvragen', correct: false, feedback: 'Niet effectief! Je leert pas echt door de vragen ZELF te maken. Gebruik AI achteraf om je antwoord te vergelijken.' },
            { text: 'AI gebruiken om historische concepten uit te leggen die je niet snapt', correct: true, feedback: 'Goed! AI kan helpen met begrip, zodat je daarna zelf de examenvragen kunt maken.' },
          ],
        },
      ],
    },
  },
  'vwo-1-3': {
    title: 'Wanneer kies je voor AI?',
    intro: 'Strategisch AI-gebruik vereist dat je onderscheid maakt tussen taken waar AI je versterkt en taken waar het je eigen ontwikkeling belemmert.',
    welAI: {
      title: 'Constructief AI-gebruik:',
      items: [
        'Complexe concepten vanuit meerdere perspectieven verkennen',
        'Kritische vragen genereren over je eigen werk',
        'Verbanden leggen tussen vakgebieden',
        'Argumentatiestructuren analyseren',
        'Academische schrijfstijl oefenen',
      ],
    },
    nietAI: {
      title: 'AI belemmert ontwikkeling bij:',
      items: [
        'Het ontwikkelen van eigen analytisch vermogen',
        'Creatief en oorspronkelijk denken',
        'Het formuleren van eigen standpunten',
        'Summatieve beoordelingsmomenten',
        'Taken die metacognitieve vaardigheden trainen',
      ],
    },
    exercise: {
      scenarios: [
        {
          situation: 'Je schrijft een filosofisch essay over vrije wil. Hoe zet je AI strategisch in?',
          options: [
            { text: 'AI een overzicht van standpunten laten maken', correct: false, feedback: 'Te passief: je moet zelf de filosofische posities doorgronden om er kritisch op te kunnen reflecteren.' },
            { text: 'Je eigen argument formuleren en AI tegenargumenten laten genereren', correct: true, feedback: 'Uitstekend! Dit versterkt je essay: je wordt gedwongen je eigen positie te verdedigen tegen kritiek.' },
          ],
        },
      ],
    },
  },
  'vwo-4-6': {
    title: 'Wanneer kies je voor AI?',
    intro: 'Als voorbereiding op academisch werk moet je een genuanceerde afweging kunnen maken over wanneer AI-assistentie je intellectuele ontwikkeling ondersteunt versus ondermijnt.',
    welAI: {
      title: 'AI als intellectuele sparringpartner:',
      items: [
        'Hypothesen toetsen en tegenargumenten verkennen',
        'Complexe theorieën vanuit verschillende kaders analyseren',
        'Methodologische overwegingen bespreken',
        'Literatuursuggesties genereren (met verificatie)',
        'Feedback op argumentatiestructuur',
      ],
    },
    nietAI: {
      title: 'AI ondermijnt academische vorming bij:',
      items: [
        'Het ontwikkelen van originele onderzoeksvragen',
        'Primair bronnenonderzoek en -analyse',
        'Het formuleren van eigen wetenschappelijke bijdragen',
        'Ethische reflectie waar persoonlijke afweging centraal staat',
        'Werk dat meetelt voor eindexamen of PWS',
      ],
    },
    exercise: {
      scenarios: [
        {
          situation: 'Je werkt aan je profielwerkstuk. Waar in het onderzoeksproces kan AI het meest verantwoord ingezet worden?',
          options: [
            { text: 'Bij het formuleren van je onderzoeksvraag', correct: false, feedback: 'De onderzoeksvraag moet uit JOUW nieuwsgierigheid komen. AI kan helpen verfijnen, maar niet bedenken.' },
            { text: 'Bij het verkennen van theoretische kaders', correct: true, feedback: 'Goed! AI kan helpen theorieën te verkennen, mits je vervolgens de primaire bronnen zelf bestudeert.' },
            { text: 'Bij het schrijven van je conclusie', correct: false, feedback: 'De conclusie moet JOUW analyse weerspiegelen. Dit is het hart van academisch werk.' },
          ],
        },
      ],
    },
  },
}
