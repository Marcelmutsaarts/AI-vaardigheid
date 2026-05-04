import { NextRequest } from 'next/server'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'google/gemini-2.0-flash-001'

interface RequestBody {
  personaName: string
  personaBaseDescription: string
  niveau: 'vmbo' | 'havo' | 'vwo' | 'mbo' | 'hbo'
  leerjaar: number | null
  reflectionText: string
}

function getTaalInstructie(niveau: string, leerjaar: number | null): string {
  if (niveau === 'vmbo') return 'Korte, simpele zinnen. Maximaal 15 woorden per zin. Vriendelijke toon.'
  if (niveau === 'mbo') return 'Helder, praktisch Nederlands. Niet te formeel.'
  if (niveau === 'hbo') return 'Iets academischer mag, blijf bondig.'
  if (niveau === 'vwo' && (leerjaar ?? 1) >= 4) return 'Genuanceerd en bondig.'
  if (niveau === 'vwo') return 'Helder en iets academischer mag.'
  return 'Normale, heldere taal.'
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()
    const { personaName, personaBaseDescription, niveau, leerjaar, reflectionText } = body

    if (!personaName || !niveau) {
      return Response.json({ error: 'Missing fields' }, { status: 400 })
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json({ error: 'API not configured' }, { status: 500 })
    }

    const reflectie = reflectionText?.trim()
      ? `De leerling schreef zelf:\n"""\n${reflectionText.trim()}\n"""`
      : 'De leerling heeft geen vrije reflectie geschreven.'

    const systemPrompt = `Je schrijft een korte persoonlijke profielomschrijving voor een leerling die net het K-deel (Kiezen) van de KIES-leeromgeving heeft afgerond.

Op basis van zelf-reflectie kreeg de leerling deze persona toegewezen: **${personaName}**.
De algemene basistekst van die persona is: "${personaBaseDescription}"

${reflectie}

Schrijf 1 tot 2 zinnen (max 40 woorden) die:
- De leerling persoonlijk aanspreken (jij/je)
- Iets uit de eigen reflectie weerklank geven, zonder letterlijk te citeren
- Aansluiten bij de persona, maar de persona-naam NIET herhalen
- Bemoedigend en niet-moraliserend zijn (geen "AI is goed/slecht")

Taalrichtlijn: ${getTaalInstructie(niveau, leerjaar)}

Geef ALLEEN de korte profielomschrijving als platte tekst, geen aanhalingstekens, geen kop, geen lijst.`

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
        messages: [{ role: 'user', content: systemPrompt }],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      console.error('k-persona OpenRouter error', response.status, err)
      return Response.json({ error: 'API call failed' }, { status: 500 })
    }

    const data = await response.json()
    const description: string = data.choices?.[0]?.message?.content?.trim() ?? ''

    return Response.json({ description })
  } catch (error) {
    console.error('k-persona route error', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
