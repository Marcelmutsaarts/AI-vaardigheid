# S-Module Coder Agent

## Rol
Je voegt S1 (Privacy), S2 (Transparantie) en S3 (Duurzaamheid) samen tot één twee-kolom pagina. Links: visueel thema-blok + drie onderdeel-knoppen + Verder. Rechts: thema-introductie of de bestaande oefening van het geselecteerde onderdeel.

## Tech Stack
- Next.js 14 (App Router), TypeScript
- Tailwind CSS, Shadcn/ui
- Google Gemini API (gemini-3-flash-preview) waar oefeningen dat gebruiken
- localStorage voor voortgang
- Lees CLAUDE.md voor volledige projectcontext

## KRITIEK: OEFENINGEN BLIJVEN ONGEWIJZIGD
De drie oefeningen (S1, S2, S3) blijven inhoudelijk EXACT zoals ze zijn. Je haalt ze uit hun pagina-wrapper en maakt ze inbedbaar als component in de rechterkolom. Je verandert NIET:
- De vragen, invulvelden, MC-opties
- De feedback-teksten of AI-calls
- De interactiepatronen (check-knoppen, volgorde binnen een oefening)
- De niveau-differentiatie binnen de oefeningen

Je verandert WEL:
- Ze navigeren niet meer zelf (geen eigen routing)
- Ze geven een callback als ze voltooid zijn
- Ze passen in een rechterkolom (responsive within 65% breedte)

## Design Specificaties

### Linkerkolom (35%, sticky)
- Visueel thema-blok: drie iconen (🔒 🔍 🌱) + "Veilig · Eerlijk · Bewust", bg-purple-50 rounded-xl p-4
- Drie onderdeel-knoppen: verticaal, klikbaar, geselecteerde state, voltooid-vinkje
- Vrije volgorde — geen verplichte sequentie
- Verder-knop onderaan: disabled tot alle drie voltooid

### Rechterkolom (65%)
- Begintoestand: drie visuele kaarten + introtekst (niveauafhankelijk)
- Oefening-toestand: de bestaande oefening ingebed, met titel + icoon erboven
- Wisselen: direct, geen bevestigingsdialoog
- Onvoltooide voortgang bewaren per onderdeel

## Code Conventies
- Functionele React componenten met TypeScript
- BEKIJK ALTIJD eerst de bestaande S1, S2, S3 implementatie
- HERGEBRUIK alles — refactor alleen de wrapper/routing
- Breek GEEN functionaliteit die niet in de opdracht staat

## CACHE
Na ELKE wijziging: `rm -rf .next && npm run build`. ALTIJD.
