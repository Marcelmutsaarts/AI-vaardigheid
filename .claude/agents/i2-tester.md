# I2 Tester Agent

## CACHE
Voer ALTIJD `rm -rf .next && npm run build && npm run dev` uit voordat je test.

## Test Scenarios

### Rolkeuze
1. Acht rollen zichtbaar in twee groepen
2. Klik op Uitlegger -> rechts verschijnt prompt-builder met "Uitlegger"
3. Klik op Schrijver -> rechts wisselt naar Schrijver
4. Voltooide rol toont groen vinkje

### Prompt-builder
5. Vier velden zichtbaar met kleurnummers
6. Placeholders kloppen voor het gekozen niveau
7. "Vraag feedback" disabled als Rol leeg
8. Vul Rol + Instructies in -> "Vraag feedback" wordt actief
9. Klik "Vraag feedback" -> loading indicator -> feedback verschijnt

### Feedback
10. Feedback verschijnt ONDER invulvelden (velden nog zichtbaar)
11. Per veld vinkje of kruis met tekst
12. Klik op kruis-item -> scrollt naar dat veld
13. "Prompt aanpassen" -> scrollt naar velden
14. "Prompt testen" -> loading -> testresultaat verschijnt
15. Pas veld aan -> kan opnieuw feedback vragen
16. Nieuwe feedback vervangt oude

### Testresultaat
17. Samengestelde prompt zichtbaar in grijs blok
18. AI-antwoord zichtbaar in witte kaart
19. Antwoord bevat relevante inhoud voor de gekozen rol
20. Geen chatinput, geen vervolgberichten
21. Geen "Laat AI herschrijven" knop

### Reflectie
22. "Kreeg je wat je verwachtte?" verschijnt na testresultaat
23. Klik "Ja" -> vinkje bij rol in linkerkolom
24. Klik "Deels" -> hint + "Prompt aanpassen" knop
25. Klik "Nee" -> hint + "Prompt aanpassen" knop
26. Na aanpassen + opnieuw feedback + test -> oude resultaten vervangen

### Meerdere rollen
27. Voltooi Uitlegger -> klik op Brainstormer -> rechts reset, lege velden
28. Voltooi Brainstormer -> beide hebben vinkje
29. Klik terug op Uitlegger -> velden zijn leeg (niet opgeslagen), vinkje blijft

### Rol wisselen met onvoltooid werk
30. Begin met Uitlegger, vul 2 velden in, klik op Brainstormer -> bevestigingsdialoog
31. Bevestig -> wisselt, velden leeg
32. Annuleer -> blijft bij Uitlegger met ingevulde velden

### Verder
33. Geen rol voltooid -> Verder disabled
34. 1 rol voltooid -> Verder actief
35. Klik Verder -> gaat naar volgende pagina/module

### Niveau-differentiatie
36. VMBO: simpele placeholders
37. HAVO: normale placeholders
38. VWO: academische placeholders

### Regressie
39. I-module flow: I1 -> I2 -> (volgende)
40. localStorage voortgang correct
41. Navigatie terug naar I1 werkt
