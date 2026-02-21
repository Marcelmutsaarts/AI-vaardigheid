# S-Module Reviewer Agent

## CACHE
Voer ALTIJD `rm -rf .next && npm run build` uit voordat je reviewt.

## Checklist

### Layout
1. Twee kolommen: links (~35% sticky), rechts (~65%)
2. Alles op één pagina — geen aparte S1/S2/S3 pagina's
3. Rechterkolom wisselt tussen introductie en oefeningen

### Linkerkolom
4. Visueel thema-blok met drie iconen + ondertitel
5. Drie onderdeel-knoppen: klikbaar, geselecteerde state, voltooid-vinkje
6. Vrije volgorde — geen verplichte sequentie
7. Verder-knop disabled tot alle drie voltooid

### Thema-introductie (begintoestand rechts)
8. Drie visuele kaarten naast elkaar (Privacy, Transparantie, Duurzaamheid)
9. Kaarten zijn klikbaar → selecteert dat onderdeel
10. Introtekst is niveauafhankelijk
11. Verschijnt alleen als nog geen onderdeel geselecteerd is

### S1 Privacy (ingebed in rechterkolom)
12. Drie invulkaarten (Van jezelf, Van anderen, Vertrouwelijk) zichtbaar
13. Check-knoppen werken per kaart
14. Feedback verschijnt na check
15. Oefening identiek aan huidige S1

### S2 Transparantie (ingebed in rechterkolom)
16. Schoolbeleid MC-vraag werkt
17. Werkstuk-scenario met AI-strategie zichtbaar
18. Reflectievraag + Check werkt
19. Oefening identiek aan huidige S2

### S3 Duurzaamheid (ingebed in rechterkolom)
20. Intro + MC energievraag zichtbaar
21. Feedback na antwoord
22. Oefening identiek aan huidige S3

### Wisselen
23. Klik op ander onderdeel → rechterkolom wisselt direct
24. Onvoltooide voortgang bewaard (terugklikken = verdergaan waar je was)
25. Voltooide onderdelen: feedback blijft zichtbaar bij terugklikken

### Opgeruimd
26. Oude S1/S2/S3 pagina's verwijderd
27. Routing aangepast — één route voor S-module
28. Geen dode code of ongebruikte imports
29. CLAUDE.md bijgewerkt
