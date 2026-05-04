// S-Module: Spelregels - Casussen per thema en niveau
// 9 casussen: 3 thema's (privacy, transparantie, duurzaamheid) x 3 niveaugroepen (vmbo, havo, vwo)
// Reflectie-flow: leerling schrijft eigen antwoord, krijgt een open doordenkvraag,
// en ziet daarna drie gelijkwaardige denkrichtingen ("perspectieven") naast elkaar.
// Geen "juiste" optie. Geen oordeel. Perspectieven zijn neutrale framings.

export type ThemaId = 'privacy' | 'transparantie' | 'duurzaamheid'
export type NiveauGroep = 'vmbo' | 'havo' | 'vwo'

export interface CasusPerspective {
  kort: string         // 3-5 woorden samenvatting (geen A/B/C prefix)
  beschrijving: string // 1-2 zinnen, beschrijft een manier van denken — geen voor/nadelen
}

export interface Casus {
  thema: ThemaId
  emoji: string                                                // 🔒 / 🔍 / 🌱
  themaLabel: string                                           // 'Privacy' / 'Transparantie' / 'Duurzaamheid'
  scenario: string                                             // 3-5 zinnen, realistisch en herkenbaar
  schrijfvraag: string                                         // 1 zin, niveau-aangepast
  doordenkvraag: string                                        // 1 open vraag over de situatie zelf
  spiegelIntro: string                                         // 1 zin, intro op de drie perspectieven
  perspectives: [CasusPerspective, CasusPerspective, CasusPerspective]
}

export const casusPerNiveau: Record<NiveauGroep, Record<ThemaId, Casus>> = {
  vmbo: {
    privacy: {
      thema: 'privacy',
      emoji: '🔒',
      themaLabel: 'Privacy',
      scenario:
        'Je vriend Sem zit elke avond uren op TikTok. Hij wil stoppen en vraagt of jij een afkickplan voor hem laat maken door AI. Hij stuurt je zijn naam, adres, hoeveel uur hij scrolt en wie zijn beste vrienden zijn. "Plak het er maar gewoon bij," zegt hij. "Anders weet de AI niks van mij." Jij twijfelt.',
      schrijfvraag: 'Wat zou jij doen, en waarom?',
      doordenkvraag: 'Wat gebeurt er met de gegevens van Sem als jij ze in de AI plakt?',
      spiegelIntro: 'Drie manieren waarop anderen naar deze situatie kijken:',
      perspectives: [
        {
          kort: 'De voorzichtige weg',
          beschrijving:
            'Sem heeft het aan jou verteld, niet aan een AI. Je laat zijn naam en adres dus weg en gebruikt iets als "een vriend van 14".'
        },
        {
          kort: 'De snelle weg',
          beschrijving:
            'Sem geeft zelf toestemming, dus je plakt alles erin. Hoe meer info de AI heeft, hoe beter het plan past.'
        },
        {
          kort: 'De zelf-doen weg',
          beschrijving:
            'Je zegt tegen Sem dat hij het zelf moet aanpakken. Een AI heeft niet zijn echte gegevens nodig om hem te helpen.'
        }
      ]
    },
    transparantie: {
      thema: 'transparantie',
      emoji: '🔍',
      themaLabel: 'Transparantie',
      scenario:
        'Je hebt een werkstuk over voetbal gemaakt. ChatGPT hielp je met de structuur en met moeilijke zinnen. Daarna heb je alles in je eigen woorden overgeschreven. Onderaan staat een vakje: "Heb je AI gebruikt? Zo ja, waarvoor?" Je twijfelt of je het echt nog AI-werk kunt noemen.',
      schrijfvraag: 'Wat zou jij in het vakje zetten, en waarom?',
      doordenkvraag: 'Wat zou je doen als je docent later vraagt hoe je werkstuk tot stand kwam?',
      spiegelIntro: 'Drie manieren waarop anderen hier tegenaan kijken:',
      perspectives: [
        {
          kort: 'De open kaart',
          beschrijving:
            'Je schrijft op dat AI hielp met structuur en zinnen, en dat jij alles herschreven hebt. Niemand kan je later iets verwijten.'
        },
        {
          kort: 'Het is mijn werk',
          beschrijving:
            'Je hebt alles zelf overgeschreven, dus het ís van jou. Je vult "nee" in en denkt dat de hulp niet meer telt.'
        },
        {
          kort: 'Een beetje vaag',
          beschrijving:
            'Je schrijft "een beetje, voor wat woorden". Niet helemaal nee, niet helemaal alles vertellen. Een middenweg.'
        }
      ]
    },
    duurzaamheid: {
      thema: 'duurzaamheid',
      emoji: '🌱',
      themaLabel: 'Duurzaamheid',
      scenario:
        'Jij gebruikt AI voor van alles. Voor huiswerk, voor weetjes, soms gewoon om iets uit te vragen. Vandaag zegt je vriendin Lieke: "Wist je dat AI veel meer stroom kost dan Google?" Ze laat je een filmpje zien over datacenters. Jij dacht dat het allemaal "gewoon op je telefoon" gebeurde.',
      schrijfvraag: 'Wat doet dit met hoe jij AI gaat gebruiken?',
      doordenkvraag: 'Voor welke vragen heb jij echt AI nodig, en welke kan je ook gewoon googelen?',
      spiegelIntro: 'Drie manieren waarop anderen hier mee omgaan:',
      perspectives: [
        {
          kort: 'Gewoon doorgaan',
          beschrijving:
            'Jij alleen verandert weinig. Je blijft AI gebruiken zoals nu en hoopt dat de techniek schoner wordt.'
        },
        {
          kort: 'Bewust kiezen',
          beschrijving:
            'AI voor dingen waar je wat aan hebt, kleine vragen google je. Je merkt zelf het verschil tussen "leren" en "uit luiheid".'
        },
        {
          kort: 'Even pauzeren',
          beschrijving:
            'Je stopt een tijdje met AI tot je weet wanneer het echt nodig is. Je merkt dan vanzelf wat je echt mist.'
        }
      ]
    }
  },
  havo: {
    privacy: {
      thema: 'privacy',
      emoji: '🔒',
      themaLabel: 'Privacy',
      scenario:
        'Voor je spreekbeurt over jongeren-en-stress wil je echte verhalen gebruiken. Klasgenoot Yara heeft jou in vertrouwen verteld over haar paniekaanvallen tijdens toetsweken. Ze wist niet dat het voor je spreekbeurt zou zijn. Jij denkt: als ik haar verhaal anoniem aan AI voer voor extra input en analyse, kan niemand het terugleiden naar haar.',
      schrijfvraag: 'Wat zou jij doen, en waarom?',
      doordenkvraag: 'Wat zou Yara doen als ze later ontdekt dat haar verhaal in een AI-database staat?',
      spiegelIntro: 'Drie manieren waarop anderen naar deze situatie kijken:',
      perspectives: [
        {
          kort: 'De zorgzame weg',
          beschrijving:
            'Iemand vertelt iets aan jou, niet aan een AI. Voor wie zo denkt, is anonimiseren niet hetzelfde als toestemming, en het verhaal blijft bij jou.'
        },
        {
          kort: 'De pragmatische weg',
          beschrijving:
            'Anonimiseren is een gangbare manier om met persoonlijke verhalen om te gaan. Wie zo denkt, gebruikt AI voor extra inzicht zonder dat Yara herkenbaar is.'
        },
        {
          kort: 'De rechte lijn',
          beschrijving:
            'Wat Yara vertrouwelijk vertelde, vraag je opnieuw aan haar. Wie zo denkt, accepteert dat ze "nee" mag zeggen, en zoekt anders een ander voorbeeld.'
        }
      ]
    },
    transparantie: {
      thema: 'transparantie',
      emoji: '🔍',
      themaLabel: 'Transparantie',
      scenario:
        'Je profielwerkstuk is af. AI hielp je met het kiezen van het onderwerp, met de structuur en met de inleiding. De rest - onderzoek, conclusies, eindredactie - is volledig van jou. De docent vraagt om een verantwoording: waar heb je AI voor gebruikt en waar niet? Je weet dat hij streng is en dat sommige klasgenoten "geen AI" hebben opgeschreven terwijl je weet dat dat niet klopt.',
      schrijfvraag: 'Wat zou jij in je verantwoording zetten, en waarom?',
      doordenkvraag: 'Wat is voor jou belangrijker: een eerlijk verhaal vertellen, of opvallen tussen klasgenoten die liegen?',
      spiegelIntro: 'Drie manieren waarop anderen hier tegenaan kijken:',
      perspectives: [
        {
          kort: 'Volledig open',
          beschrijving:
            'Je schrijft precies op wat AI deed: onderwerp, structuur, inleiding. Wie zo denkt, geeft de docent het volledige beeld en gaat het gesprek aan als dat nodig is.'
        },
        {
          kort: 'Selectief delen',
          beschrijving:
            'Je benoemt de inleiding wel, maar laat de structuur weg omdat dat lastig af te bakenen is. Wie zo denkt, geeft iets prijs en houdt de rest open.'
        },
        {
          kort: 'Meegaan met de groep',
          beschrijving:
            'Anderen schrijven "geen AI" op en jij valt anders op. Wie zo denkt, kiest voor zelfbescherming binnen wat de klas blijkbaar normaal vindt.'
        }
      ]
    },
    duurzaamheid: {
      thema: 'duurzaamheid',
      emoji: '🌱',
      themaLabel: 'Duurzaamheid',
      scenario:
        'Je hebt een opdracht: een onderzoeksverslag van vier hoofdstukken. Met AI ben je in 30 minuten klaar - dat kost ongeveer evenveel energie als één uur Netflix kijken. Zonder AI ben je vier uur bezig - kost geen extra energie en je leert er meer van. Geen van beide is "fout". De deadline is morgen, je hebt vanavond ook nog twee andere vakken.',
      schrijfvraag: 'Hoe zou jij dit aanpakken, en waarom?',
      doordenkvraag: 'Welke afweging maak jij vaker: tijd besparen of zelf doorgronden?',
      spiegelIntro: 'Drie manieren waarop anderen deze afweging maken:',
      perspectives: [
        {
          kort: 'Tijd is leidend',
          beschrijving:
            'Met drie vakken op één avond is snelheid belangrijk. Wie zo denkt, gebruikt AI volledig en richt z\'n eigen energie op vakken die zwaarder wegen.'
        },
        {
          kort: 'Zelf het denkwerk',
          beschrijving:
            'Het denken doe je zelf, AI vangt fouten op aan het eind. Wie zo denkt, ziet juist déze opdracht als oefening en gebruikt AI als laatste check.'
        },
        {
          kort: 'Volledig zelfstandig',
          beschrijving:
            'Dit verslag is precies het soort werk waar je beter van wordt. Wie zo denkt, kiest voor de volledige route, ook al kost dat meer tijd vanavond.'
        }
      ]
    }
  },
  vwo: {
    privacy: {
      thema: 'privacy',
      emoji: '🔒',
      themaLabel: 'Privacy',
      scenario:
        'Voor je profielwerkstuk over rouwverwerking bij jongeren heeft je vriendin Eline jou in vertrouwen haar verhaal verteld over het overlijden van haar moeder vorig jaar. Het is intens en specifiek. Voor de analyse-fase wil je verschillende rouwverhalen - inclusief dat van Eline - geanonimiseerd door AI laten verwerken om patronen te vinden. Je tekent stevig in op privacy in je methodologie.',
      schrijfvraag: 'Welke keuze zou jij hier maken, en hoe verantwoord je die?',
      doordenkvraag: 'Wat is het verschil tussen iets in vertrouwen krijgen en het vervolgens als "data" mogen behandelen?',
      spiegelIntro: 'Drie manieren waarop anderen deze afweging benaderen:',
      perspectives: [
        {
          kort: 'De ethisch-zuivere route',
          beschrijving:
            'Een verhaal dat in vertrouwen is gedeeld, vraagt om expliciete toestemming voor elk vervolggebruik. Wie zo denkt, ziet anonimiseren niet als afdoende grond.'
        },
        {
          kort: 'De methodisch-verantwoorde route',
          beschrijving:
            'Anonimiseren is een gangbare onderzoekspraktijk en patroonherkenning is precies wat AI goed kan. Wie zo denkt, weegt onderzoekswaarde mee in de afweging.'
        },
        {
          kort: 'De grens-houdende route',
          beschrijving:
            'Vriendschap en onderzoek scheiden door alleen openbare bronnen te gebruiken. Wie zo denkt, accepteert dat dit empirische rijkdom kost en verantwoordt dat in de methodologie.'
        }
      ]
    },
    transparantie: {
      thema: 'transparantie',
      emoji: '🔍',
      themaLabel: 'Transparantie',
      scenario:
        'Je essay over migratiebeleid is voor 70% van jou: stelling, opbouw, voorbeelden, conclusie. AI heeft je geholpen met het scherper formuleren van argumentatie en het herschrijven van zwakke alinea\'s in betere stijl. De docent heeft AI-gebruik voor dit essay expliciet verboden. Deadline: morgenochtend. Je hebt het werk al gedaan en het is goed.',
      schrijfvraag: 'Welke keuze zou jij maken, en hoe rechtvaardig je die voor jezelf?',
      doordenkvraag: 'Wat weegt zwaarder: de afspraak die de docent maakte, of jouw eigen oordeel over wat "jouw werk" is?',
      spiegelIntro: 'Drie manieren waarop anderen deze afweging benaderen:',
      perspectives: [
        {
          kort: 'Het eigen kader',
          beschrijving:
            'Het denkwerk is van jou en de essentie is jouw stelling. Wie zo denkt, hanteert een eigen criterium voor "mijn werk" en levert in zoals het is.'
        },
        {
          kort: 'De ambachtelijke route',
          beschrijving:
            'Je herschrijft de AI-stukken in eigen stijl tot het technisch volledig van jou is. Wie zo denkt, neemt het ambacht serieus en accepteert het grijze gebied dat blijft.'
        },
        {
          kort: 'De afspraak voorop',
          beschrijving:
            'Een expliciete regel is een expliciete regel. Wie zo denkt, mailt de docent en accepteert het korte-termijn-risico voor het lange-termijn-vertrouwen.'
        }
      ]
    },
    duurzaamheid: {
      thema: 'duurzaamheid',
      emoji: '🌱',
      themaLabel: 'Duurzaamheid',
      scenario:
        'AI-datacenters verbruiken wereldwijd al meer energie dan sommige Europese landen. Tegelijk versnelt AI jouw werk en geeft het je toegang tot kennis die anders uren research zou kosten. Het collectieve effect van miljarden gebruikers is enorm. Jouw individuele bijdrage is minimaal. Hoe weeg jij persoonlijk gebruik tegen het collectieve effect?',
      schrijfvraag: 'Welke houding past bij jou, en hoe motiveer je die?',
      doordenkvraag: 'Wanneer is een individuele keuze "te klein om uit te maken", en wanneer is dat een uitvlucht?',
      spiegelIntro: 'Drie manieren waarop anderen deze afweging benaderen:',
      perspectives: [
        {
          kort: 'De rationele schaal',
          beschrijving:
            'Eén individuele afdruk is verwaarloosbaar in een systeem van miljarden gebruikers. Wie zo denkt, gebruikt AI vrijuit en richt z\'n morele zorg op systeemniveau.'
        },
        {
          kort: 'De reflectieve middenweg',
          beschrijving:
            'Bewust gebruiken voor leren en complex werk, niet voor wat je zelf snel kunt. Wie zo denkt, accepteert dat de grens "leren versus luiheid" continu opnieuw moet worden getrokken.'
        },
        {
          kort: 'De systemische blik',
          beschrijving:
            'Structurele problemen vragen om structurele oplossingen, niet om persoonlijke matiging. Wie zo denkt, richt zich op politiek en regelgeving, niet op individuele gewoontes.'
        }
      ]
    }
  }
}

export function getCasus(niveau: NiveauGroep, thema: ThemaId): Casus {
  return casusPerNiveau[niveau][thema]
}

// Three themes in canonical order, used for navigation and display
export const themasInVolgorde: ThemaId[] = ['privacy', 'transparantie', 'duurzaamheid']
