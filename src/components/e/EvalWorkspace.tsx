'use client'

import { useState, useEffect, useCallback } from 'react'
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { aiValkuilen } from '@/lib/evalueren-content'
import BiasRound from '@/components/e/BiasRound'
import HallucinationRound from '@/components/e/HallucinationRound'
import SycophancyRound from '@/components/e/SycophancyRound'

interface EvalWorkspaceProps {
  level: string
  leerjaar?: number | null
  onInterestsSet: (interests: string[]) => void
  onRoundComplete: (round: number, name: string, emoji: string) => void
  onModuleComplete: () => void
}

type Phase =
  | 'interests'
  | 'round1' | 'round1-reveal'
  | 'round2' | 'round2-reveal'
  | 'round3' | 'round3-reveal'
  | 'complete'

const traps = [
  {
    round: 1,
    name: 'Vooroordelen',
    emoji: '\u{1F3AD}',
    reveal: {
      vmbo: 'AI neemt dingen aan over mensen die niet kloppen. Let op: maakt de AI aannames?',
      havo: 'AI neemt stereotypen over uit trainingsdata. Vraag jezelf af: maakt de AI aannames over mensen?',
      mbo: 'AI neemt stereotypen over uit trainingsdata. Vraag jezelf af: maakt de AI aannames over mensen?',
      vwo: 'AI reproduceert bias uit trainingsdata. Wees alert op impliciete aannames en stereotypen in AI-output.',
      hbo: 'AI reproduceert bias uit trainingsdata. Wees alert op impliciete aannames en stereotypen in AI-output.',
    }
  },
  {
    round: 2,
    name: 'Verzinsels',
    emoji: '\u{1F300}',
    reveal: {
      vmbo: 'AI verzint soms dingen die echt klinken maar niet kloppen. Check het altijd!',
      havo: 'AI verzint soms "feiten" die niet bestaan. Check feiten altijd bij een betrouwbare bron.',
      mbo: 'AI verzint soms "feiten" die niet bestaan. Check feiten altijd bij een betrouwbare bron.',
      vwo: 'AI genereert soms plausibel klinkende maar feitelijk onjuiste informatie (hallucinaties). Verifieer claims altijd.',
      hbo: 'AI genereert soms plausibel klinkende maar feitelijk onjuiste informatie (hallucinaties). Verifieer claims altijd.',
    }
  },
  {
    round: 3,
    name: 'De ja-knikker',
    emoji: '\u{1FA9E}',
    reveal: {
      vmbo: 'AI geeft je vaak gelijk, ook als je iets raars zegt. Vraag de AI ook om tegenargumenten.',
      havo: 'AI geeft je graag gelijk, ook als je fout zit. Vraag expliciet om tegenargumenten.',
      mbo: 'AI geeft je graag gelijk, ook als je fout zit. Vraag expliciet om tegenargumenten.',
      vwo: 'AI vertoont sycophantisch gedrag: het bevestigt je standpunt ongeacht de geldigheid. Vraag altijd om tegenargumenten of kritische kanttekeningen.',
      hbo: 'AI vertoont sycophantisch gedrag: het bevestigt je standpunt ongeacht de geldigheid. Vraag altijd om tegenargumenten of kritische kanttekeningen.',
    }
  },
]

function getRevealText(trap: typeof traps[number], level: string): string {
  const key = level as keyof typeof trap.reveal
  return trap.reveal[key] || trap.reveal.havo
}

export default function EvalWorkspace({
  level,
  leerjaar,
  onInterestsSet,
  onRoundComplete,
  onModuleComplete,
}: EvalWorkspaceProps) {
  const [phase, setPhase] = useState<Phase>('interests')
  const [interests, setInterests] = useState<string[]>([])
  const [interesseInput, setInteresseInput] = useState('')
  const [roundResults, setRoundResults] = useState<Map<number, { correct: boolean }>>(new Map())
  const [revealVisible, setRevealVisible] = useState(false)

  // Reset reveal animation when entering a reveal phase
  useEffect(() => {
    if (phase.endsWith('-reveal')) {
      setRevealVisible(false)
      const timer = setTimeout(() => setRevealVisible(true), 50)
      return () => clearTimeout(timer)
    }
  }, [phase])

  const handleStartExercises = () => {
    const parsed = interesseInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
    if (parsed.length === 0) return
    setInterests(parsed)
    onInterestsSet(parsed)
    setPhase('round1')
  }

  const handleRoundExerciseComplete = useCallback((roundNum: 1 | 2 | 3) => {
    return (result: { correct: boolean }) => {
      setRoundResults(prev => {
        const next = new Map(prev)
        next.set(roundNum, result)
        return next
      })
      setPhase(`round${roundNum}-reveal` as Phase)
    }
  }, [])

  const handleRevealNext = (roundNum: 1 | 2 | 3) => {
    const trap = traps[roundNum - 1]
    onRoundComplete(roundNum, trap.name, trap.emoji)
    if (roundNum < 3) {
      setPhase(`round${roundNum + 1}` as Phase)
    } else {
      setPhase('complete')
    }
  }

  const getRoundNumber = (): number => {
    if (phase.startsWith('round1')) return 1
    if (phase.startsWith('round2')) return 2
    if (phase.startsWith('round3')) return 3
    return 0
  }

  // --- Phase: Interests ---
  if (phase === 'interests') {
    return (
      <div className="space-y-5">
        <div className="text-center space-y-2">
          <h2 className="text-lg font-bold text-gray-900">
            We gaan drie AI-valkuilen ontmaskeren
          </h2>
          <p className="text-sm text-gray-600">
            Maar eerst: waar ben jij in ge&iuml;nteresseerd? De oefeningen gaan over jouw onderwerpen.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Wat vind jij interessant? (2-3 dingen)
          </label>
          <input
            type="text"
            value={interesseInput}
            onChange={(e) => setInteresseInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleStartExercises()
              }
            }}
            placeholder="bijv. voetbal, muziek, gamen"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <p className="text-xs text-gray-500">
            Scheid meerdere interesses met een komma
          </p>
        </div>

        <Button
          onClick={handleStartExercises}
          disabled={interesseInput.trim().length === 0}
          size="lg"
          className="w-full"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Start de oefeningen &rarr;
        </Button>
      </div>
    )
  }

  // --- Phase: Round Exercise ---
  if (phase === 'round1' || phase === 'round2' || phase === 'round3') {
    const roundNum = getRoundNumber()
    return (
      <div className="space-y-4">
        <p className="text-sm font-medium text-gray-500">
          Ronde {roundNum} van 3
        </p>
        {phase === 'round1' && (
          <BiasRound
            interests={interests}
            level={level}
            leerjaar={leerjaar}
            onComplete={handleRoundExerciseComplete(1)}
          />
        )}
        {phase === 'round2' && (
          <HallucinationRound
            interests={interests}
            level={level}
            leerjaar={leerjaar}
            onComplete={handleRoundExerciseComplete(2)}
          />
        )}
        {phase === 'round3' && (
          <SycophancyRound
            interests={interests}
            level={level}
            leerjaar={leerjaar}
            onComplete={handleRoundExerciseComplete(3)}
          />
        )}
      </div>
    )
  }

  // --- Phase: Reveal ---
  if (phase === 'round1-reveal' || phase === 'round2-reveal' || phase === 'round3-reveal') {
    const roundNum = getRoundNumber()
    const trap = traps[roundNum - 1]
    const isLastRound = roundNum === 3

    return (
      <div className="space-y-4">
        <p className="text-sm font-medium text-gray-500">
          Ronde {roundNum} van 3
        </p>

        <div
          className={`bg-green-50 border border-green-200 rounded-xl p-4 transition-opacity duration-300 ${
            revealVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h3 className="font-bold text-green-800 mb-2">
            {trap.emoji} Dit heet: {trap.name}
          </h3>
          <p className="text-sm text-green-700">
            {getRevealText(trap, level)}
          </p>
        </div>

        <Button
          onClick={() => handleRevealNext(roundNum as 1 | 2 | 3)}
          size="lg"
          className="w-full"
        >
          {isLastRound ? (
            <>
              Bekijk overzicht <ArrowRight className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              Volgende ronde <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    )
  }

  // --- Phase: Complete ---
  if (phase === 'complete') {
    return (
      <div className="space-y-5">
        {/* Success banner */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 text-center">
          <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h2 className="text-lg font-bold text-green-800">
            Goed gedaan!
          </h2>
          <p className="text-sm text-green-700 mt-1">
            Je hebt drie AI-valkuilen leren herkennen.
          </p>
        </div>

        {/* Drie valkuilen samenvatting */}
        <div className="space-y-3">
          {aiValkuilen.map((valkuil) => (
            <div key={valkuil.id} className="bg-white rounded-xl border shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-1">
                {valkuil.emoji} {valkuil.titel}
              </h3>
              <p className="text-sm text-gray-600">
                {valkuil.tip}
              </p>
            </div>
          ))}
        </div>

        {/* Reminder box */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-sm text-purple-800 font-medium text-center">
            Onthoud: Mens &rarr; AI &rarr; Mens. JIJ checkt altijd het eindresultaat!
          </p>
        </div>

        {/* Module afronden button */}
        <Button
          onClick={onModuleComplete}
          size="lg"
          className="w-full"
        >
          <CheckCircle2 className="h-5 w-5 mr-2" />
          Module afronden
        </Button>
      </div>
    )
  }

  return null
}
