import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'google/gemini-3-flash-preview'

type Categorie = 'van-mij' | 'van-anderen' | 'geheim'
type Niveau = 'vmbo' | 'havo' | 'vwo'

interface FeedbackRequest {
  categorie: Categorie
  antwoord: string
  niveau: Niveau
}

const categorieContext: Record<Categorie, { titel: string; risico: string; uitleg?: string }> = {
  'van-mij': {
    titel: 'persoonlijke gegevens van jezelf',
    risico: 'AI-bedrijven slaan gesprekken op. Bij een datalek kunnen jouw gegevens op straat komen te liggen of misbruikt worden.',
  },
  'van-anderen': {
    titel: 'informatie over andere mensen',
    risico: 'Als je info over anderen deelt zonder hun toestemming, schend je hun privacy. Zij hebben er niet voor gekozen.',
  },
  'geheim': {
    titel: 'vertrouwelijke of geheime informatie',
    risico: 'Vertrouwelijke info hoort vertrouwelijk te blijven. Als je dit deelt met AI, kan het uitlekken of misbruikt worden.',
    uitleg: 'Vertrouwelijk betekent: informatie die niet voor iedereen bedoeld is. Denk aan toetsantwoorden, wachtwoorden, interne schooldocumenten, examenvragen, of dingen die je in vertrouwen hebt gehoord. Ook bedrijfsgeheimen of inloggegevens vallen hieronder.',
  },
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
}

function buildPrompt(categorie: Categorie, antwoord: string, niveau: Niveau): string {
  const ctx = categorieContext[categorie]
  const stijl = niveauStijl[niveau]

  const extraUitleg = ctx.uitleg ? `\nExtra context voor deze categorie: ${ctx.uitleg}` : ''

  return `Je geeft feedback aan een leerling over wat ze niet zouden delen met AI.

Categorie: ${ctx.titel}
Achterliggende reden: ${ctx.risico}${extraUitleg}

De leerling schreef: "${antwoord}"

${stijl}

Geef feedback in 2-3 zinnen:
1. Bevestig kort wat de leerling goed bedacht heeft
2. Leg uit WAAROM dit slim is (de reden, niet bangmakerij)
3. Voeg eventueel 1 item toe dat ze missen (alleen als echt belangrijk)
${categorie === 'geheim' ? '4. Als de leerling niet goed lijkt te begrijpen wat vertrouwelijk betekent, leg dit dan eerst kort uit.' : ''}

Wees realistisch en praktisch, niet dramatisch of angstaanjagend. Het gaat erom dat ze begrijpen waarom nadenken belangrijk is.

Als het antwoord leeg of onzin is, vraag vriendelijk om een serieus antwoord.`
}

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackRequest = await request.json()
    const { categorie, antwoord, niveau } = body

    if (!categorie || !antwoord || !niveau) {
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

    const prompt = buildPrompt(categorie, antwoord, niveau)

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
        max_tokens: 200,
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
    console.error('S1 Feedback API error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis. Probeer het opnieuw.' },
      { status: 500 }
    )
  }
}
