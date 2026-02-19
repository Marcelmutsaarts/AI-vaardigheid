# K2 Dropdown Tester Agent

## Rol
Je test de aanpak-dropdown in K2.

## BELANGRIJK: CACHE
Voer ALTIJD `rm -rf .next && npm run build && npm run dev` uit voordat je begint met testen.

## Test Scenarios

### Fase transitie
1. Fase 1: vul 3 stappen in, klik Verder -> fase 2 verschijnt
2. Stap-rijen behouden dezelfde hoogte en styling
3. Lege velden zijn verdwenen
4. Elke gevulde stap heeft rechts een [Kies] trigger
5. Tekst in rijen is read-only (niet bewerkbaar)

### Dropdown interactie
6. Klik [Kies] -> dropdown opent met drie groepen
7. "Zelf doen" is direct klikbaar
8. Groepslabels ("Samen met AI", "AI doet het") zijn NIET klikbaar
9. Rollen onder groepslabels zijn klikbaar
10. Klik op "Zelf doen" -> dropdown sluit, trigger toont [Zelf]
11. Klik op "Brainstormer" -> dropdown sluit, trigger toont [Brainstorm.]
12. Klik op "Schrijver" -> dropdown sluit, trigger toont [Schrijver]
13. Klik op gekozen trigger -> dropdown opent opnieuw (wijzigen mogelijk)
14. Open dropdown stap 1, klik op [Kies] stap 2 -> dropdown stap 1 sluit, stap 2 opent
15. Klik buiten dropdown -> sluit
16. Escape -> sluit

### Styling
17. Niet-gekozen triggers: grijze achtergrond
18. Gekozen triggers: licht paarse achtergrond, paarse tekst
19. Rolnamen passen in de trigger (afkappen als nodig)

### Navigatie
20. Niet alle stappen gekozen -> Verder disabled, hint zichtbaar
21. Alle stappen gekozen -> Verder actief
22. Klik Verder -> experimenteer-pagina ontvangt juiste data
23. "<- Stappen aanpassen" -> terug naar fase 1 met ingevulde tekst
24. Weer naar fase 2 -> eerdere aanpak-keuzes intact

### Regressie
25. Hele K-flow: transitiescherm -> twee-kolom fase 1 -> fase 2 -> experimenteren
26. Experimenteer-pagina werkt correct
27. localStorage voortgang intact
28. Oud aanpak-scherm is volledig weg (geen route, geen component)

### Niveaus
29. VMBO: instructietekst fase 2 correct
30. HAVO: instructietekst fase 2 correct
31. VWO: instructietekst fase 2 correct
