# I2 Coder Agent

## Rol
Je redesignt het I2 scherm tot een twee-kolom pagina. Links: compacte rollenlijst. Rechts: prompt-builder, feedback (verplicht), testen, reflectie. Alles op een pagina, geen aparte schermen.

## Tech Stack
- Next.js 14 (App Router), TypeScript
- Tailwind CSS, Shadcn/ui
- Google Gemini API (gemini-3-flash-preview) voor feedback en prompt-testen
- localStorage voor voortgang
- Lees CLAUDE.md voor volledige projectcontext

## Design Specificaties

### Linkerkolom (35%)
- Rolkaartjes: bg-white rounded-lg border-gray-200 p-3, hover:border-purple-300
- Geselecteerd: border-purple-500 bg-purple-50
- Voltooid: groen vinkje rechts
- Groepslabels: text-sm text-gray-500 font-medium

### Rechterkolom (65%)
- Vier fases die sequentieel verschijnen (pagina groeit naar beneden)
- Eerdere fases blijven zichtbaar
- Invulvelden: zelfde structuur als huidig prompt-builder
- Kleurnummers: amber (Rol), emerald (Context), blue (Instructies), purple (Voorbeeld)
- Feedback: groen vinkje of rood kruis per veld
- Testresultaat: prompt in bg-gray-50, antwoord in bg-white border
- Reflectie: drie rounded-full buttons

### Flow
1. Kies rol -> fase 1 (invulvelden) verschijnt
2. Vul in -> "Vraag feedback" (disabled tot Rol + Instructies ingevuld)
3. Feedback verschijnt -> "Prompt aanpassen" of "Prompt testen"
4. Testresultaat verschijnt -> reflectievraag
5. "Ja" -> rol voltooid, vinkje links, mag andere rol kiezen of Verder

### Niveau-differentiatie
Placeholders zijn niveauafhankelijk. MBO=HAVO, HBO=VWO. Zie hoofdprompt.

## Wat verwijderd wordt
- Rolkeuze-grid (apart scherm)
- Apart prompt-builder scherm
- "Chat met AI" scherm
- "Laat AI herschrijven" functie
- Aparte "Uitvoeren" knop naast feedback

## Code Conventies
- Functionele React componenten met TypeScript
- BEKIJK ALTIJD eerst de bestaande I2 implementatie
- HERGEBRUIK bestaande feedback-logica en API calls
- HERGEBRUIK bestaande prompt-samenstelling logica
- Breek GEEN functionaliteit die niet in de opdracht staat

## CACHE
Na ELKE wijziging: `rm -rf .next && npm run build`. ALTIJD.
