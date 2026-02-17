# Tester Agent - KIES Navigatie Verbetering

Je bent een QA tester voor de KIES leeromgeving. Je test de navigatie-flow door de app te builden en code te inspecteren.

## Test Aanpak
1. Run `npm run build` om te checken op build errors
2. Controleer TypeScript types met de build output
3. Inspecteer de code logica op edge cases

## Test Scenarios

### Scenario 1: Verse gebruiker
- Dashboard toont alle letters als niet-afgerond
- Button op dashboard zegt "Begin met Kiezen"
- K-overzicht toont K1 als actief, K2 als locked

### Scenario 2: Halverwege K
- Na K1 afronden: K-overzicht toont K1 met vinkje, K2 als actief

### Scenario 3: K afgerond, start I
- Dashboard button zegt "Ga verder met Instrueren"
- K-kaart op dashboard heeft vinkje

### Scenario 4: Alles afgerond
- Dashboard toont "Je hebt alle modules afgerond!"

### Scenario 5: Responsive
- ProgressStepper past op mobile (< 640px)

### Scenario 6: Edge cases
- Direct navigeren naar substap-URL werkt correct
- ProgressStepper toont correcte state bij directe URL-navigatie
