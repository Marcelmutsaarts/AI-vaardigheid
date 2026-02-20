# I2 Reviewer Agent

## CACHE
Voer ALTIJD `rm -rf .next && npm run build` uit voordat je reviewt.

## Checklist

### Layout
1. Twee kolommen: links rollen (~35%), rechts werkgebied (~65%)
2. Linkerkolom scrollt niet onafhankelijk (of sticky als de rechterkolom lang wordt)
3. Rechterkolom groeit naar beneden naarmate fases verschijnen
4. Alles op een pagina — geen apart rolkeuze-scherm, geen apart prompt-scherm, geen apart chat-scherm

### Rollenlijst (links)
5. Acht rollen in twee groepen met labels
6. Kaartjes compact en verticaal gestapeld
7. Klik op rol -> rechts verschijnt prompt-builder
8. Geselecteerde rol: paarse border + achtergrond
9. Voltooide rol: groen vinkje
10. Wisselen met onvoltooide werk -> bevestigingsdialoog

### Prompt-builder (rechts, fase 1)
11. Vier invulvelden met kleurnummers (amber, emerald, blue, purple)
12. Placeholders niveauafhankelijk
13. Roltitel bovenaan ("Bouw je prompt — Uitlegger")
14. "Vraag feedback" disabled tot Rol + Instructies ingevuld
15. Geen "Uitvoeren" knop in deze fase

### Feedback (rechts, fase 2)
16. Feedback verschijnt ONDER de invulvelden (die blijven zichtbaar)
17. Per veld: vinkje of kruis met korte tekst
18. Kruis-items zijn klikbaar en scrollen naar het veld
19. "Prompt aanpassen" scrollt omhoog
20. "Prompt testen" is altijd beschikbaar na feedback
21. GEEN "Laat AI herschrijven" knop

### Testresultaat (rechts, fase 3)
22. Prompt getoond in grijs blok
23. AI-antwoord in witte kaart
24. Markdown correct gerenderd
25. Geen chatinterface, geen vervolgberichten

### Reflectie (rechts, fase 4)
26. "Kreeg je wat je verwachtte?" met drie buttons
27. "Ja" -> vinkje in linkerkolom, hint om meer te oefenen of verder te gaan
28. "Deels"/"Nee" -> hint om aan te passen, knop scrollt omhoog
29. Na opnieuw aanpassen -> oude feedback/test worden vervangen

### Verder
30. Disabled tot minimaal 1 rol voltooid
31. Staat altijd zichtbaar onderaan rechterkolom

### Opgeruimd
32. Oude rolkeuze-grid verwijderd
33. Oud apart prompt-builder scherm verwijderd
34. "Chat met AI" scherm verwijderd
35. "Laat AI herschrijven" functie verwijderd
36. Geen dode code
