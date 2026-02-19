# K2 Reflect Coder Agent

## Rol
Je redesignt het K2 inschatten-scherm. Twee paarse tekstblokken en een proza-samenvatting worden vervangen door een compact stapoverzicht + drie compacte reflectievragen.

## Tech Stack
- Next.js 14 (App Router), TypeScript
- Tailwind CSS, Shadcn/ui
- localStorage voor voortgang
- Lees CLAUDE.md voor volledige projectcontext

## Design Specificaties

### Aanpak-overzicht kaart
- Titel: "[Opdrachtnaam] — jouw aanpak:" (bold + regular)
- Stap-rijen: nummer (paarse cirkel klein) + tekst links + aanpak-pill rechts
- Aanpak-pill: zelfde styling als dropdown-trigger in fase 2:
  - bg-purple-50 text-purple-700 border-purple-200 rounded-full px-3 py-1 text-sm
  - Zelf: "✋ Zelf", 1 rol: emoji+naam, 2+: emoji's met tooltip
- Kaart: bg-white rounded-xl border-gray-200 p-4
- Rijen: flex items-center justify-between py-3, border-b border-gray-100 (niet op laatste)
- Read-only, geen interactie

### Reflectievragen
- Intro: "Wat doet deze aanpak met..." text-gray-600 font-medium
- Eén kaart met drie rijen:
  - Links: "...je **leren**?" / "...de **kwaliteit**?" / "...de **snelheid**?"
  - Rechts: drie keuze-buttons (single select per rij)
- Buttons default: bg-gray-100 text-gray-600 rounded-full px-4 py-2 text-sm border-gray-200
- Buttons gekozen: bg-purple-500 text-white rounded-full px-4 py-2 text-sm
- Kaart: bg-white rounded-xl border-gray-200 p-4
- Rijen: py-4, border-b border-gray-100 (niet op laatste)

### Keuze-opties per vraag
- Leren: Minder / Evenveel / Meer
- Kwaliteit: Lager / Hetzelfde / Hoger
- Snelheid: Langzamer / Hetzelfde / Sneller

### Verder-knop
- Disabled tot alle 3 vragen beantwoord
- Zelfde styling als rest van app

## Wat weg mag
- Eerste paars instructieblok
- Tweede paars blok (proza-samenvatting)
- "Wat denk jij?" heading
- Aparte kaarten per vraag
- AI-call voor proza-samenvatting (verwijder de aanroep, niet de API route)

## Code Conventies
- Functionele React componenten met TypeScript
- BEKIJK ALTIJD eerst de bestaande implementatie
- Breek GEEN functionaliteit die niet in de opdracht staat
- Sla antwoorden op zoals het huidige scherm dat doet

## CACHE
Na ELKE wijziging: `rm -rf .next && npm run build`. ALTIJD.
