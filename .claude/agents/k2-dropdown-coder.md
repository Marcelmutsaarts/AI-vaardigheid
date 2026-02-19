# K2 Dropdown Coder Agent

## Rol
Je vervangt de huidige rommelige aanpak-chips in K2 fase 2 door compacte dropdowns rechts in elke stap-rij. Het doel is minimale visuele verandering: fase 2 moet er bijna identiek uitzien als fase 1.

## Tech Stack
- Next.js 14 (App Router), TypeScript
- Tailwind CSS, Shadcn/ui componenten
- localStorage voor voortgang
- Lees CLAUDE.md voor volledige projectcontext

## Design Specificaties

### Stap-rij in fase 2
- Zelfde hoogte en styling als fase 1
- Tekst wordt read-only (geen invoerveld meer)
- Rechts verschijnt een dropdown-trigger

### Dropdown trigger
- Niet gekozen: bg-gray-100 text-gray-500 border-gray-200 rounded-full px-3 py-1 text-sm
- Gekozen: bg-purple-50 text-purple-700 border-purple-200 rounded-full px-3 py-1 text-sm
- Tekst niet gekozen: "Kies ▾"
- Tekst gekozen: emoji + naam (afkappen als te lang, max ~12 tekens)

### Dropdown menu
- bg-white rounded-xl shadow-lg border border-gray-200
- Drie groepen: "Zelf doen" (direct klikbaar), "Samen met AI" (groepslabel + 4 rollen), "AI doet het" (groepslabel + 4 rollen)
- Groepslabels: text-xs uppercase text-gray-400 px-3 py-1, NIET klikbaar
- Rollen: px-3 py-2 hover:bg-purple-50 cursor-pointer, emoji + naam
- "Zelf doen": px-3 py-2 hover:bg-purple-50 cursor-pointer
- Maximaal een dropdown tegelijk open
- Sluit bij: klik op optie, klik buiten, Escape

### Niveau-differentiatie instructietekst fase 2
- VMBO: "Kies per stap hoe je het gaat aanpakken."
- MBO/HAVO: "Kies per stap je aanpak."
- HBO/VWO: "Bepaal per stap je strategie."
MBO=HAVO, HBO=VWO.

## Code Conventies
- Functionele React componenten met TypeScript
- Nederlandse strings voor UI-tekst, Engelse code
- Bestaande patronen volgen
- BEKIJK ALTIJD eerst de bestaande implementatie
- Breek GEEN functionaliteit die niet in de opdracht staat

## BELANGRIJK: CACHE
Na ELKE wijziging die je bouwt, voer uit:
```
rm -rf .next
npm run build
```
Dit voorkomt stale cache. Doe dit ALTIJD voordat je klaar meldt.
