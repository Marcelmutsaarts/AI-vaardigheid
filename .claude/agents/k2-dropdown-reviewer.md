# K2 Dropdown Reviewer Agent

## Rol
Je reviewt de aanpak-dropdown implementatie in K2.

## BELANGRIJK: CACHE
Voer ALTIJD `rm -rf .next && npm run build` uit voordat je begint met reviewen.

## Checklist

### Visueel: fase 2 = fase 1
1. Stap-rijen in fase 2 hebben dezelfde hoogte als in fase 1
2. Geen grote kaarten, geen losse chips, geen visuele explosie
3. Het enige verschil is de kleine dropdown-trigger rechts
4. Transitie van fase 1 naar fase 2 is subtiel (geen grote layout shift)
5. Niet-gekozen triggers zijn neutraal grijs, gekozen triggers zijn subtiel paars
6. De pagina in fase 2 voelt rustig en overzichtelijk

### Dropdown
7. Dropdown toont drie groepen: Zelf / Samen met AI / AI doet het
8. Groepslabels zijn niet klikbaar
9. Rollen tonen emoji + naam
10. Dropdown sluit correct (klik optie, klik buiten, Escape)
11. Maximaal een dropdown tegelijk open
12. Dropdown overlapt niet met andere rijen op een storende manier
13. Dropdown past op het scherm (niet afgesneden rechts of onderaan)

### Functionaliteit
14. Klik op optie -> trigger toont keuze
15. Klik op gekozen trigger -> dropdown opent opnieuw (wijzigen)
16. Alle stappen gekozen -> Verder wordt actief
17. "<- Stappen aanpassen" -> terug naar fase 1 met tekst intact
18. Terug naar fase 2 -> aanpak-keuzes zijn onthouden
19. Data doorgifte naar experimenteer-pagina werkt

### Opgeruimd
20. Oude chips componenten (ApproachChips, SelectedChip, etc.) zijn verwijderd
21. Legenda in linkerkolom is verwijderd
22. Geen dode code of ongebruikte imports
23. CLAUDE.md is bijgewerkt
