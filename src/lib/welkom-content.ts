export type NiveauGroep = 'vmbo' | 'havo' | 'vwo'

export type WelkomContent = {
  heading: string
  hook: string
  body: string[]
  kiesIntro: string
  cta: string
}

export const welkomContent: Record<NiveauGroep, WelkomContent> = {
  vmbo: {
    heading: 'Hé, welkom!',
    hook: 'Gebruik jij wel eens ChatGPT, Gemini of een andere AI? Word je daar slimmer van — of juist niet?',
    body: [
      'Het antwoord: dat ligt eraan.',
      'Als je AI al je werk laat doen, leer je er meestal weinig van. Dat is soms prima — bijvoorbeeld als snelheid belangrijker is dan leren.',
      'Maar als je iets wilt léren, helpt AI alleen als je het slim inzet.',
      'In deze app leer je in 4 stappen hoe je dat doet.',
    ],
    kiesIntro: 'Wat ga je leren?',
    cta: 'Aan de slag',
  },
  havo: {
    heading: 'Welkom!',
    hook: 'Gebruik jij ChatGPT, Gemini of een andere AI-tool? En word je daar slimmer van — of juist niet?',
    body: [
      'Het eerlijke antwoord: dat hangt af van hóé je het gebruikt, niet of je het gebruikt.',
      'AI-tools zijn krachtig. Ze kunnen je helpen iets sneller te begrijpen of feedback geven op wat je schreef. Maar ze kunnen ook al het denkwerk van je overnemen — en dan blijft er weinig leren over.',
      'Het verschil zit in bewuste keuzes. In deze leeromgeving leer je via het KIES-framework wanneer je AI inzet, en hoe je dat slim doet.',
    ],
    kiesIntro: 'Vier vaardigheden, vier stappen:',
    cta: 'Start met leren',
  },
  vwo: {
    heading: 'Welkom.',
    hook: 'Je gebruikt waarschijnlijk weleens AI zoals ChatGPT of Gemini. De vraag is niet óf, maar hoe — en met welk effect op je leren.',
    body: [
      'AI kan je leerproces versterken én ondermijnen. Welke kant het opgaat, hangt af van bewuste keuzes: voor welke taak zet je AI in, en op welke manier?',
      'Soms is iets uitbesteden aan AI uitstekend — efficiëntie weegt dan zwaarder dan eigen leren. Een andere keer is het juist de verkeerde keuze, omdat je daarmee iets misloopt wat je wél had moeten leren.',
      'In deze leeromgeving werk je via het KIES-framework aan vier vaardigheden om die afweging zelf te kunnen maken.',
    ],
    kiesIntro: 'De vier vaardigheden:',
    cta: 'Start',
  },
}
