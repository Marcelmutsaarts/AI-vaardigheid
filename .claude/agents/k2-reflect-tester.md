# K2 Reflect Tester Agent

## CACHE
Voer ALTIJD `rm -rf .next && npm run build && npm run dev` uit voordat je test.

## Test Scenarios

### Weergave
1. Aanpak-overzicht toont alle stappen uit fase 2
2. Opdrachtnaam correct bovenaan kaart
3. Per stap: nummer + tekst + aanpak-pill
4. Stap met "Zelf": pill toont "✋ Zelf"
5. Stap met één rol: pill toont emoji + naam
6. Stap met meerdere rollen: pill toont emoji's, hover = tooltip met namen
7. Geen paarse instructieblokken aanwezig
8. Geen proza-samenvatting aanwezig
9. "Wat doet deze aanpak met..." zichtbaar boven vragen

### Reflectievragen
10. Drie rijen: leren, kwaliteit, snelheid
11. Labels bevatten vet woord
12. Drie buttons per rij
13. Klik op button → wordt paars, andere in rij resetten
14. Klik op al-gekozen button → deselecteert (of blijft, afhankelijk van implementatie — documenteer)
15. Alle drie beantwoord → Verder actief
16. Niet alle drie beantwoord → Verder disabled

### Navigatie
17. Verder → gaat naar volgende stap/pagina
18. Terug → gaat naar fase 2 met keuzes intact
19. Antwoorden overleven heen-en-terug

### Regressie
20. Hele K-flow: transitie → fase 1 → fase 2 → inschatten → (volgende)
21. localStorage correct
22. Test met VMBO, HAVO, VWO
