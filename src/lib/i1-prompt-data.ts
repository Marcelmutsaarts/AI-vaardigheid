export interface PromptPart {
  id: 'rol' | 'context' | 'instructies' | 'voorbeeld'
  nummer: number
  titel: string
}

export const promptParts: PromptPart[] = [
  { id: 'rol', nummer: 1, titel: 'Rol' },
  { id: 'context', nummer: 2, titel: 'Context' },
  { id: 'instructies', nummer: 3, titel: 'Instructies' },
  { id: 'voorbeeld', nummer: 4, titel: 'Voorbeeld' },
]

// Colors per part (reusing existing app colors)
export const partColors = {
  rol: {
    hover: 'bg-purple-50',
    discovered: 'bg-purple-50',
    active: 'bg-purple-100',
    label: 'text-purple-600',
    border: 'border-purple-200',
  },
  context: {
    hover: 'bg-blue-50',
    discovered: 'bg-blue-50',
    active: 'bg-blue-100',
    label: 'text-blue-600',
    border: 'border-blue-200',
  },
  instructies: {
    hover: 'bg-green-50',
    discovered: 'bg-green-50',
    active: 'bg-green-100',
    label: 'text-green-600',
    border: 'border-green-200',
  },
  voorbeeld: {
    hover: 'bg-yellow-50',
    discovered: 'bg-yellow-50',
    active: 'bg-yellow-100',
    label: 'text-yellow-600',
    border: 'border-yellow-200',
  },
}

type NiveauGroep = 'vmbo' | 'havo' | 'vwo'

function getNiveauGroep(schoolType: string): NiveauGroep {
  if (schoolType === 'vmbo') return 'vmbo'
  if (schoolType === 'mbo' || schoolType === 'havo') return 'havo'
  return 'vwo' // hbo and vwo
}

// Intro text above the prompt
export function getIntroText(schoolType: string): string {
  const groep = getNiveauGroep(schoolType)
  const texts: Record<NiveauGroep, string> = {
    vmbo: 'Deze prompt werkt goed. Er zitten 4 onderdelen in. Beweeg eroverheen om ze te ontdekken.',
    havo: 'Deze prompt werkt goed. Er zitten 4 onderdelen in verborgen. Hover erover om ze te vinden.',
    vwo: 'Deze prompt is effectief. Ontdek de 4 structuurelementen door over de tekst te hoveren.',
  }
  return texts[groep]
}

// The example prompt per level - each returns an object with the 4 parts as strings
export function getPromptTexts(schoolType: string): Record<string, string> {
  const groep = getNiveauGroep(schoolType)

  const prompts: Record<NiveauGroep, Record<string, string>> = {
    vmbo: {
      rol: 'Je bent een aardige leraar Nederlands die dingen simpel uitlegt.',
      context: ' Ik zit in 3 VMBO en ik moet een samenvatting schrijven over het boek dat we lezen. Het moet 1 A4 zijn.',
      instructies: ' Kun je me helpen met een goede opzet voor mijn samenvatting? Zeg ook wat er in elk stukje moet staan.',
      voorbeeld: ' Zet het in een lijstje met korte zinnen.',
    },
    havo: {
      rol: 'Je bent een ervaren docent Nederlands die goed kan uitleggen.',
      context: ' Ik zit in 4 HAVO en schrijf een betoog over social media en jongeren. Het moet tussen de 400 en 600 woorden zijn.',
      instructies: ' Geef me feedback op mijn inleiding. Let vooral op: is de stelling duidelijk? Klopt de opbouw? Geef 3 concrete tips om het te verbeteren.',
      voorbeeld: ' Geef je feedback in dit format: - Wat gaat goed: ... - Tip 1: ... - Tip 2: ... - Tip 3: ...',
    },
    vwo: {
      rol: 'Je bent een kritische universitaire docent academisch schrijven.',
      context: ' Ik zit in 5 VWO en werk aan een profielwerkstuk over de invloed van AI op arbeidsmarkten. De scriptie moet 3000-4000 woorden zijn met minimaal 5 wetenschappelijke bronnen.',
      instructies: ' Analyseer mijn onderzoeksvraag en hypothese. Beoordeel de haalbaarheid, de afbakening en de wetenschappelijke relevantie.',
      voorbeeld: ' Geef je analyse in deze structuur: 1. Sterke punten 2. Zwakke punten 3. Concrete verbetersugesties (max 5)',
    },
  }

  return prompts[groep]
}

// Explanation per part per level (shown in right column)
export function getPartExplanation(partId: string, schoolType: string): { ondertitel: string; uitleg: string } {
  const groep = getNiveauGroep(schoolType)

  const explanations: Record<NiveauGroep, Record<string, { ondertitel: string; uitleg: string }>> = {
    vmbo: {
      rol: {
        ondertitel: 'Wie is de AI?',
        uitleg: 'Zeg tegen de AI wie het moet zijn. Bijvoorbeeld: een leraar, een coach, of een vertaler. Dan weet de AI wat voor antwoord je wilt.',
      },
      context: {
        ondertitel: 'Wat moet de AI weten?',
        uitleg: 'Vertel de AI waar je mee bezig bent. Zoals je klas, het vak, of de opdracht. Hoe meer de AI weet, hoe beter het antwoord.',
      },
      instructies: {
        ondertitel: 'Wat moet de AI doen?',
        uitleg: 'Zeg precies wat de AI moet doen. Niet "help me" maar "geef me 3 tips over...". Hoe duidelijker, hoe beter.',
      },
      voorbeeld: {
        ondertitel: 'Hoe wil je het antwoord?',
        uitleg: 'Laat de AI zien hoe het antwoord eruit moet zien. Bijvoorbeeld: een lijstje, een tabel, of een stuk tekst. Dit is niet verplicht, maar het helpt.',
      },
    },
    havo: {
      rol: {
        ondertitel: 'Wie is de AI?',
        uitleg: 'Vertel de AI wie of wat hij moet zijn. Dit helpt de AI om het juiste soort antwoord te geven.',
      },
      context: {
        ondertitel: 'Wat moet de AI weten?',
        uitleg: 'Geef de AI de informatie die nodig is om je goed te helpen. Denk aan: je niveau, het onderwerp, en de eisen van de opdracht.',
      },
      instructies: {
        ondertitel: 'Wat moet de AI doen?',
        uitleg: 'Geef de AI een duidelijke opdracht. Wees specifiek over wat je wilt: welk soort hulp, waar de AI op moet letten, en hoeveel detail je verwacht.',
      },
      voorbeeld: {
        ondertitel: 'Hoe wil je het antwoord?',
        uitleg: 'Geef een voorbeeld van het gewenste format. Hiermee stuur je de vorm van het antwoord. Dit onderdeel is optioneel maar vaak nuttig.',
      },
    },
    vwo: {
      rol: {
        ondertitel: 'Wie is de AI?',
        uitleg: 'Definieer de rol van de AI. De gekozen rol bepaalt de toon, het detailniveau en de benadering van het antwoord.',
      },
      context: {
        ondertitel: 'Wat moet de AI weten?',
        uitleg: 'Schets de context: je niveau, het onderwerp, randvoorwaarden en eisen. Hoe specifieker de context, hoe relevanter het antwoord.',
      },
      instructies: {
        ondertitel: 'Wat moet de AI doen?',
        uitleg: 'Formuleer een gerichte opdracht. Specificeer het type output, de focus, en eventuele criteria of beperkingen.',
      },
      voorbeeld: {
        ondertitel: 'Hoe wil je het antwoord?',
        uitleg: 'Specificeer het gewenste outputformat met een voorbeeld. Dit geeft de AI een template om te volgen. Optioneel, maar verhoogt de bruikbaarheid.',
      },
    },
  }

  return explanations[groep][partId] || { ondertitel: '', uitleg: '' }
}

// Hint text for the right column when nothing is selected yet
export function getHintText(schoolType: string): string {
  const groep = getNiveauGroep(schoolType)
  const hints: Record<NiveauGroep, string> = {
    vmbo: 'Klik op een gekleurd deel om te zien wat het doet',
    havo: 'Klik op een gekleurd deel om te ontdekken wat het doet',
    vwo: 'Selecteer een structuurelement om de uitleg te bekijken',
  }
  return hints[groep]
}
