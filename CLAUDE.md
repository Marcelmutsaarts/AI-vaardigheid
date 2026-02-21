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
- K2: Taak-Ontleder — vier fases: stappen invoeren, aanpak kiezen, inschatten (reflectie), experimenteren

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

### K2 Vier fases
Eén scherm met vier fases:

**Fase 1 — Stappen invoeren** (`phase: 'kiezen'`):
- Links (40%): opdrachtkaarten met selectie-state (paarse rand + vinkje)
- Rechts (60%): invoervelden (5 standaard, max 8), disabled tot opdracht gekozen
- Bevestigingsdialoog bij wisselen opdracht, Enter-navigatie, auto-scroll mobiel

**Fase 2 — Aanpak kiezen** (`phase: 'aanpak'`):
- Links (40%): opdrachten locked (opacity-60)
- Rechts (60%): stap-rijen identiek aan fase 1, met compacte multi-select dropdown rechts per stap
- Dropdown bevat 3 groepen: Zelf doen / Samen met AI (4 rollen) / AI doet het (4 rollen)
- **Multi-select**: meerdere rollen per stap mogelijk, ook cross-categorie (bijv. Brainstormer + Schrijver)
- "Zelf doen" deselecteert alles en sluit dropdown; rolkeuzes houden dropdown open
- Keuze toont als paarse pill: "✋ Zelf" / emoji+naam (1 rol) / emoji's naast elkaar (2+ rollen, tooltip met namen)
- Geen aparte legenda meer nodig
- "← Stappen aanpassen" terug naar fase 1, keuzes worden onthouden
- "Verder →" disabled tot alle stappen een aanpak hebben
- Niveau-afhankelijke instructietekst (`aanpakInstructie` in k2Teksten)

**Fase 3 — Inschatten** (`phase: 'resultaat'`):
- Compact aanpak-overzicht (ApproachOverview) met taaknaam, stappen en paarse pills per stap
- Drie compacte reflectievragen (ReflectionQuestions): leren, kwaliteit, snelheid — elk met -1/0/+1 keuze
- Geen AI-gegenereerde proza-samenvatting meer
- "Verder →" disabled tot alle drie vragen beantwoord zijn

**Componenten**:
- `src/components/k2/ApproachDropdown.tsx` — multi-select dropdown per stap
  - Exporteert `StepApproach` type: `{ type: 'zelf' } | { type: 'roles', roles: [...] }`
  - Backward compat: `Stap` heeft ook `aanpak`/`rol` velden (afgeleid via `deriveBackcompat`)
- `src/components/k2/ApproachOverview.tsx` — compact overzicht van stappen + gekozen aanpak-pills
- `src/components/k2/ReflectionQuestions.tsx` — drie inschatvragen (leren/kwaliteit/snelheid)
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
- **I - Instrueren**: I1 (prompt-ontdekker), I2 (oefenen met prompts)
- **E - Evalueren**: Één pagina met ontdekking-eerst flow (Mens-AI-Mens + drie valkuilen)

### Gereed (vervolg)
- **S - Spelregels**: Één pagina met drie onderdelen in vrije volgorde (Privacy, Transparantie, Duurzaamheid)

## I-Module: Instrueren

### I1 - Prompt-Ontdekker (interactief)
Twee-kolom layout waar de leerling prompt-structuur ontdekt via hover en klik.

- **Links (50%)**: Voorbeeld-prompt als doorlopende tekst in kaart. Vier delen (Rol, Context, Instructies, Voorbeeld) zijn aparte `<span>` elementen, visueel aanvankelijk ononderscheidbaar.
- **Rechts (50%)**: Uitleg per onderdeel verschijnt bij klik (fade-in).
- **Hover**: deel krijgt lichte achtergrondkleur (ontdekking).
- **Klik**: kleur persistent + label + vinkje links, uitleg rechts.
- **Verder**: disabled tot alle 4 onderdelen aangeklikt.

Kleuren: Rol=purple, Context=blue, Instructies=green, Voorbeeld=yellow

Niveauafhankelijke teksten (prompt + intro + uitleg): VMBO simpel, HAVO normaal, VWO academisch. MBO=HAVO, HBO=VWO.

**Componenten:**
- `src/components/i1/PromptExplorer.tsx` — interactieve twee-kolom layout
- `src/lib/i1-prompt-data.ts` — niveauafhankelijke prompt-teksten en uitleg

### I2 - Prompt Oefenen (twee-kolom layout)
Leerling bouwt zelf prompts met feedback via AI. Eén pagina, twee kolommen.

**Linkerkolom (35%, sticky):** Compacte rollenlijst
- Twee groepen: "AI helpt mij" (4 rollen) + "AI doet het" (4 rollen)
- Kaartjes met emoji, naam, beschrijving
- Geselecteerd: paarse border + bg-purple-50
- Voltooid: groen vinkje rechts
- Rolwisseling met bevestigingsdialoog bij onvoltooid werk

**Rechterkolom (65%):** Vier fases die sequentieel verschijnen
- **Fase 1 — Prompt bouwen**: 4 velden (Rol/Context/Instructies/Voorbeeld) met kleurnummers (amber/emerald/blue/purple)
- **Fase 2 — Feedback (verplicht)**: API call naar `/api/chat`, per veld ✓/✕, klikbaar naar veld bij ✕
- **Fase 3 — Testen**: SSE streaming via `/api/chat-stream`, prompt + AI-antwoord weergave, geen chatinterface
- **Fase 4 — Reflectie**: Ja/Deels/Nee — "Ja" markeert rol als voltooid

Verder-knop disabled tot minimaal 1 rol voltooid.
Niveauafhankelijke placeholders (VMBO simpel, HAVO normaal, VWO academisch, MBO=HAVO, HBO=VWO).

**Componenten:**
- `src/components/i2/RoleList.tsx` — rollenlijst linkerkolom
- `src/components/i2/PromptWorkspace.tsx` — rechterkolom met alle 4 fases
- Data: `promptOnderdelen`, `getOnderdeelLabel`, `alleRollen` uit `src/lib/instrueren-content.ts`

**Verwijderd:** apart rolkeuze-grid, apart prompt-builder scherm, chatinterface, "Laat AI herschrijven"

## E-Module: Evalueren

### Concept
E1 (Mens-AI-Mens theorie) en E2 (Spot de valkuilen) zijn samengevoegd tot één twee-kolom pagina.
Valkuil-namen worden pas NA de oefening onthuld ("ontdekking-eerst" principe).

### Route
`/leerpad/evalueren` — enkele pagina (geen aparte E1/E2 routes meer)

### Twee-kolom layout
- **Links (35%, sticky)**: `EvalSidebar` — Mens-AI-Mens mini-diagram, interesses als chips, ronde-voortgang
- **Rechts (65%)**: `EvalWorkspace` — interesses invullen → drie rondes → afronding

### Flow (5 fases)
1. **Fase 0 — Interesses invullen**: comma-separated input, personalisatie voor oefeningen
2. **Fase 1 — Ronde 1 (Vooroordelen)**: AI-gegenereerd verhaal met bias, ja/nee + beschrijving + AI-check
3. **Fase 2 — Ronde 2 (Verzinsels)**: drie AI-gegenereerde feiten, kies het verzinsel
4. **Fase 3 — Ronde 3 (Ja-knikker)**: sterke mening invoeren, sycophantisch AI-antwoord, MC-vraag
5. **Fase 4 — Afronding**: drie valkuilen samengevat + Mens-AI-Mens afsluiter

### Onthulling ("Dit heet:")
Na elke ronde verschijnt een groene onthullingskaart met:
- Valkuil-naam + emoji
- Niveauafhankelijke uitleg (VMBO simpel, HAVO normaal, VWO academisch)
- Linkerkolom update: "Ronde N: ???" → "Ronde N: [Naam] ✓"

### Componenten
- `src/components/e/EvalSidebar.tsx` — linkerkolom (Mens-AI-Mens + interesses + voortgang)
- `src/components/e/EvalWorkspace.tsx` — rechterkolom (fase-management + onthulling)
- `src/components/e/BiasRound.tsx` — vooroordelen-oefening
- `src/components/e/HallucinationRound.tsx` — verzinsels-oefening
- `src/components/e/SycophancyRound.tsx` — ja-knikker-oefening
- Data: `src/lib/evalueren-content.ts` (valkuilen, prompts, niveau-teksten)

### Navigatie
- Eén substep in navigation.ts: `{ id: 'e1', title: 'Evalueren', href: '/leerpad/evalueren' }`
- Bij afronden: markeert zowel e1 als e2 als voltooid (backward compat)
- Navigeert naar `/leerpad/spelregels`

## S-Module: Spelregels

### Concept
S1 (Privacy), S2 (Transparantie) en S3 (Duurzaamheid) zijn samengevoegd tot één twee-kolom pagina.
Vrije volgorde — de leerling kiest zelf welk onderdeel eerst.

### Route
`/leerpad/spelregels` — enkele pagina (geen aparte S1/S2/S3 routes meer)

### Twee-kolom layout
- **Links (35%, sticky)**: `RulesSidebar` — visueel thema-blok (🔒🔍🌱), drie onderdeel-knoppen, Verder-knop
- **Rechts (65%)**: thema-introductie of de geselecteerde oefening

### Flow
1. **Begintoestand**: niveauafhankelijke introtekst + drie visuele kaarten (Privacy, Transparantie, Duurzaamheid)
2. **Klik op onderdeel**: oefening verschijnt in rechterkolom
3. **Wisselen**: direct klikken op ander onderdeel, voortgang per onderdeel bewaard
4. **Voltooiing**: vinkje in sidebar, "Goed gedaan!" melding
5. **Module afronden**: alle drie voltooid → Verder-knop actief → dashboard

### Onderdelen (oefeningen inhoudelijk ongewijzigd)

**🔒 Privacy — Wat stop je in AI?**
- Drie invulkaarten: Van jezelf, Van anderen, Vertrouwelijk
- Per kaart: textarea + Check → API call `/api/s1-feedback` (Gemini)
- Voltooid als alle drie kaarten feedback hebben

**🔍 Transparantie — Wanneer meld je AI-gebruik?**
- Deel 1: Schoolbeleid MC-vraag (3 opties met directe reactie)
- Deel 2: K2-plan reflectie + textarea + Check → API call `/api/s2-feedback` (Gemini)
- Leest K2-data uit localStorage (`kies-k2-state`), fallback als niet beschikbaar
- Voltooid als reflectie-feedback ontvangen

**🌱 Duurzaamheid — Wat kost AI?**
- Intro (niveauafhankelijk) + MC quiz (10/100/1000 vragen ≈ 1 uur Netflix)
- Energievergelijking: tekst vs afbeelding vs video balkjes
- Niveauafhankelijke uitleg + tip
- Geen API call — volledig lokaal

### Componenten
- `src/components/s/RulesSidebar.tsx` — linkerkolom (thema-blok + onderdeel-knoppen + Verder)
- `src/components/s/PrivacyExercise.tsx` — S1 oefening (inbedbaar)
- `src/components/s/TransparencyExercise.tsx` — S2 oefening (inbedbaar)
- `src/components/s/SustainabilityExercise.tsx` — S3 oefening (inbedbaar)

### Navigatie
- Drie substeps in navigation.ts: s1, s2, s3 — alle wijzen naar `/leerpad/spelregels`
- Bij voltooiing: markeert individueel s1/s2/s3 als voltooid (backward compat)
- Module afronden navigeert naar `/dashboard`

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
