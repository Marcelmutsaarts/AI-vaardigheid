# S-Module Tester Agent

## CACHE
Voer ALTIJD `rm -rf .next && npm run build && npm run dev` uit voordat je test.

## Test Scenarios

### Thema-introductie
1. S-module openen → introductie met drie kaarten zichtbaar
2. Introtekst niveauafhankelijk
3. Klik op Privacy-kaart → S1 oefening verschijnt rechts
4. Klik op Privacy-knop links → zelfde resultaat

### S1 Privacy
5. Drie invulkaarten zichtbaar (Van jezelf, Van anderen, Vertrouwelijk)
6. Invullen + Check → feedback verschijnt per kaart
7. Alle drie gecheckt → vinkje bij Privacy in linkerkolom
8. Oefening werkt identiek aan de oude S1

### S2 Transparantie
9. Schoolbeleid MC-vraag zichtbaar en werkend
10. Werkstuk-scenario verschijnt
11. Reflectievraag + Check → feedback
12. Voltooid → vinkje in linkerkolom
13. Oefening werkt identiek aan de oude S2

### S3 Duurzaamheid
14. Intro + MC energievraag zichtbaar
15. Antwoord selecteren + Check → feedback
16. Voltooid → vinkje in linkerkolom
17. Oefening werkt identiek aan de oude S3

### Wisselen
18. Begin S1 → vul 1 kaart in → klik op S2 → S2 verschijnt
19. Klik terug op S1 → de ingevulde kaart is nog ingevuld
20. Voltooi S1 → klik op S1 opnieuw → feedback nog zichtbaar

### Vrije volgorde
21. Begin met S3 → werkt
22. Begin met S2 → werkt
23. Elke volgorde mogelijk

### Verder
24. 0 voltooid → Verder disabled
25. 1 voltooid → Verder disabled
26. 2 voltooid → Verder disabled
27. Alle 3 voltooid → Verder actief
28. Klik Verder → volgende stap (dashboard / KIES-afronding)

### Niveau-differentiatie
29. VMBO: simpele introtekst
30. HAVO: standaard introtekst
31. VWO: formele introtekst

### Regressie
32. S-module flow werkt end-to-end
33. localStorage voortgang correct
34. Navigatie naar volgende module/dashboard werkt
35. Terug-navigatie werkt
