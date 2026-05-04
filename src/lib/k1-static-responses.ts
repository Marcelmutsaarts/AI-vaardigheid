// Statische, vooraf opgestelde reacties voor de K1 rollen.
// Vervangt live Gemini-API-aanroepen om tokens te besparen.
// Markdown wordt gerenderd in de UI — gebruik gerust **bold**, lijsten, > blockquotes, *italics*.

export type NiveauGroep = 'vmbo' | 'havo' | 'vwo'

export const VOORBEELD_KEY = '__voorbeeld__'

type RoleResponses = Record<string, string>

export const k1StaticResponses: Record<NiveauGroep, Record<string, RoleResponses>> = {
  // ============================================================
  // VMBO
  // ============================================================
  vmbo: {
    uitlegger: {
      'Voetbal': `**Voetbal** is een sport die je met een bal en je voeten speelt. Twee teams van elf spelers proberen de bal in het **doel** van de tegenstander te schoppen. Het team met de meeste **goals** wint.

Een wedstrijd duurt **90 minuten**, verdeeld in twee helften van 45 minuten. Daar tussenin zit een pauze van een kwartier (de **rust**).

Op het veld staan verschillende posities:

- **Keeper**: staat in het doel en mag de bal met de handen pakken
- **Verdedigers**: zorgen dat de tegenstander niet kan scoren
- **Middenvelders**: helpen mee verdedigen en aanvallen
- **Aanvallers**: proberen te scoren

De **scheidsrechter** let op de regels. Krijg je een **gele kaart**, dan is dat een waarschuwing. Bij een **rode kaart** moet je het veld af. Voetbal is de populairste sport ter wereld.`,
      'Social media': `**Social media** zijn apps en websites waar je dingen deelt met anderen. Denk aan **Instagram**, **TikTok**, **Snapchat** en **YouTube**. Je kan er foto's, filmpjes en berichten plaatsen.

Wat kan je er allemaal doen?

- **Posten**: zelf iets delen, zoals een foto of video
- **Liken**: een hartje geven als je iets leuk vindt
- **Reageren**: een bericht schrijven onder een post
- **Volgen**: berichten van iemand anders zien

Veel jongeren zitten **uren per dag** op social media. Dat is leuk, want je blijft op de hoogte van vrienden. Maar het kan ook **verslavend** zijn. Soms voel je je minder goed omdat anderen er perfect uitzien — die foto's zijn meestal **bewerkt**.

Tip: zet een tijdslimiet en zet meldingen uit als je rust wil.`,
      'Gezonde voeding': `**Gezonde voeding** is eten en drinken waar je lichaam **goede stoffen** uit haalt. Daarmee krijg je **energie** en blijf je fit. De Schijf van Vijf laat zien wat je elke dag nodig hebt.

In gezonde voeding zitten belangrijke stoffen:

- **Vitamines**: zitten in groente en fruit
- **Eiwitten**: zitten in vlees, vis, bonen en eieren
- **Koolhydraten**: zitten in brood, pasta en aardappelen
- **Vetten**: zitten in olie, noten en kaas (de goede vetten)

Ook **water drinken** is super belangrijk — minstens **1,5 liter per dag**.

Probeer **frisdrank**, **chips** en **snoep** niet elke dag te nemen. Daar zit veel suiker en zout in. Dat geeft eerst een boost, maar daarna word je juist moe. Eet je gezond? Dan slaap je beter en heb je meer energie op school.`,
    },
    brainstormer: {
      'Voetbal': `Hier zijn een paar vragen om over **voetbal** na te denken:

1. Waarom denk je dat voetbal de **populairste sport** ter wereld is, en niet bijvoorbeeld basketbal of tennis?
2. Wat zou er gebeuren met het spel als je de **buitenspelregel** zou afschaffen?
3. Vind jij het eerlijk dat een topvoetballer **miljoenen** verdient terwijl een leraar veel minder krijgt?

Welke vraag pakt jou het meest? Schrijf je eerste gedachte op — dan kan je daarna verder denken.`,
      'Social media': `Een paar vragen om over **social media** na te denken:

1. Waarom denk je dat we steeds vaker op onze telefoon kijken — wat doen die apps met ons brein?
2. Als je morgen alle social media moest **uitzetten**, wat zou je dan missen en wat juist niet?
3. Is het oké dat **influencers** geld krijgen voor reclame zonder dat duidelijk te zeggen?

Kies één vraag en schrijf je eerste antwoord op. Geen goed of fout — gewoon wat jij denkt.`,
      'Gezonde voeding': `Drie vragen om over **gezonde voeding** na te denken:

1. Waarom is **ongezond eten** vaak goedkoper dan gezond eten in de supermarkt?
2. Als je elke dag perfect gezond zou eten, zou dat **leuker of saaier** zijn dan nu?
3. Wie heeft de grootste invloed op wat jij eet — je ouders, vrienden, school of reclame?

Welke vraag is voor jou het interessantst? Begin daar je antwoord op te schrijven.`,
    },
    oefenmaatje: {
      'Voetbal': `Hier komt een vraagje over **voetbal**. Denk goed na, het antwoord staat niet in mijn bericht.

> Een speler staat alleen voor de keeper. Op het moment dat zijn teamgenoot de bal speelt, staat hij dichter bij het doel dan de laatste verdediger. Wat is hier aan de hand, en mag de scheidsrechter doorlaten of niet?

*Tip: denk aan een regel met "buiten" in de naam.*`,
      'Social media': `Een oefenvraag over **social media**:

> Stel: je ziet op TikTok een video waarin iemand zegt dat een bekend energiedrankje superhealthy is. De maker krijgt geld van het merk, maar zegt dat niet. Welke twee dingen kunnen er fout gaan voor de kijker?

*Tip: denk aan **eerlijkheid** en aan wat zo'n drankje doet met je lichaam.*`,
      'Gezonde voeding': `Klein vraagje om over na te denken — geen goed of fout antwoord, gewoon goed redeneren.

> Twee leerlingen eten allebei "gezond". De een eet alleen sla en water. De ander eet brood, kaas, een appel en een glas melk. Wie eet eigenlijk gezonder, en waarom?

*Hint: gezond is niet hetzelfde als zo min mogelijk.*`,
    },
    schrijver: {
      'Voetbal': `**Voetbal is meer dan een sport** — het is een wereldwijd fenomeen dat miljoenen mensen samenbrengt. Van een grasveldje achter school tot het volle stadion van een WK-finale, overal wordt er met dezelfde bal gespeeld. Twee teams van elf, één doel: scoren in het doel van de tegenstander. Wat voetbal zo bijzonder maakt is dat iedereen mee kan doen — je hebt alleen een bal en wat ruimte nodig. De spanning, het samenspelen en het juichen na een goal maken het tot dé sport van veel jongeren.

*Tip: kijk of dit echt aansluit bij wat jij ervan vindt — pas het gerust aan met jouw voorbeelden of een eigen ervaring.*`,
      'Social media': `**Social media spelen een grote rol in het leven van jongeren.** Apps zoals Instagram, TikTok en Snapchat zijn niet meer weg te denken — ze worden gebruikt om foto's te delen, vrienden te volgen en filmpjes te bekijken. Het leuke is dat je altijd in contact blijft, ook met mensen die ver weg wonen. Maar er zijn ook nadelen: te lang scrollen kan zorgen voor minder slaap of een onzeker gevoel, omdat het er online vaak perfecter uitziet dan in het echt. Bewust omgaan met social media betekent zelf kiezen wanneer je kijkt en wanneer juist niet.

*Tip: voeg een eigen voorbeeld toe — bijvoorbeeld jouw favoriete app of hoe lang jij er per dag op zit. Dan wordt het persoonlijker.*`,
      'Gezonde voeding': `**Gezond eten is belangrijk om je goed te voelen en genoeg energie te hebben.** In gezonde voeding zitten vitamines, eiwitten en vezels die je lichaam nodig heeft om te groeien en sterk te blijven. Groente, fruit, volkoren brood en water vormen de basis — daarnaast zijn vis, kip en peulvruchten goed voor je spieren. Ongezond eten zoals frisdrank en chips is niet verboden, maar te veel zorgt voor minder energie en kan je humeur beïnvloeden. Door af te wisselen en bewust te kiezen, blijf je fit zonder dat eten saai wordt.

*Tip: maak het concreter door jouw ontbijt of lunch als voorbeeld te gebruiken — dat maakt de tekst persoonlijker.*`,
    },
    feedbackgever: {
      [VOORBEELD_KEY]: `Hier is feedback op je werkstuk over social media. Je doet het al goed — let vooral op een paar puntjes.

**Sterk punt:**

- Je geeft een **eigen mening** en maakt duidelijk dat het niet alleen goed of slecht is. Dat is knap, want veel mensen denken zwart-wit hierover.

**Verbeterpunten:**

- **Voorbeelden toevoegen**: je zegt "verslaafd" en "onzeker", maar geef een **concreet voorbeeld** — bijvoorbeeld "iemand checkt elke 5 minuten zijn telefoon" of "je vergelijkt jezelf met perfecte foto's".
- **Schrijftaal**: het woord "ofzo" en "best wel" passen niet zo goed in een werkstuk. Probeer te schrijven zoals je een **netjes berichtje** aan je leraar zou sturen.

Goed begin — met deze twee aanpassingen wordt het echt een sterk stukje.`,
    },
    vertaler: {
      [VOORBEELD_KEY]: `> I made a project about social media. Social media is very popular among young people. Almost everyone has Instagram or TikTok on their phone. Many people use it every day, sometimes even 3 hours or more. It is fun because you can watch videos and chat with friends. But it can also be addictive, and then you go to bed too late. Some people also become insecure because everyone looks perfect online. I think you should be careful with it, but it is not all bad either.`,
    },
    verbeteraar: {
      [VOORBEELD_KEY]: `Hier is een nettere versie van je tekst:

> Voor school heb ik een werkstuk gemaakt over **social media**. Social media is enorm populair bij jongeren — bijna iedereen heeft Instagram of TikTok op zijn telefoon. Veel mensen gebruiken het meerdere uren per dag. Dat is leuk, want je kunt filmpjes kijken en met vrienden chatten. Tegelijk kan het **verslavend** werken: voor je het weet ga je veel te laat naar bed. Sommige mensen worden er ook **onzeker** van, omdat iedereen er online perfect uitziet. Ik vind dat je voorzichtig met social media moet omgaan, maar het is zeker niet alleen maar slecht.

**Wat is veranderd:**

- **"ofzo"** weggehaald — past niet in een schoolwerkstuk
- **"best wel overtuigend"** vervangen door **"verslavend werken"** (duidelijker)
- **Inleidende zin** netter: "Voor school heb ik..." in plaats van "Ik heb..."
- **Belangrijke woorden** dikgedrukt: social media, verslavend, onzeker
- **Slotzin** scherper: van "niet alleen maar slecht ofzo" naar "zeker niet alleen maar slecht"`,
    },
    samenvatter: {
      [VOORBEELD_KEY]: `Social media is heel populair bij jongeren omdat je er filmpjes kijkt en chat, maar het kan ook **verslavend** zijn en je **onzeker** maken — gebruik het bewust.`,
    },
  },

  // ============================================================
  // HAVO
  // ============================================================
  havo: {
    uitlegger: {
      'Klimaatverandering': `**Klimaatverandering** verwijst naar de geleidelijke verandering van weerpatronen op aarde over een lange periode. De gemiddelde temperatuur op onze planeet stijgt — dit noemen we ook wel **opwarming van de aarde**.

De belangrijkste oorzaak is de uitstoot van **broeikasgassen**, vooral **CO2**. Die ontstaat door:

- **Verbranding van fossiele brandstoffen** (olie, gas, kolen)
- **Verkeer en industrie** (auto's, vliegtuigen, fabrieken)
- **Ontbossing** — bomen halen juist CO2 uit de lucht
- **Veeteelt** (vooral methaan van koeien)

De gevolgen zijn merkbaar: extremer weer, smeltende **gletsjers** en ijskappen, **stijgende zeespiegel** en verschuivende leefgebieden van dieren.

Wereldwijd worden afspraken gemaakt om de uitstoot te beperken, zoals het **Akkoord van Parijs**. De overstap naar **duurzame energie** (zon, wind) is daarbij cruciaal — al gaat dat in elk land anders snel.`,
      'Kunstmatige intelligentie': `**Kunstmatige intelligentie**, of **AI**, is technologie die computers in staat stelt taken uit te voeren die normaal menselijk denken vereisen — zoals taal begrijpen, beelden herkennen en beslissingen nemen.

AI werkt op basis van **machine learning**: systemen leren patronen herkennen door grote hoeveelheden data te analyseren. Bekende voorbeelden:

- **Chatbots** zoals ChatGPT die antwoord geven op vragen
- **Beeldgeneratoren** die op basis van tekst plaatjes maken
- **Aanbevelingssystemen** van Netflix, Spotify en TikTok
- **Spraakherkenning** in Siri en Google Assistant

AI is geen "denkend wezen" — het herkent patronen op basis van trainingsdata. Daardoor kan het ook **fouten** maken of **vooroordelen** overnemen die in die data zaten.

De technologie verandert snel hoe we werken, leren en communiceren. De grote vraag is hoe we AI **verantwoord** inzetten — zodat het ons helpt zonder dat we te afhankelijk worden of belangrijke beslissingen aan een algoritme overlaten.`,
      'Sociale media en mentale gezondheid': `Het verband tussen **sociale media en mentale gezondheid** is een onderwerp waar veel onderzoek naar wordt gedaan. Apps zoals Instagram, TikTok en Snapchat zijn diep verweven in het dagelijks leven van jongeren — gemiddeld besteden tieners er meerdere uren per dag aan.

Onderzoek wijst op verschillende effecten:

- **Sociale vergelijking**: voortdurend "perfecte" levens zien kan leiden tot een lager **zelfbeeld**
- **Slaapproblemen**: schermgebruik vlak voor het slapen verstoort de nachtrust
- **FOMO** (fear of missing out): het gevoel iets te missen als je niet online bent
- **Cyberpesten**: pesten dat doorgaat ook na schooltijd

Tegelijk zijn er positieve kanten: **sociale verbinding**, toegang tot informatie en een platform voor jongeren die zich offline minder thuis voelen.

Het is dus geen zwart-wit verhaal. Veel deskundigen wijzen erop dat het vooral gaat om **hoe** je sociale media gebruikt, niet alleen **hoeveel**. Bewust gebruik — meldingen uit, schermtijd-limieten — helpt om de voordelen te behouden zonder de nadelen.`,
    },
    brainstormer: {
      'Klimaatverandering': `Een paar vragen om over **klimaatverandering** door te denken:

1. Als duurzame energie zo belangrijk is, waarom gaat de overstap dan in veel landen zo **traag**?
2. Wie zou er moeten betalen voor de klimaatschade — de **rijke landen** die historisch het meest uitstootten, of de **opkomende economieën** die nu groeien?
3. Heeft jouw individuele gedrag (vegetarisch eten, minder vliegen) écht impact, of zijn alleen **systemische veranderingen** effectief?

Welke van deze vragen raakt voor jou de kern? Werk die het eerst uit.`,
      'Kunstmatige intelligentie': `Drie vragen om over **AI** na te denken:

1. Als AI-systemen worden getraind op data vol menselijke **vooroordelen**, kunnen ze dan ooit "neutraal" zijn?
2. Welke beroepen zullen volgens jou **veranderen** door AI in plaats van **verdwijnen**, en welke verdwijnen écht?
3. Wie is verantwoordelijk als een **zelfrijdende auto** een ongeluk veroorzaakt — de bestuurder, de fabrikant of de programmeur?

Begin met de vraag waar je het minste idee bij hebt — daar valt het meest te leren.`,
      'Sociale media en mentale gezondheid': `Hier zijn een paar vragen om over **sociale media en mentale gezondheid** te brainstormen:

1. Is het probleem de **technologie zelf**, of de manier waarop we ermee zijn opgegroeid zonder duidelijke regels?
2. Zou een minimumleeftijd van **16 jaar** voor sociale media (zoals in Australië) hier ook werken?
3. Waarom voelen we ons soms slechter na het scrollen, terwijl we het toch blijven doen — wat zegt dat over **gewoonte versus keuze**?

Pak één vraag en formuleer eerst je eigen hypothese voordat je verder denkt.`,
    },
    oefenmaatje: {
      'Klimaatverandering': `Een oefenvraag over **klimaatverandering** — denk goed na, het antwoord moet je zelf vinden.

> Een fabriek in Nederland stoot CO2 uit en verplaatst zijn productie naar een land met soepelere regels. De wereldwijde uitstoot blijft hetzelfde of stijgt zelfs. Hoe heet dit fenomeen, en waarom is het problematisch voor klimaatbeleid?

*Tip: zoek naar het begrip dat begint met "**carbon**" — en denk na over wat klimaatbeleid eigenlijk wil bereiken.*`,
      'Kunstmatige intelligentie': `Een vraag over **AI** om over na te denken:

> Een AI-systeem voor sollicitaties wordt getraind op gegevens van werknemers die de afgelopen tien jaar zijn aangenomen bij een groot techbedrijf. Het systeem blijkt vrouwen vaker af te wijzen dan mannen. Hoe kan dit gebeuren, ook al heeft niemand het systeem opzettelijk seksistisch geprogrammeerd?

*Tip: het antwoord zit in het soort **data** waarop het systeem heeft geleerd.*`,
      'Sociale media en mentale gezondheid': `Een vraag om scherp over na te denken:

> Twee studies komen tot tegengestelde conclusies over **sociale media en depressie** bij jongeren: studie A vindt een sterk verband, studie B vindt nauwelijks effect. Geef twee mogelijke verklaringen waarom serieuze wetenschappers tot zulke verschillende uitkomsten kunnen komen.

*Tip: denk aan **onderzoeksopzet**, **steekproef** en hoe je iets als "sociale media-gebruik" eigenlijk meet.*`,
    },
    schrijver: {
      'Klimaatverandering': `**Klimaatverandering is een van de grootste uitdagingen van deze eeuw.** Wetenschappers zijn het erover eens dat de gemiddelde temperatuur op aarde stijgt door de uitstoot van broeikasgassen, met name CO2. De gevolgen zijn nu al zichtbaar: extremer weer, smeltende ijskappen en stijgende zeespiegels die kustgebieden bedreigen. Tegelijk is de oplossing complex — de overgang naar duurzame energiebronnen vraagt enorme investeringen, en niet elk land heeft daar dezelfde mogelijkheden voor. Internationale afspraken zoals het Akkoord van Parijs zijn een eerste stap, maar de uitvoering blijft achter bij de ambities.

*Tip: kijk of dit aansluit bij wat jij wil zeggen — voeg eventueel een eigen voorbeeld toe of een actuele gebeurtenis die het persoonlijker maakt.*`,
      'Kunstmatige intelligentie': `**Kunstmatige intelligentie ontwikkelt zich in een tempo dat weinigen hadden voorzien.** Van chatbots die in seconden een essay schrijven tot beeldgeneratoren die fotorealistische plaatjes maken — AI is in korte tijd een vast onderdeel van het dagelijks leven geworden. De voordelen zijn evident: efficiëntere zorg, snellere wetenschappelijke doorbraken en toegankelijkere kennis. Tegelijk roept de technologie belangrijke vragen op, zoals wat er gebeurt met banen die door AI worden overgenomen, en hoe we voorkomen dat algoritmes bestaande ongelijkheden versterken. De komende jaren zal vooral draaien om de vraag hoe we AI verantwoord inzetten zonder de menselijke maat uit het oog te verliezen.

*Tip: maak het concreter door een AI-toepassing te noemen die jij zelf gebruikt of waarover je hebt gelezen — dat geeft het stuk meer leven.*`,
      'Sociale media en mentale gezondheid': `**De relatie tussen sociale media en mentale gezondheid is een van de meest besproken thema's onder jongeren.** Apps als Instagram en TikTok bieden ontspanning, sociaal contact en een podium voor creativiteit, maar onderzoek wijst ook op risico's. Voortdurende blootstelling aan gefilterde levens kan leiden tot sociale vergelijking en een lager zelfbeeld, terwijl laat scrollen de slaapkwaliteit aantast. Toch is het beeld niet eenduidig: voor sommigen zijn deze platforms juist een belangrijke bron van steun en verbinding. De kern van de discussie verschuift dan ook van "is sociale media slecht?" naar "hoe gebruik je het bewust?". Kleine keuzes — meldingen uit, schermtijd-limieten, kritisch kijken naar wat je volgt — maken vaak meer verschil dan helemaal stoppen.

*Tip: pas dit aan jouw invalshoek aan — schrijf je vooral over de risico's of over verantwoord gebruik?*`,
    },
    feedbackgever: {
      [VOORBEELD_KEY]: `Hier is feedback op je tekst over klimaatverandering. Je legt het in de basis goed uit — een paar punten kunnen het sterker maken.

**Sterk punt:**

- Je toont **nuance** door zowel de wetenschappelijke consensus te erkennen als de complicaties (kosten, internationale verschillen) te benoemen. Dat maakt het een evenwichtig stuk in plaats van een eenzijdig pleidooi.

**Verbeterpunten:**

- **Concrete cijfers toevoegen**: "de temperatuur stijgt" wordt veel sterker met een feit erbij — bijvoorbeeld "ongeveer 1,1 graad sinds 1880". Dat geeft je betoog gewicht.
- **Schrijftaal aanscherpen**: zinnen als "best wel overtuigend" en "ook weer heel duur" zijn spreektaal. Vervang door **"overtuigend"** en **"kostbaar"** — directer en passender voor het niveau.

Je rondt mooi af met de vraag over eerlijke verdeling — daar kun je in een vervolg-alinea op doorpakken voor extra diepgang.`,
    },
    vertaler: {
      [VOORBEELD_KEY]: `> Global warming is one of the biggest problems of our time. Scientists say that the average temperature is rising due to CO2 emissions from factories, cars, and airplanes. Some people don't believe this, but the scientific evidence is quite convincing. The consequences include floods, longer periods of drought, and the melting of ice at the North and South Pole. This also affects animals that lose their habitats. We really should be doing much more about renewable energy, but that is also very expensive, and not every country can afford it. The question, therefore, is how to distribute this fairly across all countries.`,
    },
    verbeteraar: {
      [VOORBEELD_KEY]: `Hier is een aangescherpte versie van je tekst:

> De **opwarming van de aarde** is een van de grootste vraagstukken van onze tijd. Wetenschappers stellen vast dat de gemiddelde temperatuur stijgt door de uitstoot van **CO2** door fabrieken, auto's en vliegtuigen. Hoewel een minderheid hieraan twijfelt, is het wetenschappelijk bewijs **overtuigend**. De gevolgen zijn ingrijpend: overstromingen, langere droogteperiodes en het smelten van ijs op de Noord- en Zuidpool. Ook dieren verliezen hun leefgebied. De overgang naar **duurzame energie** is noodzakelijk, maar **kostbaar** — en niet elk land heeft daar dezelfde middelen voor. De centrale vraag wordt dan ook: hoe verdelen we deze inspanning **eerlijk** over alle landen?

**Wat is veranderd:**

- **"best wel overtuigend"** → **"overtuigend"** (geen onnodige stopwoorden)
- **"sommige mensen geloven dit niet"** → **"hoewel een minderheid hieraan twijfelt"** (beter passend bij niveau)
- **"ook weer heel duur"** → **"kostbaar"** (compacter, formeler)
- Vakbegrippen **dikgedrukt**: opwarming, CO2, duurzame energie, kostbaar, eerlijk
- **Slotvraag** retorisch sterker geformuleerd: "De centrale vraag wordt dan ook…"`,
    },
    samenvatter: {
      [VOORBEELD_KEY]: `De opwarming van de aarde wordt veroorzaakt door CO2-uitstoot en heeft ingrijpende gevolgen, maar de overgang naar duurzame energie is **kostbaar** — wat de vraag oproept hoe landen deze last **eerlijk** verdelen.`,
    },
  },

  // ============================================================
  // VWO
  // ============================================================
  vwo: {
    uitlegger: {
      'Klimaatverandering': `**Klimaatverandering** is de structurele wijziging van weerpatronen en gemiddelde temperaturen op aarde, in het huidige tijdperk overwegend veroorzaakt door menselijk handelen — een proces dat ook wel **antropogene opwarming** wordt genoemd.

De fysische basis is robuust onderbouwd: de toenemende concentratie **broeikasgassen** (vooral **CO2** en **methaan**) versterkt het natuurlijke broeikaseffect, waardoor minder warmte de atmosfeer verlaat. Belangrijkste oorzaken:

- **Verbranding van fossiele brandstoffen** in industrie, transport en energieopwekking
- **Ontbossing**, met name in tropische regio's
- **Intensieve veehouderij** (methaanuitstoot)
- **Industriële landbouw** en bodemdegradatie

De gevolgen manifesteren zich op meerdere schalen: stijging van de zeespiegel, frequenter extreem weer, verschuiving van **klimaatzones** en biodiversiteitsverlies. Mitigatie via **decarbonisatie** en adaptatie via klimaatbestendige infrastructuur zijn de twee pijlers van internationaal beleid, vastgelegd in onder meer het **Akkoord van Parijs** (2015). De ethische dimensie — historische verantwoordelijkheid versus huidige draagkracht — blijft daarbij een geopolitiek splijtpunt.`,
      'Kunstmatige intelligentie': `**Kunstmatige intelligentie** (AI) verwijst naar computationele systemen die taken uitvoeren waarvoor traditioneel menselijke cognitie vereist werd — taalverwerking, patroonherkenning, redeneren en beslissen. De huidige doorbraak berust grotendeels op **deep learning** en **transformer-architecturen**, getraind op massieve corpora.

Belangrijke onderscheidingen:

- **Smalle AI** (narrow AI): gespecialiseerd in één domein — beeldherkenning, schaken, vertaling
- **Generatieve AI**: produceert nieuwe content op basis van prompts (LLM's, beeldmodellen)
- **Algemene AI** (AGI): hypothetische systemen met menselijke flexibiliteit — vooralsnog **speculatief**

De maatschappelijke implicaties zijn substantieel. AI versnelt wetenschappelijk onderzoek, transformeert arbeidsmarkten en verlegt machtsverhoudingen tussen techbedrijven, staten en burgers. Tegelijk roept de technologie fundamentele vraagstukken op: **algoritmische bias** die structurele ongelijkheden reproduceert, **black-box-besluitvorming** die democratische verantwoording bemoeilijkt, en de concentratie van rekenkracht bij enkele actoren.

Het huidige debat verschuift dan ook van puur technische optimalisatie naar **AI-governance**: regulering, transparantie-eisen en publieke controle over systemen die steeds dieper in kritieke infrastructuur worden ingebed.`,
      'Ethiek van genbewerking': `**Genbewerking** — het doelgericht modificeren van DNA met technieken als **CRISPR-Cas9** — heeft een revolutie teweeggebracht in de levenswetenschappen. Wat tot voor kort theoretisch en kostbaar was, is nu in laboratoria wereldwijd toepasbaar. De ethische vragen die hieruit voortvloeien zijn evenredig groot.

Cruciaal is het onderscheid tussen twee toepassingsgebieden:

- **Somatische genbewerking**: aanpassingen in lichaamscellen van een individu, niet erfelijk — relatief breed geaccepteerd voor therapeutische doeleinden (sikkelcelziekte, bepaalde kankers)
- **Kiembaanmodificatie**: aanpassingen in geslachtscellen of embryo's, **wél erfelijk** — internationaal grotendeels verboden vanwege onomkeerbaarheid

De ethische overwegingen bewegen zich op meerdere assen. **Autonomie**: kan je toekomstige generaties laten "instemmen" met genetische ingrepen? **Rechtvaardigheid**: dreigt een tweedeling tussen wie zich genetische "verbeteringen" kan veroorloven en wie niet? **Hellend vlak**: waar ligt de grens tussen behandeling van ziekte en **enhancement** richting cognitieve of fysieke optimalisatie?

Het He Jiankui-incident (2018), waarbij in China voor het eerst genetisch gemodificeerde baby's werden geboren, illustreerde hoe snel de praktijk de regelgeving kan inhalen. Voorzichtigheidsbeginsel en mondiale **bio-ethische governance** zijn daarmee onverminderd urgent.`,
    },
    brainstormer: {
      'Klimaatverandering': `Drie vragen om dieper over **klimaatverandering** na te denken:

1. In hoeverre laat het paradigma van **individuele verantwoordelijkheid** (vegetarisch eten, vliegen vermijden) de aandacht afdwalen van **structurele macht** — fossiele lobbies, internationale handelsverdragen, kapitaalstromen?
2. Is **klimaatrechtvaardigheid** (rijke landen betalen voor schade aan kwetsbare landen) ethisch gefundeerd of vooral pragmatisch onhoudbaar — en maakt dat onderscheid uit?
3. Welke **discontovoet** zouden we moeten hanteren bij het waarderen van toekomstige generaties? Een hoge discontovoet rechtvaardigt uitstel, een lage rechtvaardigt drastische actie nu — wie beslist over die parameter?

Begin met de vraag waar je intuïtie het minst stevig is — daar zit doorgaans de meeste leerwinst.`,
      'Kunstmatige intelligentie': `Drie kritische vragen over **AI**:

1. Als grote taalmodellen worden getraind op data die historische **machtsstructuren** reflecteert, bestendigen ze die dan onvermijdelijk — of biedt **algorithmic auditing** een werkbare uitweg?
2. Het concept van **AI-alignment** vooronderstelt dat menselijke waarden coherent en kenbaar zijn. In hoeverre is die vooronderstelling houdbaar gezien morele pluraliteit en interculturele verschillen?
3. Wat zegt de huidige AI-hype over de **politieke economie** van technologie — wie profiteert structureel, en wie draagt de kosten van datawerk, energie en maatschappelijke verschuivingen?

Welke van deze drie vraagt om het meeste **lezen voor je een mening vormt**? Daar zou ik beginnen.`,
      'Ethiek van genbewerking': `Drie vragen om over **genbewerking** te overwegen:

1. Is het onderscheid tussen **therapie** en **enhancement** filosofisch houdbaar, of een sociaal-cultureel construct dat verschuift met wat als "normaal" geldt?
2. Het **voorzorgsbeginsel** wordt vaak ingeroepen tegen kiembaanmodificatie. Maar als een ingreep een aantoonbare ziekte voorkomt, is **niet ingrijpen** dan zelf ook niet een ethisch beladen keuze?
3. Hoe organiseer je **mondiale governance** voor een technologie die in elk redelijk uitgerust laboratorium toegankelijk is — met welke afdwingingsmechanismen?

Pak één vraag, formuleer je hypothese, en confronteer die vervolgens met het sterkst denkbare tegenargument.`,
    },
    oefenmaatje: {
      'Klimaatverandering': `Een oefenvraag op niveau — formuleer een doordacht antwoord, geen eenregelig oordeel.

> Een klimaateconoom betoogt dat een **CO2-belasting** efficiënter is dan een **emissiehandelssysteem** (ETS), omdat de prijs voorspelbaar is. Een tegenstander stelt dat een ETS effectiever is omdat het volume aan emissies wordt vastgelegd in plaats van de prijs. Welk argument vind jij sterker, en welke economische aanname maakt jouw keuze plausibel?

*Tip: het antwoord hangt af van of je **prijszekerheid** of **volumezekerheid** belangrijker vindt — en waarom.*`,
      'Kunstmatige intelligentie': `Een vraagstuk over **AI** dat zorgvuldig redeneren vereist:

> Een ziekenhuis overweegt een AI-systeem in te zetten dat triage-beslissingen neemt. Het systeem is gemiddeld **accurater** dan menselijke artsen, maar maakt af en toe fouten die voor mensen onbegrijpelijk zijn (geen voor de hand liggende verklaring in de data). Geef twee redenen waarom puur statistische superioriteit hier niet automatisch betekent dat invoering ethisch verantwoord is.

*Tip: denk aan **verantwoordingsplicht** richting patiënten en aan het verschil tussen **gemiddelde uitkomsten** en **fouten in individuele gevallen**.*`,
      'Ethiek van genbewerking': `Een ethisch vraagstuk om scherp uit te werken:

> Een echtpaar draagt beiden een gen voor de ziekte van Huntington. Met **kiembaanmodificatie** kunnen ze garanderen dat hun kind dit gen niet erft. Het ingrijpen is **erfelijk** — al hun nakomelingen zijn ook genezen. Werk de spanning uit tussen het belang van het kind, de erfelijke gevolgen voor toekomstige generaties die niet kunnen instemmen, en het mogelijke precedent voor minder dwingende ingrepen.

*Tip: gebruik onderscheidingen uit de bio-ethiek (autonomie, niet-schaden, rechtvaardigheid) — en weeg ook of **niet-handelen** zelf een morele keuze is.*`,
    },
    schrijver: {
      'Klimaatverandering': `**Klimaatverandering vormt een van de meest fundamentele uitdagingen van het hedendaagse internationale bestel.** De wetenschappelijke consensus over de antropogene oorsprong is, blijkens onder meer de IPCC-rapporten, robuust onderbouwd, maar de politieke en economische vertaling ervan blijft moeizaam. De spanning tussen historische verantwoordelijkheid van industriële naties en de ontwikkelingsnoden van opkomende economieën doortrekt nagenoeg elk klimaattop-onderhandelingsproces. Daarbij komt dat mitigatie en adaptatie niet als alternatieven moeten worden beschouwd, maar als complementaire strategieën — beide vragen substantiële investeringen in een tijdsbestek waarin geopolitieke verschuivingen de internationale samenwerking bemoeilijken. Klimaatbeleid is daarmee niet primair een technisch maar een **politiek-ethisch** vraagstuk.

*Tip: scherp aan met een eigen invalshoek — bijvoorbeeld een specifiek dilemma (klimaatrechtvaardigheid, technologische optimisme, transitiebeleid) waarop je verder wil bouwen.*`,
      'Kunstmatige intelligentie': `**Kunstmatige intelligentie heeft zich in korte tijd ontwikkeld van een academisch specialisme tot een infrastructuur die verweven raakt met economie, bestuur en publieke ruimte.** Generatieve modellen demonstreren capaciteiten die enkele jaren geleden nog speculatief leken, terwijl tegelijk de zorgen toenemen over **algoritmische bias**, dataschaarste van kwaliteit en de concentratie van rekenkracht bij enkele dominante actoren. De ethische discussie verplaatst zich daarmee van geïsoleerde toepassingen naar systemische vragen: wie controleert de modellen die in toenemende mate beslissingen ondersteunen of overnemen? In hoeverre is **democratische verantwoording** te verenigen met de ondoorzichtigheid van neurale netwerken? Het antwoord zal vermoedelijk niet in technische oplossingen alleen liggen, maar in een combinatie van regelgeving, transparantie-eisen en publieke gesprekken over welke domeinen we willen automatiseren — en welke niet.

*Tip: persoonlijker maken kan door één concreet voorbeeld uit te werken — bijvoorbeeld AI in de rechtspraak, in selectieprocedures of in het onderwijs.*`,
      'Ethiek van genbewerking': `**De opkomst van CRISPR-Cas9 heeft de ethiek van genbewerking van een toekomstvraagstuk in een actueel dilemma veranderd.** Waar de mogelijkheid om DNA te modificeren ooit het domein was van enkele topinstituten, is de techniek nu wereldwijd toegankelijk — met alle gevolgen voor regulering en handhaving. De morele weging draait om verschillende assen tegelijk: het **autonomieprincipe** in relatie tot toekomstige generaties die niet kunnen instemmen met erfelijke ingrepen, het **rechtvaardigheidsvraagstuk** rond toegang tot dergelijke technologie, en het klassieke **hellend vlak** tussen therapie en enhancement. Het He Jiankui-incident in 2018 maakte pijnlijk zichtbaar hoe snel feitelijke praktijk een nog onuitgekristalliseerd ethisch kader kan voorbijschieten. Een doordachte **bio-ethische governance** vereist daarom niet alleen nationale wetgeving, maar internationale afstemming — en het besef dat ook **niet-handelen** een morele positie is.

*Tip: voeg een specifieke casus toe (Huntington, sikkelcel, designerbaby's) of een filosofisch perspectief (Habermas, Sandel) om het stuk op te tillen.*`,
    },
    feedbackgever: {
      [VOORBEELD_KEY]: `Hier is gerichte feedback op je tekst over kunstmatige intelligentie. De analytische invalshoek is goed — een paar punten kunnen het stuk academisch sterker maken.

**Sterk punt:**

- Je benoemt de **ethische dimensie van AI-bias** in relatie tot **trainingsdata** en signaleert dat ethische implicaties vaak onderbelicht blijven in het publieke debat. Dat is een scherpe observatie die de tekst boven oppervlakkige beschouwingen uittilt.

**Verbeterpunten:**

- **Spelfout en register**: "**bied**" moet "**biedt**" zijn (derde persoon enkelvoud). Daarnaast is "**best wel relevant**" te informeel — vervang door "**in toenemende mate relevant**".
- **Argumentatie aanscherpen**: je stelt dat experts "verschillende perspectieven" hebben, maar werkt geen van die perspectieven concreet uit. Noem expliciet **wie** wat beweert (bijvoorbeeld arbeidseconomen versus techfilosofen) en **welke aannames** daaronder liggen — dat geeft je tekst de academische precisie die past bij dit niveau.

De afsluitende observatie over onderbelichte ethische implicaties is sterk — die zou een goede springplank zijn voor een vervolg-alinea waarin je één specifieke ethische kwestie (bias, autonomie, governance) uitdiept.`,
    },
    vertaler: {
      [VOORBEELD_KEY]: `> The discussion surrounding artificial intelligence is becoming increasingly relevant in our society. Various perspectives exist regarding the impact AI will have on the labour market and education. Some experts argue that AI will replace jobs, while others point to new opportunities that will emerge. A significant concern is the potential reinforcement of existing inequalities — for example, because AI systems are trained on data that contains biases. At the same time, AI offers opportunities for more efficient healthcare and scientific research. It is a complex issue to which there is no straightforward answer. The ethical implications of AI use are often underestimated in public debate, while it is precisely there that the discussion is most urgently needed.`,
    },
    verbeteraar: {
      [VOORBEELD_KEY]: `Hier is een academisch aangescherpte versie van je tekst:

> De discussie over **kunstmatige intelligentie** wordt in toenemende mate relevant binnen onze samenleving. Er bestaan uiteenlopende perspectieven op de impact die AI zal hebben op de **arbeidsmarkt** en het onderwijs: waar arbeidseconomen wijzen op grootschalige automatisering van bestaande functies, benadrukken anderen de opkomst van geheel nieuwe beroepsdomeinen. Een centraal aandachtspunt is de mogelijke versterking van structurele ongelijkheden, doordat AI-systemen worden getraind op data waarin **historische vooroordelen** zijn ingebed. Tegelijkertijd **biedt** AI substantiële kansen voor efficiëntere gezondheidszorg en versneld wetenschappelijk onderzoek. Het betreft een complex vraagstuk waarop geen eenduidig antwoord mogelijk is. Met name de **ethische implicaties** van AI-toepassingen blijven in het publieke debat onderbelicht, terwijl juist daar de noodzaak tot reflectie het grootst is.

**Wat is veranderd:**

- **"bied"** → **"biedt"** (correcte vervoeging)
- **"steeds relevanter"** → **"in toenemende mate relevant"** (academisch register)
- **"verschillende perspectieven"** geconcretiseerd: arbeidseconomen versus techfilosofen
- **"vooroordelen"** vervangen door **"historische vooroordelen"** (preciezer concept)
- Vakbegrippen **dikgedrukt**: kunstmatige intelligentie, arbeidsmarkt, ethische implicaties
- **Slotzin** retorisch sterker: van "wordt vaak onderschat" naar "blijven onderbelicht, terwijl juist daar de noodzaak tot reflectie het grootst is"`,
    },
    samenvatter: {
      [VOORBEELD_KEY]: `AI roept tegenstrijdige verwachtingen op over werk en onderwijs, en confronteert ons met **algoritmische bias** en onderbelichte **ethische implicaties** die juist nu publieke reflectie vragen.`,
    },
  },
}

export function getStaticResponse(
  niveau: NiveauGroep,
  roleId: string,
  inputKey: string
): string {
  return k1StaticResponses[niveau]?.[roleId]?.[inputKey] ?? 'Geen reactie beschikbaar.'
}
