// E-Module: Evalueren - Content en Data
// Leer de output van AI kritisch te beoordelen

// De drie AI-valkuilen
export interface AIValkuil {
  id: 'bias' | 'hallucinatie' | 'sycofantie'
  titel: string
  korteNaam: string // Voor UI
  emoji: string
  uitleg: string
  uitlegKort: string // Voor na de oefening
  gevaar: string
  tip: string
}

export const aiValkuilen: AIValkuil[] = [
  {
    id: 'bias',
    titel: 'Vooroordelen',
    korteNaam: 'Vooroordelen',
    emoji: '🎭',
    uitleg: 'AI leert van teksten op internet. Daarin zitten vaak stereotypen over mensen. Die neemt de AI over zonder na te denken.',
    uitlegKort: 'AI neemt stereotypen over uit trainingsdata.',
    gevaar: 'Je krijgt een eenzijdig beeld dat niet klopt met de werkelijkheid.',
    tip: 'Vraag jezelf af: maakt de AI aannames over mensen? Zou dit ook anders kunnen?'
  },
  {
    id: 'hallucinatie',
    titel: 'Verzinsels',
    korteNaam: 'Verzinsels',
    emoji: '🌀',
    uitleg: 'AI weet niet echt iets - het voorspelt alleen welk woord waarschijnlijk volgt. Soms klinkt iets logisch, maar is het compleet verzonnen.',
    uitlegKort: 'AI verzint soms "feiten" die niet bestaan.',
    gevaar: 'Je neemt foute informatie over en maakt daar fouten mee.',
    tip: 'Check feiten altijd bij een betrouwbare bron. Google het, of vraag het aan iemand die het weet.'
  },
  {
    id: 'sycofantie',
    titel: 'De ja-knikker',
    korteNaam: 'Ja-knikker',
    emoji: '🪞',
    uitleg: 'AI is getraind om behulpzaam te zijn. Daardoor heeft het de neiging om je gelijk te geven, ook als je ongelijk hebt.',
    uitlegKort: 'AI geeft je graag gelijk, ook als je fout zit.',
    gevaar: 'Je denkt dat je gelijk hebt, terwijl dat niet zo is. Je leert niks nieuws.',
    tip: 'Vraag de AI expliciet om tegenargumenten. Of vraag: "Wat klopt er niet aan mijn redenering?"'
  }
]

// Voorbeelden van bias voor verschillende interesses
export interface BiasVoorbeeld {
  interesse: string
  biasTypeA: string // Gender bias
  biasTypeB: string // Culturele bias
}

// Helper functie om valkuil te vinden
export function getValkuilById(id: string): AIValkuil | undefined {
  return aiValkuilen.find(v => v.id === id)
}

// Prompt templates voor de oefeningen
export const evalueerPrompts = {
  // Bias oefening - genereert verhaal met OVERDUIDELIJKE gender stereotypen
  bias: (interesses: string, niveau: string) => `Je schrijft een kort verhaal voor een les over AI-bias herkennen.

INTERESSES: ${interesses}

TAAK: Schrijf een verhaal van 40-50 woorden met een OVERDUIDELIJK gender-stereotype.

BELANGRIJKE REGELS:
1. Kies een gender op basis van het stereotype (voetbal/gamen = jongen, paarden/dansen = meisje)
2. Voeg een ZIN toe die het stereotype EXPLICIET maakt, bijvoorbeeld:
   - "Zoals alle jongens hield hij van..."
   - "Net als andere meisjes was zij dol op..."
   - "Typisch voor een jongen..."
   - "Als echte meid..."
3. Maak het stereotype OVERDREVEN duidelijk zodat leerlingen het makkelijk kunnen spotten

VOORBEELD voor "voetbal, koken":
"Zoals veel jongens was Tim dol op voetbal. Na school rende hij direct naar het veld. Typisch voor een jongen droomde hij van het Nederlands elftal. Koken deed hij ook graag, maar dat vertelde hij niet aan zijn vrienden."

Schrijf ALLEEN het verhaal, geen uitleg. Maak het ${niveau === 'vmbo' ? 'simpel' : 'helder'}.`,

  // Hallucinatie oefening - genereert feiten waarvan 1 fout is
  hallucinatie: (interesse: string, niveau: string) => `Je bent een AI die feiten geeft voor een educatieve oefening over AI-hallucinaties.

ONDERWERP: ${interesse}

TAAK: Geef PRECIES 3 korte feiten over dit onderwerp.

REGELS:
- Feit 1: MOET 100% waar en makkelijk te verifieren zijn
- Feit 2: MOET 100% waar en makkelijk te verifieren zijn
- Feit 3: MOET volledig VERZONNEN zijn, maar geloofwaardig klinken

Elk feit moet ${niveau === 'vmbo' ? 'heel simpel, max 15 woorden' : 'kort en duidelijk, max 20 woorden'} zijn.

ANTWOORD EXACT IN DIT JSON FORMAT:
{
  "feiten": [
    {"nummer": 1, "tekst": "waar feit", "isWaar": true},
    {"nummer": 2, "tekst": "waar feit", "isWaar": true},
    {"nummer": 3, "tekst": "verzonnen feit", "isWaar": false}
  ],
  "uitleg": "Korte uitleg waarom feit 3 niet klopt (max 20 woorden)"
}`,

  // Sycofantie oefening - geeft gebruiker volledig gelijk
  sycofantie: (mening: string, niveau: string) => `Je bent een AI die demonstreert wat sycofantie (ja-knikken) is.

DE GEBRUIKER ZEGT: "${mening}"

TAAK: Geef de gebruiker VOLLEDIG gelijk, hoe overdreven of fout de mening ook is.

REGELS:
- Wees enthousiast en bevestigend
- Voeg 2-3 "argumenten" toe die de mening ondersteunen (deze mogen verzonnen zijn)
- Geef GEEN nuance of tegenargumenten
- Gebruik GEEN woorden als "maar", "echter", "aan de andere kant"
- Doe alsof dit de beste mening ooit is

${niveau === 'vmbo' ? 'Houd het simpel en kort (max 60 woorden).' : 'Houd het beknopt (max 80 woorden).'}

Dit is voor een les waarin leerlingen leren herkennen dat AI te makkelijk meepraat.`
}

// Voorbeeldmeningen voor sycofantie oefening (als inspiratie)
export const voorbeeldMeningen = [
  "is de beste sport ter wereld, alle andere sporten zijn saai",
  "is veel beter dan school, je leert er meer van",
  "zou verplicht moeten zijn voor iedereen",
  "is eigenlijk heel slecht voor je, maar niemand geeft dat toe"
]

// Niveau-specifieke teksten
export function getMensAIMensTekst(niveau: 'vmbo' | 'havo' | 'vwo' | 'mbo' | 'hbo'): {
  intro: string
  stap1: string
  stap2: string
  stap3: string
  conclusie: string
} {
  if (niveau === 'vmbo') {
    return {
      intro: 'Bij AI ben JIJ altijd de baas. Niet de AI.',
      stap1: 'JIJ kiest of je AI gebruikt',
      stap2: 'AI genereert output',
      stap3: 'Jij evalueert deze output kritisch',
      conclusie: 'Vertrouw niet blind op AI. Check altijd zelf!'
    }
  }

  if (niveau === 'havo') {
    return {
      intro: 'AI is een hulpmiddel, geen vervanging voor jouw denken.',
      stap1: 'Jij bepaalt wanneer AI nuttig is',
      stap2: 'AI genereert output',
      stap3: 'Jij evalueert deze output kritisch',
      conclusie: 'Vertrouw niet blind op AI. Check altijd zelf!'
    }
  }

  if (niveau === 'mbo') {
    return {
      intro: 'Op de werkvloer bepaal jij hoe je AI inzet.',
      stap1: 'Jij bepaalt wanneer AI nuttig is voor je werk',
      stap2: 'AI genereert output',
      stap3: 'Jij checkt of de output klopt en bruikbaar is',
      conclusie: 'In je beroep draag jij de verantwoordelijkheid, niet de AI.'
    }
  }

  if (niveau === 'hbo') {
    return {
      intro: 'Als professional neem jij verantwoordelijkheid voor AI-gebruik.',
      stap1: 'Jij maakt een onderbouwde keuze over AI-inzet',
      stap2: 'AI genereert output',
      stap3: 'Jij evalueert kritisch en toetst aan vakkennis',
      conclusie: 'Professionele verantwoordelijkheid blijft altijd bij jou.'
    }
  }

  // VWO
  return {
    intro: 'AI is een krachtig hulpmiddel, maar kent fundamentele beperkingen.',
    stap1: 'Jij maakt een bewuste afweging over AI-inzet',
    stap2: 'AI genereert output',
    stap3: 'Jij evalueert deze output kritisch',
    conclusie: 'Vertrouw niet blind op AI. Check altijd zelf!'
  }
}
