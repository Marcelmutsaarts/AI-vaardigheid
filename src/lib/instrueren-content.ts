// I-Module: Instrueren - Content en Data
// Leer hoe je een goede prompt bouwt

import { aiHelptRollen, aiDoetRollen, AIRol } from './kiezen-content'

// Alle 8 rollen gecombineerd voor de I-module
export const alleRollen: AIRol[] = [...aiHelptRollen, ...aiDoetRollen]

// Prompt onderdelen
export interface PromptOnderdeel {
  id: 'rol' | 'context' | 'instructies' | 'voorbeeld'
  nummer: number
  titel: string
  vraag: string // De vraag die de leerling moet beantwoorden
  uitleg: string
  tip: string
  verplicht: boolean
}

export const promptOnderdelen: PromptOnderdeel[] = [
  {
    id: 'rol',
    nummer: 1,
    titel: 'Rol',
    vraag: 'Wie is de AI?',
    uitleg: 'Vertel de AI wie of wat hij moet zijn. Dit helpt de AI om het juiste soort antwoord te geven.',
    tip: 'Begin met: "Je bent een..."',
    verplicht: true,
  },
  {
    id: 'context',
    nummer: 2,
    titel: 'Context',
    vraag: 'Wat moet de AI weten?',
    uitleg: 'Geef de AI de informatie die nodig is om je goed te helpen. Denk aan: over wie gaat het, wat is de situatie, voor wie is het bedoeld?',
    tip: 'Bijvoorbeeld: "Ik zit in 3 havo en werk aan een boekverslag over..."',
    verplicht: true,
  },
  {
    id: 'instructies',
    nummer: 3,
    titel: 'Instructies',
    vraag: 'Wat moet de AI doen?',
    uitleg: 'Vertel de AI precies wat je wilt dat hij doet. Hoe specifieker, hoe beter het resultaat.',
    tip: 'Wees concreet: "Geef me 3 tips", "Schrijf maximaal 100 woorden", "Let op spelling"',
    verplicht: true,
  },
  {
    id: 'voorbeeld',
    nummer: 4,
    titel: 'Voorbeeld',
    vraag: 'Hoe wil je het antwoord?',
    uitleg: 'Laat de AI zien hoe je het antwoord wilt hebben. Dit is handig als je een specifiek format wilt.',
    tip: 'Bijvoorbeeld: "Geef het antwoord in dit format: Titel - Uitleg - Voorbeeld"',
    verplicht: false,
  },
]

// Hints per rol - helpen leerlingen op weg zonder het antwoord te geven
export interface RolHint {
  rolId: string
  rolHint: string // Hint voor het invullen van de rol
  contextHint: string // Hint voor de context
  instructieHint: string // Hint voor instructies
  voorbeeldOpdracht: string // Een voorbeeld schoolopdracht om mee te oefenen
}

export const rolHints: RolHint[] = [
  // AI Helpt rollen
  {
    rolId: 'uitlegger',
    rolHint: 'Denk aan iemand die goed kan uitleggen. Een docent? Een expert? Iemand die geduldig is?',
    contextHint: 'Wat wil je leren? Wat snap je al wel en wat nog niet?',
    instructieHint: 'Hoe wil je dat het uitgelegd wordt? Met voorbeelden? Stap voor stap?',
    voorbeeldOpdracht: 'Je snapt niet hoe fotosynthese werkt voor je biologie toets.',
  },
  {
    rolId: 'brainstormer',
    rolHint: 'Wie is creatief en komt met goede ideeen? Een mede-leerling? Een schrijver?',
    contextHint: 'Waarvoor heb je ideeen nodig? Wat is het onderwerp? Waar moet je rekening mee houden?',
    instructieHint: 'Hoeveel ideeen wil je? Moeten ze origineel zijn? Praktisch uitvoerbaar?',
    voorbeeldOpdracht: 'Je moet een onderwerp kiezen voor je profielwerkstuk maar hebt geen inspiratie.',
  },
  {
    rolId: 'feedbacker',
    rolHint: 'Wie geeft goede feedback? Een strenge docent? Een eerlijke vriend? Een redacteur?',
    contextHint: 'Wat voor tekst/werk is het? Voor welk vak? Wat zijn de eisen?',
    instructieHint: 'Waarop moet de feedback gericht zijn? Inhoud? Structuur? Taal? Alles?',
    voorbeeldOpdracht: 'Je hebt een betoog geschreven en wilt weten wat er beter kan.',
  },
  {
    rolId: 'oefenmaatje',
    rolHint: 'Wie zou je kunnen helpen oefenen? Een gesprekspartner? Een interviewer? Een tegenspeler?',
    contextHint: 'Waarvoor wil je oefenen? Wat is de situatie? Hoe realistisch moet het zijn?',
    instructieHint: 'Hoe moet het oefenen verlopen? Moet de AI moeilijke vragen stellen? Feedback geven?',
    voorbeeldOpdracht: 'Je hebt morgen een sollicitatiegesprek voor je bijbaan en wilt oefenen.',
  },
  // AI Doet rollen
  {
    rolId: 'schrijver',
    rolHint: 'Wat voor schrijver heb je nodig? Formeel? Informeel? Kort en bondig?',
    contextHint: 'Voor wie is de tekst? Wat is de aanleiding? Wat moet erin staan?',
    instructieHint: 'Hoe lang mag de tekst zijn? Welke toon? Welke onderdelen moeten erin?',
    voorbeeldOpdracht: 'Je moet een mail schrijven naar je docent om te vragen of je een toets later mag maken.',
  },
  {
    rolId: 'vertaler',
    rolHint: 'Wat voor vertaler? Een die precies vertaalt? Of een die het natuurlijk laat klinken?',
    contextHint: 'Wat is de brontaal? Doeltaal? Voor wie is de vertaling?',
    instructieHint: 'Moet het formeel of informeel? Letterlijk of vrij vertaald?',
    voorbeeldOpdracht: 'Je moet een Engelse samenvatting maken van je Nederlandse werkstuk.',
  },
  {
    rolId: 'verbeteraar',
    rolHint: 'Wat voor verbeteraar? Iemand die alleen spelfouten pakt? Of ook stijl verbetert?',
    contextHint: 'Wat voor tekst is het? Hoe formeel moet het zijn? Wat zijn de regels?',
    instructieHint: 'Wat moet er verbeterd worden? Alleen spelling? Ook zinsbouw? Interpunctie?',
    voorbeeldOpdracht: 'Je hebt een tekst geschreven maar twijfelt over de spelling en grammatica.',
  },
  {
    rolId: 'samenvatter',
    rolHint: 'Wat voor samenvatter? Kort en krachtig? Of met alle belangrijke details?',
    contextHint: 'Wat is de brontekst? Hoe lang? Wat is het belangrijkste om te behouden?',
    instructieHint: 'Hoe lang mag de samenvatting zijn? In hoeveel punten? Met of zonder eigen woorden?',
    voorbeeldOpdracht: 'Je moet een lang artikel samenvatten voor je presentatie.',
  },
]

// Helper functie om hint te vinden voor een rol
export function getHintVoorRol(rolId: string): RolHint | undefined {
  return rolHints.find(h => h.rolId === rolId)
}

// Helper functie om rol te vinden
export function getRolById(rolId: string): AIRol | undefined {
  return alleRollen.find(r => r.id === rolId)
}

// Niveau-specifieke labels voor de onderdelen
export function getOnderdeelLabel(
  onderdeel: PromptOnderdeel,
  niveau: 'vmbo' | 'havo' | 'vwo'
): { vraag: string; tip: string } {
  // VMBO krijgt simpelere taal
  if (niveau === 'vmbo') {
    switch (onderdeel.id) {
      case 'rol':
        return {
          vraag: 'Wie is de AI?',
          tip: 'Start met: "Je bent een..."'
        }
      case 'context':
        return {
          vraag: 'Wat moet de AI weten?',
          tip: 'Vertel over jezelf, je opdracht, of waar het voor is'
        }
      case 'instructies':
        return {
          vraag: 'Wat moet de AI doen?',
          tip: 'Zeg precies wat je wilt. Hoeveel? Hoe lang? Waarop letten?'
        }
      case 'voorbeeld':
        return {
          vraag: 'Hoe wil je het?',
          tip: 'Laat zien hoe het eruit moet zien'
        }
    }
  }

  // HAVO/VWO gebruiken de standaard labels
  return {
    vraag: onderdeel.vraag,
    tip: onderdeel.tip
  }
}

// Feedback criteria per onderdeel
export interface FeedbackCriterium {
  onderdeel: 'rol' | 'context' | 'instructies' | 'voorbeeld'
  checkVragen: string[] // Wat checkt de AI
}

export const feedbackCriteria: FeedbackCriterium[] = [
  {
    onderdeel: 'rol',
    checkVragen: [
      'Is er een duidelijke rol gedefinieerd?',
      'Past de rol bij wat de leerling wil bereiken?',
      'Is de rol specifiek genoeg?'
    ]
  },
  {
    onderdeel: 'context',
    checkVragen: [
      'Weet de AI genoeg om goed te helpen?',
      'Is duidelijk voor wie of waarvoor het is?',
      'Ontbreekt er belangrijke informatie?'
    ]
  },
  {
    onderdeel: 'instructies',
    checkVragen: [
      'Is duidelijk wat de AI moet doen?',
      'Zijn de instructies specifiek genoeg?',
      'Zijn er concrete eisen (lengte, aantal, format)?'
    ]
  },
  {
    onderdeel: 'voorbeeld',
    checkVragen: [
      'Helpt het voorbeeld om het gewenste format te begrijpen?',
      'Is het voorbeeld duidelijk?'
    ]
  }
]
