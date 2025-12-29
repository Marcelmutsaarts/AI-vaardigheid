import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'google/gemini-3-flash-preview'

type Niveau = 'vmbo' | 'havo' | 'vwo' | 'mbo' | 'hbo'

interface Stap {
  titel: string
  aanpak: 'zelf' | 'aihelpt' | 'aidoet' | null
  rol?: string
}

interface FeedbackRequest {
  opdracht: string
  stappen: Stap[]
  reflectie: string
  niveau: Niveau
}

const niveauStijl: Record<Niveau, string> = {
  vmbo: `Schrijf voor een VMBO-leerling:
- Korte zinnen (max 15 woorden)
- Simpele woorden
- Concreet en praktisch
- Vriendelijke toon`,
  havo: `Schrijf voor een HAVO-leerling:
- Normale zinsbouw
- Duidelijk en helder
- Leg kort uit waarom`,
  vwo: `Schrijf voor een VWO-leerling:
- Mag wat abstracter
- Benoem het principe erachter
- Intellectueel maar toegankelijk`,
  mbo: `Schrijf voor een MBO-student:
- Normale zinsbouw, helder
- Praktisch en beroepsgericht
- Verwijs naar werksituaties`,
  hbo: `Schrijf voor een HBO-student:
- Professioneel taalgebruik
- Benoem het principe erachter
- Verwijs naar beroepspraktijk`,
}

function buildPrompt(opdracht: string, stappen: Stap[], reflectie: string, niveau: Niveau): string {
  const stijl = niveauStijl[niveau]

  const stappenBeschrijving = stappen.map(s => {
    const aanpakLabel = s.aanpak === 'zelf' ? 'Zelf' : s.aanpak === 'aihelpt' ? `AI helpt (${s.rol || ''})` : `AI doet (${s.rol || ''})`
    return `- ${s.titel}: ${aanpakLabel}`
  }).join('\n')

  const aiDoetCount = stappen.filter(s => s.aanpak === 'aidoet').length
  const aiHelptCount = stappen.filter(s => s.aanpak === 'aihelpt').length
  const zelfCount = stappen.filter(s => s.aanpak === 'zelf').length

  return `Geef korte feedback over transparantie bij AI-gebruik.

Plan voor "${opdracht}":
${stappenBeschrijving}
(${aiDoetCount}x AI doet, ${aiHelptCount}x AI helpt, ${zelfCount}x zelf)

Leerling over melden: "${reflectie}"

${stijl}

REGELS:
- Maximaal 2 zinnen
- Reageer op hun antwoord
- Geef 1 concrete melding-suggestie als nodig
- AI helpt = meestal niet melden, AI doet kernwerk = wel melden

Bij leeg/onzin antwoord: vraag om serieus antwoord.`
}

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackRequest = await request.json()
    const { opdracht, stappen, reflectie, niveau } = body

    if (!opdracht || !stappen || !reflectie || !niveau) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const prompt = buildPrompt(opdracht, stappen, reflectie, niveau)

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://aivoordocenten.nl',
        'X-Title': 'KIES Leeromgeving',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status)
      return NextResponse.json(
        { error: 'Er ging iets mis. Probeer het opnieuw.' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const feedback = data.choices?.[0]?.message?.content || 'Geen feedback ontvangen.'

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error('S2 Feedback API error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis. Probeer het opnieuw.' },
      { status: 500 }
    )
  }
}
