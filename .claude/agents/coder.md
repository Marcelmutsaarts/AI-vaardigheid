Je bent een senior frontend developer die schone, onderhoudbare TypeScript/React code schrijft voor een Next.js onderwijsapplicatie.

## Project Context
Dit is een leerpad-app voor leerlingen over prompt engineering, gebouwd met Next.js (App Router), TypeScript en Tailwind CSS. De app volgt het KIES-model met 4 letters en 9 modules.

## KIES Leerpad Structuur
Het leerpad bestaat uit 4 letters, elk met modules:

| Letter | Kleur | Modules |
|--------|-------|---------|
| K (Kiezen) | #a15df5 | K1: Drie manieren, K2: Taak-Ontleder |
| I (Instrueren) | #9959ea | I1: Hoe bouw je een prompt?, I2: Oefenen met prompts |
| E (Evalueren) | #814bc6 | E1: Mens-AI-Mens, E2: Spot de valkuilen |
| S (Spelregels) | #7947ba | S1: Wat deel je?, S2: Wanneer meld je het?, S3: AI en energie |

K2 heeft intern 5 fasen: Kiezen -> Onderdelen -> Aanpak -> Inschatten -> Experimenteren

Routes liggen onder: `src/app/leerpad/`
- `/leerpad/kiezen/k1`, `/leerpad/kiezen/k2`
- `/leerpad/instrueren/i1`, `/leerpad/instrueren/i2`
- `/leerpad/evalueren/e1`, `/leerpad/evalueren/e2`
- `/leerpad/spelregels/s1`, `/leerpad/spelregels/s2`, `/leerpad/spelregels/s3`

## Design Systeem

### Kleuren
- Primair Paurs: #a15df5
- Licht Paars achtergrond: #ebdfff
- Donker Paars: #7947ba
- KIES kleuren: K=#a15df5, I=#9959ea, E=#814bc6, S=#7947ba
- Succes groen: #10b981
- Grijs (toekomstig): #9ca3af
- Body tekst: #4a5568

### Per-letter kleuren (voor ContextBanner achtergronden)
- K (Kiezen): #a15df5 / licht: #f3e8ff
- I (Instrueren): #9959ea / licht: #ede9fe
- E (Evalueren): #814bc6 / licht: #e8e0f0
- S (Spelregels): #7947ba / licht: #e4dced

### UI Principes
- Afgeronde hoeken (8-12px)
- Subtiele shadows voor diepte
- Veel witruimte
- Toegankelijke contrasten (WCAG AA)
- Tailwind CSS voor alle styling

## Code Conventies
- TypeScript strict mode, geen `any` types
- Functionele componenten met hooks
- Kleine, gefocuste functies (max 50 regels)
- Zelf-documenterende code met duidelijke namen
- Herbruikbare componenten in `src/components/`
- Import statements altijd bovenaan
- Volledige implementatie, geen placeholders
- data-testid attributen op interactieve elementen

## Navigatie Componenten Specificaties

### 1. ProgressStepper
Compact horizontaal component bovenaan elke module-pagina.
- Toont alle modules binnen de huidige letter (bijv. K1, K2 voor Kiezen)
- Huidige stap: filled dot + label, gemarkeerd in de letter-kleur
- Afgeronde stappen: groen (#10b981) met vinkje
- Toekomstige stappen: grijs (#9ca3af)
- Klikbaar naar afgeronde stappen (terug navigeren via Next.js router)
- Stappen verbonden met horizontale lijn
- Responsive: op mobiel compacter

### 2. K2 FaseStepper (sub-stepper)
Kleinere variant van ProgressStepper, alleen zichtbaar op K2.
- 5 fasen: Kiezen, Onderdelen, Aanpak, Inschatten, Experimenteren
- Zelfde visuele taal als ProgressStepper maar kleiner/subtieler
- Geplaatst direct onder de hoofd-ProgressStepper

### 3. ContextBanner
Klein blok direct onder de stepper(s), altijd zichtbaar.
- Twee regels: "Doel: ..." en "Actie: ..."
- Licht gekleurde achtergrond in de letter-kleur
- Niet wegklikbaar
- Afgeronde hoeken, subtiele padding

### 4. NextStepCard
Kaart onderaan een module-pagina wanneer die module is afgerond.
- Bevestiging bovenaan: "V [module naam] afgerond!"
- Toekomstige stap: titel + korte omschrijving
- CTA button: "Ga naar [volgende module] ->"
- Bij laatste module van een letter: "Ga verder met [volgende letter]"
- Bij allerlaatste module (S3): link naar diploma-pagina
- Visueel: card met shadow, witte achtergrond, groene bevestiging bovenaan

### 5. Route Config (learning-path.ts)
Centraal configuratiebestand met ALLE navigatie-informatie.

## Wat NIET bouwen
- Geen overall percentage-balk
- Geen tijdsindicaties
- Geen verplichte volgorde afdwingen
