export type AxisValue = -1 | 0 | 1
export type AxisLabel = 'pos' | 'zero' | 'neg'

export interface Persona {
  key: string
  name: string
  baseDescription: string
  imageFile: string
}

function toLabel(v: AxisValue): AxisLabel {
  if (v === 1) return 'pos'
  if (v === -1) return 'neg'
  return 'zero'
}

export function getPersonaKey(leren: AxisValue, kwaliteit: AxisValue, snelheid: AxisValue): string {
  return `${toLabel(leren)}-${toLabel(kwaliteit)}-${toLabel(snelheid)}`
}

export function getPersona(leren: AxisValue, kwaliteit: AxisValue, snelheid: AxisValue): Persona {
  const key = getPersonaKey(leren, kwaliteit, snelheid)
  return personas[key]
}

const make = (key: string, name: string, baseDescription: string): Persona => ({
  key,
  name,
  baseDescription,
  imageFile: `/personas/persona-${key}.webp`,
})

export const personas: Record<string, Persona> = {
  // === Leren = meer (+1) ===
  'pos-pos-pos': make('pos-pos-pos', 'De Drievoudige Treffer', 'Hier klopte alles: je leerde meer, je werk werd beter én je was sneller klaar.'),
  'pos-pos-zero': make('pos-pos-zero', 'De Verdiepings-Profi', 'Diepgang loont — meer geleerd en betere kwaliteit, in dezelfde tijd.'),
  'pos-pos-neg': make('pos-pos-neg', 'De Diepe Bouwer', 'Het kostte langer, maar je werk én je begrip kwamen er beter uit.'),
  'pos-zero-pos': make('pos-zero-pos', 'De Slimme Sprinter', 'Sneller klaar én meer geleerd, zonder kwaliteit op te offeren.'),
  'pos-zero-zero': make('pos-zero-zero', 'De Stille Doorgrunder', 'Het werk ziet er hetzelfde uit, maar in jouw kop is veel meer blijven hangen.'),
  'pos-zero-neg': make('pos-zero-neg', 'De Bewuste Studeerder', 'Je nam de tijd om écht te begrijpen — kwaliteit gelijk, kennis vooruit.'),
  'pos-neg-pos': make('pos-neg-pos', 'De Snelle Snapper', 'Je doorzag het ding razendsnel; alleen schoonheidsfoutjes bleven liggen.'),
  'pos-neg-zero': make('pos-neg-zero', 'De Speel-Leerling', 'Rommelend ontdekken: je leerde veel, ook al is het eindwerk wat rauwer.'),
  'pos-neg-neg': make('pos-neg-neg', 'De Worstelende Leerling', 'Niks ging makkelijk — maar in die wrijving zit ook leerwinst.'),

  // === Leren = gelijk (0) ===
  'zero-pos-pos': make('zero-pos-pos', 'De Productiviteits-Pro', 'Beter werk, sneller klaar — pure efficiëntie, leren stond stil.'),
  'zero-pos-zero': make('zero-pos-zero', 'De Polish-Profi', 'Een glans-laagje over je werk; tempo en kennis bleven gelijk.'),
  'zero-pos-neg': make('zero-pos-neg', 'De Perfectionist', 'Je tilde de kwaliteit hoog op, al kostte het meer tijd.'),
  'zero-zero-pos': make('zero-zero-pos', 'De Tijdsprinter', 'Hetzelfde resultaat, alleen sneller — pure tijdwinst.'),
  'zero-zero-zero': make('zero-zero-zero', 'De Onveranderlijke', 'Geen winst, geen verlies — AI had even goed thuis kunnen blijven.'),
  'zero-zero-neg': make('zero-zero-neg', 'De Trage Routine', 'Alleen tijd kwijt; nu weet je het voor de volgende keer.'),
  'zero-neg-pos': make('zero-neg-pos', 'De Quick & Dirty', 'Snel klaar, kwaliteit iets minder — soms precies wat de taak vroeg.'),
  'zero-neg-zero': make('zero-neg-zero', 'De Concept-Cowboy', 'Schetsmatig resultaat met scherpe randjes — ruw maar af.'),
  'zero-neg-neg': make('zero-neg-neg', 'De Pechvogel', 'Werk zwakker én meer tijd kwijt; deze taak vroeg een andere aanpak.'),

  // === Leren = minder (-1) ===
  'neg-pos-pos': make('neg-pos-pos', 'De Slimme Uitbesteder', 'Je liet AI het zware werk doen: glans en snelheid, jouw hand bleef erbuiten.'),
  'neg-pos-zero': make('neg-pos-zero', 'De Glansgever', 'Mooier resultaat zonder zelf veel te leren — efficiënt waar kwaliteit telt.'),
  'neg-pos-neg': make('neg-pos-neg', 'De Pietje Precies', 'Tot in detail gepolijst, ten koste van tijd én eigen leerwinst.'),
  'neg-zero-pos': make('neg-zero-pos', 'De Tempo-Tactieker', 'Sneller klaar zonder kwaliteitsverlies; leren stond niet voorop deze keer.'),
  'neg-zero-zero': make('neg-zero-zero', 'De Stille Skipper', 'Tempo en werk hetzelfde, leren overgeslagen — bewust of toevallig?'),
  'neg-zero-neg': make('neg-zero-neg', 'De Verdwaalde Doorzetter', 'Lange weg afgelegd, zonder leerwinst of beter resultaat.'),
  'neg-neg-pos': make('neg-neg-pos', 'De Quickfixer', 'Snel klaar, snel-onaf-werk — handig waar het er écht niet om geeft.'),
  'neg-neg-zero': make('neg-neg-zero', 'De Mistige Maker', 'Gelijk tempo, minder kwaliteit, niks geleerd — AI bracht hier weinig.'),
  'neg-neg-neg': make('neg-neg-neg', 'De Solo-Strijder', 'Op geen enkele as winst — duidelijk signaal: dit vroeg om een andere aanpak.'),
}
