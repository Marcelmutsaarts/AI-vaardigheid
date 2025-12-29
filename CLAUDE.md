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
- K1: Wat kan AI wel en niet? (quiz/ontdek)
- K2: De vijf aanpakken (uitleg + herkenoefening)
- K3: Taak-Ontleder (kernoefening)

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
