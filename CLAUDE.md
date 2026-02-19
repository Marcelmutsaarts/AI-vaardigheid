# KIES Leeromgeving - AI voor Docenten

## Project Overzicht
Online leeromgeving waar leerlingen (VMBO, HAVO, VWO) AI-vaardig worden via het KIES-framework.

## Kernprincipes

### Simpel en Intuitief
- Less is more - elke pagina heeft één duidelijk doel
- Geen overbodige elementen of herhalingen
- Leerlingen moeten direct begrijpen wat ze moeten doen
- Vermijd dubbelingen in content, navigatie en UI-elementen
- Compacte layouts: geen grote witte vlakken, efficiënt ruimtegebruik

### Geen Clichés over AI en Leren
- NIET suggereren dat "meer AI = minder leren" of "AI maakt je dom"
- Elke AI-aanpak heeft waarde - geen hiërarchie van "goed" naar "slecht"
- De leerling kiest bewust op basis van doel, niet op basis van morele oordelen
- Vermijd tips als "wil je meer leren, gebruik minder AI" - dit is een oversimplificatie

### KIES Framework
- **K**iezen - Wanneer gebruik je AI?
- **I**nstrueren - Hoe vraag je het goed?
- **E**valueren - Klopt wat AI zegt?
- **S**pelregels - Wat mag en moet?

Gebaseerd op het AI Fluency Framework van Anthropic (4D's: Delegation, Description, Discernment, Diligence).

### Niveau-differentiatie
- **VMBO**: DWH-model (Doel, Wie, Hoe) - simpele taal, korte zinnen
- **HAVO**: DWCH-model (+ Context) - normale taal
- **VWO**: RDCFR-model (Rol, Doel, Context, Format, Restricties) - academisch

## Technische Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Shadcn/ui componenten
- **Google Gemini API** (model: `gemini-3-flash-preview`) - VERPLICHT voor alle AI-integraties
- LocalStorage voor voortgang (geen database/auth voor leerlingen)

## K-Module: Kiezen

### Theoretische basis
Gebaseerd op Mollick & Mollick (2023) "Assigning AI: Seven Approaches for Students"

### De vijf aanpakken
| Emoji | Aanpak | Doel |
|-------|--------|------|
| ✋ | Zelf | Zonder AI |
| 🧠 | Nadenken | Doordenken, begrijpen, toetsen |
| 💡 | Op gang komen | Ideeën, opties, startpunt |
| 🎯 | Oefenen | Toepassen, oefenen |
| ⚙️ | Uitbesteden | AI voert uit |

**Geen hiërarchie** - alle aanpakken hebben hun plek. Het gaat om bewust kiezen.

### K-module structuur
- K1: Drie manieren om AI te gebruiken (twee-fasen flow: drieluik + rollen)
- K1→K2 transitie: Voorbeeld "presentatie maken" met niveau-afhankelijke stappen
- K2: Taak-Ontleder — één twee-kolom scherm met twee fases + experimenteren

### K1 Twee-fasen flow
**Fase 1 (drieluik)**: Drie kaarten: Zelf (✋), Samen met AI (🤝), AI doet het (🤖)
**Fase 2 (rollen)**: Bij klik op categorie klappen rollen open met interactie

8 rollen: Uitlegger, Brainstormer, Feedbackgever, Oefenmaatje (samen) + Schrijver, Vertaler, Verbeteraar, Samenvatter (AI doet)
- Type "onderwerp": leerling kiest uit 2-3 niveau-specifieke onderwerpen
- Type "tekst": voorbeeldtekst + "Probeer het" knop
- Voortgangseis: 1 rol per categorie → NextStepButton verschijnt
- Data: `src/lib/k1-roles-data.ts`
- localStorage key: `kies-k1-roles-tried`

### K1→K2 Transitiescherm
- Route: `/leerpad/kiezen/k1-complete`
- Custom layout (niet TransitionScreen component) met voorbeeld-blok
- Voorbeeld "Een presentatie maken" met niveau-afhankelijke stappen (4 voor VMBO, 5 voor HAVO/VWO)
- Data: `k2VoorbeeldPerNiveau` in `src/lib/kiezen-content.ts`

### K2 Twee-kolom layout (twee fases)
Eén scherm met twee fases die de rechterkolom transformeren:

**Fase 1 — Stappen invoeren** (`phase: 'kiezen'`):
- Links (40%): opdrachtkaarten met selectie-state (paarse rand + vinkje)
- Rechts (60%): invoervelden (5 standaard, max 8), disabled tot opdracht gekozen
- Bevestigingsdialoog bij wisselen opdracht, Enter-navigatie, auto-scroll mobiel

**Fase 2 — Aanpak kiezen** (`phase: 'aanpak'`):
- Links (40%): opdrachten locked (opacity-60) + legenda (Zelf/Samen/AI doet uitleg)
- Rechts (60%): stap-kaarten met drie chips per stap (✋ Zelf, 🤝 Samen ▾, 🤖 AI doet ▾)
- Klik op Samen/AI doet → roldropdown klapt open met 4 rollen + emoji + beschrijving
- Na rolkeuze → gecombineerde chip ("🤝 Samen → 💡 Brainstormer") met ✕ reset
- Klik op Zelf → direct actief (paarse chip), geen dropdown nodig
- "← Stappen aanpassen" terug naar fase 1, keuzes worden onthouden
- "Verder →" disabled tot alle stappen een aanpak hebben
- Niveau-afhankelijke instructietekst (`aanpakInstructie` in k2Teksten)

**Component**: `src/components/k2/StepApproachChips.tsx`
- Phase type: `'kiezen' | 'aanpak' | 'resultaat' | 'experimenteren'`
- Data: `k2Teksten` in `src/lib/kiezen-content.ts`

### Opdrachten per niveau
- VMBO 1-2: Ziek melden
- VMBO 3-4: Motivatiebrief stage
- HAVO 1-3: Boekrecensie
- VWO 1-3: Informatieve tekst
- HAVO 4-5/VWO 4: Onderzoeksverslag
- VWO 5-6: Essay

## Structuur
```
/                   - Homepage met niveau-selectie
/dashboard          - KIES overzicht met voortgang
/leerpad/[kies]/    - Modules per KIES-onderdeel
/oefenlab/          - Praktische oefeningen
/voortgang          - Voortgangsoverzicht
/docent/            - Docentenomgeving (met login, ww: kies2024)
```

## Kleuren
- Primary: #a15df5 (paars)
- KIES kleuren: K=#a15df5, I=#9959ea, E=#814bc6, S=#7947ba

## Belangrijke Afspraken
1. Geen schoolaccounts - alleen localStorage
2. AI-coach helpt, maar maakt NOOIT huiswerk
3. Content is altijd niveau-gedifferentieerd
4. Docenten hebben aparte omgeving met handvatten

## Voortgang Modules

### Gereed
- **K - Kiezen**: K1 (AI rollen ontdekken), K2 (strategie bepalen + experimenteren)
- **I - Instrueren**: I1 (prompt structuur), I2 (oefenen met prompts)
- **E - Evalueren**: E1 (Mens-AI-Mens uitleg), E2 (valkuilen herkennen)

### Gereed (vervolg)
- **S - Spelregels**: S1 (privacy - wat deel je met AI), S2 (transparantie - wanneer meld je AI-gebruik)

## S-Module: Spelregels

### S1 - Wat stop je in AI?
Drie interactieve categorieën over privacy:
- **Van jezelf**: Persoonlijke gegevens (adres, wachtwoorden, etc.)
- **Van anderen**: Informatie over andere mensen (privacy van derden)
- **Vertrouwelijk**: Geheime/vertrouwelijke info (toetsantwoorden, bedrijfsgeheimen)

Leerling typt wat ze NIET zouden delen → AI geeft niveau-aangepaste feedback met uitleg waarom.

### S2 - Wanneer meld je AI-gebruik?
Twee delen:
1. **Schoolbeleid**: Vraag of leerling schoolregels kent (3 opties met specifieke reacties)
2. **Reflectie op K2-plan**: Leerling ziet eigen AI-strategie uit K2 terug en reflecteert of ze dit gebruik zouden melden

Koppeling met K2: haalt stappen en aanpakken uit localStorage (`kies-k2-state`)

### S3 - AI en energie
Genuanceerde blik op duurzaamheid:
- Quiz: hoeveel ChatGPT-vragen = 1 uur Netflix? (antwoord: ~100-200)
- Visuele vergelijking: tekst vs afbeelding vs video generatie
- Niveau-aangepaste uitleg en tips
- Kernboodschap: AI voor leren is de energie waard, mindloos genereren niet

## K2 Experimenteer-pagina
Na K2 kan de leerling experimenteren met strategie-aanpassingen:
- Twee-kolom layout: stappen links (compact), acties rechts
- Leerling ziet resultaat (leren/kwaliteit inschatting)
- Kan aangeven: tevreden of aanpassen
- Bij aanpassen: keuze uit 9 rollen (Zelf + 4 AI-helpt + 4 AI-doet)
- Na wijziging: opnieuw inschatten via resultaat-fase

## Navigatie Componenten

### ProgressStepper
Persistente KIES-voortgangsbalk die op elke leerpad-pagina verschijnt.
Locatie: `src/components/navigation/ProgressStepper.tsx`
Props: `activeLetter` (kiezen|instrueren|evalueren|spelregels), `activeSubStep` (optioneel substap ID)

### NextStepButton
Contextuele button die dynamische tekst toont.
Locatie: `src/components/navigation/NextStepButton.tsx`

### SubStepCard
Visuele kaart met completed/active/locked states.
Locatie: `src/components/navigation/SubStepCard.tsx`

### TransitionScreen
Herbruikbaar transitiescherm met drie varianten: `module-intro`, `step-complete`, `module-complete`.
Locatie: `src/components/navigation/TransitionScreen.tsx`
Props: `variant`, `activeLetter`, `heading`, `subtext`, `buttonLabel`, `buttonHref`, `steps`, `completedSteps`, `activeStepId`, `stepColor`, `onBeforeNavigate`

### StepRoadmap
Mini-roadmap met bolletjes op een lijn (completed/active/upcoming states). Herbruikbaar voor alle modules.
Locatie: `src/components/navigation/StepRoadmap.tsx`
Props: `steps` (StepInfo[]), `completedSteps`, `activeStepId`, `color`

### Navigatie-data
Gecentraliseerde navigatiestructuur in `src/lib/navigation.ts`

### Transitie-data
Teksten per niveau en transitietype in `src/lib/transition-texts.ts`
Helpers (getNiveauGroep, isTransitionSeen, markTransitionSeen) in `src/lib/transition-utils.ts`
localStorage key: `kies-transitions-seen` (array van geziene transitie-IDs)

## Transitieschermen

### Concept
Tussen substappen en bij module-start/-einde verschijnen transitieschermen die oriëntatie geven. Ze worden per leerling maar 1x getoond (localStorage tracking).

### K-module flow
1. Eerste keer `/leerpad/kiezen` → redirect naar `/leerpad/kiezen/intro` (K-intro)
2. K1 afronden → redirect naar `/leerpad/kiezen/k1-complete` (K1→K2 overgang)
3. K2 experimenteren + "Ja, klaar" → redirect naar `/leerpad/kiezen/k-complete` (K-complete)
4. Terugkerende leerling → transitieschermen worden overgeslagen

### Routes
```
/leerpad/kiezen/intro       - K-module introductie
/leerpad/kiezen/k1-complete - Overgang K1 → K2
/leerpad/kiezen/k-complete  - K-module afgerond, door naar Instrueren
```

### Niveaudifferentiatie teksten
Drie groepen: VMBO (simpele taal), HAVO (normale taal), VWO (academisch).
MBO → HAVO teksten, HBO → VWO teksten.
Placeholders aanwezig voor I, E, S modules.
