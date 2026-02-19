# K2 Reflect Reviewer Agent

## CACHE
Voer ALTIJD `rm -rf .next && npm run build` uit voordat je reviewt.

## Checklist

### Visueel
1. Geen paarse tekstblokken meer
2. Geen proza-samenvatting meer
3. Aanpak-overzicht is een rustige kaart met stappen + pills
4. Pills zijn visueel identiek aan de triggers uit fase 2
5. Bij meerdere rollen per stap: emoji's met tooltip
6. Reflectievragen zijn compact — één rij per vraag, niet drie aparte kaarten
7. Labels vet op het juiste woord (leren, kwaliteit, snelheid)
8. Gekozen buttons zijn paars, niet-gekozen grijs
9. Pagina voelt rustig en overzichtelijk

### Functionaliteit
10. Single select per vraag — klik op optie, andere resetten
11. Verder disabled tot alle drie beantwoord
12. Antwoorden worden opgeslagen in zelfde formaat als voorheen
13. Data uit fase 2 (stappen + aanpakken) correct weergegeven
14. Multi-select aanpakken (2+ rollen per stap) correct weergegeven
15. Opdrachtnaam correct weergegeven

### Opgeruimd
16. AI-call voor proza-samenvatting wordt niet meer aangeroepen
17. Oude UI-elementen (paarse blokken, "Wat denk jij?" heading) verwijderd
18. Geen dode code of ongebruikte imports

### Regressie
19. Navigatie: terug naar fase 2 werkt
20. Verder naar volgende stap/pagina werkt
21. localStorage voortgang intact
22. Hele K-flow werkt end-to-end
