'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNiveau } from '@/contexts/NiveauContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, Sparkles, Bot } from 'lucide-react'
import { getNiveauGroep } from '@/lib/transition-utils'
import { getPersona, type AxisValue, type Persona } from '@/lib/persona-data'
import ProgressStepper from '@/components/navigation/ProgressStepper'

const K2_STORAGE_KEY = 'kies-k2-state'

type Phase = 'hook' | 'reveal' | 'quiz' | 'demo' | 'cta'
type Niveau = 'vmbo' | 'havo' | 'vwo'

interface QuizOption {
  id: string
  label: string
  correct: boolean
}

const reveals: Record<Niveau, ReadonlyArray<{ kop: string; body: string }>> = {
  vmbo: [
    { kop: 'AI weet niet wat jij echt bedoelt', body: 'AI leest alleen wat jij typt. Wat in je hoofd zit kan AI niet raden.' },
    { kop: 'AI volgt je letterlijk', body: 'Vraag je iets vaags? Dan krijg je iets vaags terug. Vraag je scherp? Dan word je antwoord scherp.' },
    { kop: 'AI kent jou niet', body: 'AI weet niet of je leerling, leraar of iemand met haast bent. Vertel het, anders gokt AI.' },
  ],
  havo: [
    { kop: 'AI weet niet wat jij écht bedoelt', body: 'AI leest alleen je woorden. Wat je in je hoofd hebt blijft daar — tenzij jij het uittypt.' },
    { kop: 'AI volgt je letterlijk', body: 'Een vage prompt levert een vaag antwoord. Een specifieke prompt levert een specifiek antwoord. Zo simpel.' },
    { kop: 'AI kent jou niet', body: 'Of je nu een leerling bent met een deadline morgen, of een ouder die wil meedenken — AI raadt het niet. Vertel het.' },
  ],
  vwo: [
    { kop: 'AI kent jouw context niet', body: 'AI beschikt niet over jouw bedoeling, voorkennis of doel. AI werkt uitsluitend met wat jij expliciet maakt.' },
    { kop: 'AI volgt je letterlijk', body: 'Vaagheid in de input vertaalt zich rechtstreeks naar vaagheid in de output. Specificiteit is de enige hefboom die jij hebt.' },
    { kop: 'AI kent jouw rol of doel niet', body: 'Of je nu schrijft als academisch debattant of als achteloze nieuwsgierige — zonder context kiest AI gemiddelden.' },
  ],
}

const quizOptions: QuizOption[] = [
  { id: 'onderwerp', label: 'Waar gaat het werkstuk over?', correct: true },
  { id: 'doel', label: 'Moet AI schrijven, samenvatten of brainstormen?', correct: true },
  { id: 'rol', label: 'Voor welk vak en welk niveau is het?', correct: true },
  { id: 'kleur', label: 'Welke kleur heeft jouw schoolagenda?', correct: false },
]

const vagePrompt = 'Help mij met mijn werkstuk.'
const vageOutput = 'Natuurlijk! Waar gaat je werkstuk over? Hoe lang moet het zijn? Voor welk vak? Wat moet ik precies doen — schrijven, samenvatten, ideeën geven? Geef wat meer informatie, dan help ik je verder.'

const scherpePromptPerNiveau: Record<Niveau, string> = {
  vmbo: 'Ik schrijf een werkstuk over voetbal voor het vak Nederlands, leerjaar 2. Geef me 3 onderwerp-ideeën die ik kan uitwerken — niet de beker, want die hebben we al gehad.',
  havo: 'Ik schrijf een werkstuk van 800 woorden over klimaatverandering voor aardrijkskunde. Geef me 3 invalshoeken die niet over CO2-uitstoot gaan, en leg per invalshoek kort uit waarom die interessant is.',
  vwo: 'Voor mijn profielwerkstuk geschiedenis (vwo 5) onderzoek ik de beeldvorming van de Koude Oorlog. Geef me 3 deelvragen die geschikt zijn voor 4000 woorden, en noem per deelvraag het type bron dat het meest geschikt is.',
}

const scherpeOutputPerNiveau: Record<Niveau, string> = {
  vmbo: '**Drie ideeën voor jouw werkstuk:**\n\n1. **De geschiedenis van jouw favoriete club** — kies een club, vertel over de oprichting en grootste momenten.\n2. **Voetbal en gezondheid** — wat doet voetballen met je lichaam en je hoofd?\n3. **Een speler die jou inspireert** — kies één speler en leg uit waarom hij of zij bijzonder is.\n\nWelke spreekt je aan?',
  havo: '**Drie invalshoeken (niet CO2):**\n\n1. **Klimaatmigratie** — mensen die hun woonplaats verlaten door droogte of overstroming. Interessant omdat het laat zien dat klimaatverandering nu al miljoenen levens raakt.\n2. **Klimaatrechtspraak** — rechtszaken tegen overheden en bedrijven (bv. Urgenda). Toont hoe het probleem juridisch wordt vertaald.\n3. **Klimaatpsychologie** — eco-anxiety bij jongeren. Verbindt het mondiale probleem met persoonlijke beleving.',
  vwo: '**Drie deelvragen voor 4000 woorden:**\n\n1. *Hoe representeerden Westerse en Sovjet-propagandafilms de tegenstander tussen 1947-1962?* — Bron: filmarchieven (BFI, Russian State Documentary Film Archive), aangevuld met secundaire literatuur over visuele retoriek.\n2. *Welke rol speelde de schoolboekenstrijd in het construeren van vijandbeelden in Nederland?* — Bron: schoolboeken uit het Nationaal Onderwijsmuseum + curriculumanalyses.\n3. *Hoe verschoof de beeldvorming van Cuba in Amerikaanse media voor en na de Cubacrisis?* — Bron: archieven van The New York Times en Time Magazine via ProQuest.',
}

interface NiveauTeksten {
  hookPre: string
  hookMain: (personaName: string | null) => string
  hookButton: string
  revealIntro: string
  revealButton: string
  quizIntro: string
  quizSubmit: string
  quizCorrect: string
  quizPartial: string
  quizNext: string
  demoIntro: string
  demoConclusion: string
  ctaMain: string
  ctaButton: string
}

const teksten: Record<Niveau, NiveauTeksten> = {
  vmbo: {
    hookPre: 'Hé, ik ben er weer.',
    hookMain: (n) => n
      ? `Ik ben jouw ${n}, weet je nog? Voor je leert hoe je AI iets goed kan vragen, vertel ik je drie dingen over AI. Klein, maar belangrijk.`
      : 'Voor je leert hoe je AI iets goed kan vragen, vertel ik je drie dingen over AI. Klein, maar belangrijk.',
    hookButton: 'Vertel maar',
    revealIntro: 'Klik op elk kaartje. Dit zijn drie dingen die AI NIET kan.',
    revealButton: 'Test me',
    quizIntro: `Iemand vraagt aan AI: "${vagePrompt}". Wat moet AI nog weten? Klik aan wat AI nodig heeft. Meerdere antwoorden mogelijk!`,
    quizSubmit: 'Check mijn antwoord',
    quizCorrect: 'Top! Dit zijn precies de dingen die AI nodig heeft. Als je dat geeft, krijg je een goed antwoord.',
    quizPartial: 'Bijna! Die eerste drie heeft AI echt nodig. De kleur van je agenda niet.',
    quizNext: 'Laat het verschil zien',
    demoIntro: 'Kijk goed: dezelfde AI, twee verschillende prompts. Zie jij het verschil?',
    demoConclusion: 'Zie je het? Niet AI is anders — jouw prompt is anders. Jij bepaalt het verschil.',
    ctaMain: 'Goed bezig. In de volgende stap leer je hoe je zo\'n scherpe prompt zelf bouwt. Komt goed.',
    ctaButton: 'Naar de prompt-bouwer',
  },
  havo: {
    hookPre: 'Hé, ik ben er weer.',
    hookMain: (n) => n
      ? `Ik ben jouw ${n} — herinner je nog? Voordat jij leert hoe je goede prompts schrijft, vertel ik je drie dingen die je over AI moet weten. Anders weet je niet waarom prompten zo verschil maakt.`
      : 'Voordat jij leert hoe je goede prompts schrijft, vertel ik je drie dingen die je over AI moet weten. Anders weet je niet waarom prompten zo verschil maakt.',
    hookButton: 'Vertel maar',
    revealIntro: 'Klik elk kaartje aan om te zien wat AI niet kan — en waarom dat ertoe doet.',
    revealButton: 'Probeer het uit',
    quizIntro: `Stel: iemand vraagt aan AI: "${vagePrompt}". Wat heeft AI van jou nodig om je écht goed te helpen? Vink aan wat ontbreekt — meerdere antwoorden mogelijk.`,
    quizSubmit: 'Check mijn antwoord',
    quizCorrect: 'Helemaal raak. Dit is precies waarom een prompt méér is dan een vraag — het is alle context die AI nodig heeft om jou écht te helpen.',
    quizPartial: 'Bijna. De eerste drie opties heeft AI allemaal nodig — anders moet AI gokken. De kleur van je agenda doet er niet toe.',
    quizNext: 'Laat me het verschil zien',
    demoIntro: 'Kijk wat er gebeurt als je het vaag vraagt — en als je het scherp vraagt. Zelfde AI, twee werelden.',
    demoConclusion: 'Zie je het verschil? Dezelfde AI, totaal ander resultaat. Het zit hem niet in AI — het zit hem in jouw prompt.',
    ctaMain: 'Nu je weet waarom goed prompten ertoe doet, gaan we naar het hoe. In de volgende stap leer je welke onderdelen een sterke prompt heeft — daarna ga je er zelf mee bouwen.',
    ctaButton: 'Naar de prompt-bouwer',
  },
  vwo: {
    hookPre: 'Hé.',
    hookMain: (n) => n
      ? `Ik ben jouw ${n} uit het vorige onderdeel. Voordat we duiken in de techniek van goede prompts, deel ik drie inherente beperkingen van AI — die bepalen waarom prompten überhaupt een vaardigheid is.`
      : 'Voordat we duiken in de techniek van goede prompts, deel ik drie inherente beperkingen van AI — die bepalen waarom prompten überhaupt een vaardigheid is.',
    hookButton: 'Verder',
    revealIntro: 'Klik elke kaart aan om de beperking te zien — en waarom die jouw prompt-vaardigheid noodzakelijk maakt.',
    revealButton: 'Toets jezelf',
    quizIntro: `Casus: iemand stelt aan AI de vraag "${vagePrompt}". Welke informatie zou AI moeten krijgen om een bruikbaar antwoord te genereren? Selecteer wat ontbreekt (meerdere selecties mogelijk).`,
    quizSubmit: 'Verifieer',
    quizCorrect: 'Precies. Een prompt is geen vraag, maar de volledige context die AI nodig heeft om jouw intentie te benaderen. Specificiteit is alles.',
    quizPartial: 'Bijna. De eerste drie zijn elk noodzakelijk; AI gokt zonder. De kleur van je agenda is irrelevant — context moet relevant zijn, niet uitputtend.',
    quizNext: 'Toon het effect',
    demoIntro: 'Vergelijk twee prompts voor dezelfde taak. Let op de specificiteit — en op het verschil in bruikbaarheid van het antwoord.',
    demoConclusion: 'Hetzelfde model, fundamenteel ander resultaat. Het verschil zit niet in AI; het zit in de informatiedichtheid van jouw prompt.',
    ctaMain: 'Je weet nu waarom prompten ertoe doet. In de volgende stap leer je de bouwstenen van een sterke prompt — daarna pas je het zelf toe.',
    ctaButton: 'Naar de prompt-bouwer',
  },
}

interface SliderValues {
  totaalLeren: AxisValue
  totaalKwaliteit: AxisValue
  totaalSnelheid: AxisValue
}

function readSliders(): SliderValues | null {
  try {
    const raw = localStorage.getItem(K2_STORAGE_KEY)
    if (!raw) return null
    const state = JSON.parse(raw)
    const l = state.totaalLeren
    const k = state.totaalKwaliteit
    const s = state.totaalSnelheid
    if (l !== -1 && l !== 0 && l !== 1) return null
    if (k !== -1 && k !== 0 && k !== 1) return null
    if (s !== -1 && s !== 0 && s !== 1) return null
    return { totaalLeren: l, totaalKwaliteit: k, totaalSnelheid: s }
  } catch {
    return null
  }
}

function PersonaAvatar({ persona, size = 'sm' }: { persona: Persona | null; size?: 'sm' | 'md' | 'lg' }) {
  const [imageError, setImageError] = useState(false)
  const dim = size === 'lg' ? 'w-16 h-16' : size === 'md' ? 'w-12 h-12' : 'w-10 h-10'
  const iconSize = size === 'lg' ? 'h-8 w-8' : size === 'md' ? 'h-6 w-6' : 'h-5 w-5'

  if (!persona || imageError) {
    return (
      <div className={`flex-shrink-0 ${dim} rounded-full bg-primary text-white flex items-center justify-center`}>
        <Bot className={iconSize} />
      </div>
    )
  }

  return (
    <div className={`flex-shrink-0 ${dim} rounded-full overflow-hidden bg-primary-light border-2 border-primary/30`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={persona.imageFile}
        alt={persona.name}
        className="w-full h-full object-cover object-top"
        onError={() => setImageError(true)}
      />
    </div>
  )
}

export default function InstruerenIntro() {
  const router = useRouter()
  const { niveau, updateProgress } = useNiveau()
  const [ready, setReady] = useState(false)
  const [phase, setPhase] = useState<Phase>('hook')
  const [revealedCards, setRevealedCards] = useState<number[]>([])
  const [quizPicks, setQuizPicks] = useState<Set<string>>(new Set())
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [persona, setPersona] = useState<Persona | null>(null)

  useEffect(() => {
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) {
      router.push('/')
      return
    }

    const sliders = readSliders()
    if (sliders) {
      setPersona(getPersona(sliders.totaalLeren, sliders.totaalKwaliteit, sliders.totaalSnelheid))
    }
    setReady(true)
  }, [niveau, router])

  if (!ready) return null

  const niveauGroep = getNiveauGroep(niveau.schoolType)
  const cards = reveals[niveauGroep]
  const t = teksten[niveauGroep]
  const scherpePrompt = scherpePromptPerNiveau[niveauGroep]
  const scherpeOutput = scherpeOutputPerNiveau[niveauGroep]

  const toggleReveal = (index: number) => {
    setRevealedCards(prev => prev.includes(index) ? prev : [...prev, index])
  }

  const allRevealed = revealedCards.length === cards.length

  const toggleQuizPick = (id: string) => {
    if (quizSubmitted) return
    setQuizPicks(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const correctCount = quizOptions.filter(o => o.correct && quizPicks.has(o.id)).length
  const distractorPicked = quizOptions.some(o => !o.correct && quizPicks.has(o.id))
  const allCorrect = correctCount === 3 && !distractorPicked

  const handleQuizSubmit = () => setQuizSubmitted(true)

  const handleContinue = () => {
    updateProgress('instrueren', 'intro', true)
    router.push('/leerpad/instrueren/i1')
  }

  const personaName = persona?.name ?? null
  // Naam zonder "De " prefix voor natuurlijk gebruik in zinnen ("ik ben jouw Diepe Bouwer")
  const personaInline = personaName?.replace(/^De\s+/i, '') ?? null

  const renderInlineMarkdown = (text: string) => {
    return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-light/30 to-white">
      <Header />
      <ProgressStepper activeLetter="instrueren" />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* === FASE: HOOK === */}
          {phase === 'hook' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-start gap-3 mb-6">
                <PersonaAvatar persona={persona} size="lg" />
                <div className="flex-1 bg-white rounded-2xl rounded-tl-sm border shadow-sm p-5 relative">
                  <div className="absolute -left-2 top-3 w-3 h-3 bg-white border-l border-t rotate-[-45deg]" />
                  {personaName && (
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">{personaName}</p>
                  )}
                  <p className="text-base md:text-lg text-gray-800 leading-relaxed">
                    {t.hookPre} {t.hookMain(personaInline)}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <Button onClick={() => setPhase('reveal')} size="lg" className="px-8">
                  {t.hookButton}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* === FASE: 3 KAARTJES ONTHULLEN === */}
          {phase === 'reveal' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-start gap-3 mb-6">
                <PersonaAvatar persona={persona} size="md" />
                <div className="flex-1 bg-white rounded-2xl rounded-tl-sm border shadow-sm p-4 relative">
                  <div className="absolute -left-2 top-3 w-3 h-3 bg-white border-l border-t rotate-[-45deg]" />
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    {t.revealIntro}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {cards.map((card, i) => {
                  const opened = revealedCards.includes(i)
                  return (
                    <button
                      key={i}
                      onClick={() => toggleReveal(i)}
                      className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                        opened
                          ? 'border-primary bg-white shadow-md'
                          : 'border-gray-200 bg-white hover:border-primary/50 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          opened ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {opened ? <Check className="h-4 w-4" /> : i + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{card.kop}</h3>
                          {opened && (
                            <p className="text-sm text-gray-700 mt-2 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-300">
                              {card.body}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {allRevealed && (
                <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <Button onClick={() => setPhase('quiz')} size="lg" className="px-8">
                    {t.revealButton}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* === FASE: QUIZ === */}
          {phase === 'quiz' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-start gap-3 mb-6">
                <PersonaAvatar persona={persona} size="md" />
                <div className="flex-1 bg-white rounded-2xl rounded-tl-sm border shadow-sm p-5 relative">
                  <div className="absolute -left-2 top-3 w-3 h-3 bg-white border-l border-t rotate-[-45deg]" />
                  <p className="text-sm md:text-base text-gray-800 leading-relaxed">
                    {t.quizIntro}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {quizOptions.map((opt) => {
                  const picked = quizPicks.has(opt.id)
                  const showCorrect = quizSubmitted && opt.correct
                  const showWrong = quizSubmitted && !opt.correct && picked
                  const showMissed = quizSubmitted && opt.correct && !picked

                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleQuizPick(opt.id)}
                      disabled={quizSubmitted}
                      className={`w-full text-left rounded-xl border-2 p-3 flex items-center gap-3 transition-all ${
                        showCorrect && picked
                          ? 'border-green-500 bg-green-50'
                          : showWrong
                          ? 'border-red-400 bg-red-50'
                          : showMissed
                          ? 'border-amber-400 bg-amber-50'
                          : picked
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 bg-white hover:border-primary/50'
                      } disabled:cursor-default`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${
                        picked ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white'
                      } ${showCorrect && picked ? 'border-green-500 bg-green-500' : ''} ${showWrong ? 'border-red-400 bg-red-400' : ''}`}>
                        {picked && <Check className="h-4 w-4" />}
                      </div>
                      <span className="flex-1 text-sm text-gray-800">{opt.label}</span>
                      {showMissed && (
                        <span className="text-xs text-amber-700 font-medium">Had AI wel nodig</span>
                      )}
                    </button>
                  )
                })}
              </div>

              {!quizSubmitted ? (
                <div className="text-center">
                  <Button onClick={handleQuizSubmit} disabled={quizPicks.size === 0} size="lg" className="px-8">
                    {t.quizSubmit}
                  </Button>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-start gap-3 mb-4">
                    <PersonaAvatar persona={persona} size="sm" />
                    <div className={`flex-1 rounded-2xl rounded-tl-sm border p-4 relative ${allCorrect ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                      <div className={`absolute -left-2 top-3 w-3 h-3 border-l border-t rotate-[-45deg] ${allCorrect ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`} />
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {allCorrect ? t.quizCorrect : t.quizPartial}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <Button onClick={() => setPhase('demo')} size="lg" className="px-8">
                      {t.quizNext}
                      <Sparkles className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === FASE: DEMO === */}
          {phase === 'demo' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-start gap-3 mb-6">
                <PersonaAvatar persona={persona} size="md" />
                <div className="flex-1 bg-white rounded-2xl rounded-tl-sm border shadow-sm p-4 relative">
                  <div className="absolute -left-2 top-3 w-3 h-3 bg-white border-l border-t rotate-[-45deg]" />
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    {t.demoIntro}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {/* Vage prompt */}
                <div className="rounded-xl border-2 border-amber-200 bg-amber-50/40 p-4">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">Vage prompt</p>
                  <p className="text-sm font-medium text-gray-900 mb-3">&quot;{vagePrompt}&quot;</p>
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <p className="text-xs text-gray-500 mb-1">AI antwoordt:</p>
                    <p className="text-sm text-gray-700 leading-relaxed italic">{vageOutput}</p>
                  </div>
                </div>

                {/* Scherpe prompt */}
                <div className="rounded-xl border-2 border-green-300 bg-green-50/40 p-4">
                  <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">Scherpe prompt</p>
                  <p className="text-sm font-medium text-gray-900 mb-3">&quot;{scherpePrompt}&quot;</p>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-gray-500 mb-1">AI antwoordt:</p>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {renderInlineMarkdown(scherpeOutput)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-6">
                <PersonaAvatar persona={persona} size="sm" />
                <div className="flex-1 bg-primary/5 border border-primary/20 rounded-2xl rounded-tl-sm p-4 relative">
                  <div className="absolute -left-2 top-3 w-3 h-3 bg-primary/5 border-l border-t border-primary/20 rotate-[-45deg]" />
                  <p className="text-sm text-gray-800 leading-relaxed">{t.demoConclusion}</p>
                </div>
              </div>

              <div className="text-center">
                <Button onClick={() => setPhase('cta')} size="lg" className="px-8">
                  Verder
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* === FASE: CTA === */}
          {phase === 'cta' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-start gap-3 mb-6">
                <PersonaAvatar persona={persona} size="lg" />
                <div className="flex-1 bg-white rounded-2xl rounded-tl-sm border shadow-sm p-5 relative">
                  <div className="absolute -left-2 top-3 w-3 h-3 bg-white border-l border-t rotate-[-45deg]" />
                  {personaName && (
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">{personaName}</p>
                  )}
                  <p className="text-base md:text-lg text-gray-800 leading-relaxed">
                    {t.ctaMain.replace('{persona}', personaInline ?? '')}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button onClick={handleContinue} size="lg" className="px-8">
                  {t.ctaButton}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
