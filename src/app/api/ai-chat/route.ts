import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `Eres AstroAsistente, un experto en astronomía y ciencia espacial de la plataforma ASTROVERSE. Responde siempre en español. Sé preciso, científico pero accesible. Si la pregunta no es sobre espacio, redirige amablemente al tema espacial.`

const SYSTEM_PROMPT_PRO = `Eres AstroAsistente PRO, un experto avanzado en astronomía y ciencia espacial de la plataforma ASTROVERSE. Responde siempre en español con el máximo nivel de detalle científico. 

Tus capacidades PRO incluyen:
- Explicaciones detalladas con datos numéricos precisos y unidades
- Análisis comparativos entre cuerpos celestes
- Referencias a misiones espaciales reales (NASA, ESA, SpaceX)
- Contexto histórico de descubrimientos astronómicos
- Explicaciones accesibles para todos los niveles

Reglas:
- Siempre responde en español
- Sé riguroso científicamente pero accesible
- Usa formato claro con párrafos cortos
- Cuando sea relevante, menciona datos curiosos
- Si la pregunta no es sobre espacio, redirige amablemente al tema espacial
- Para preguntas complejas, estructura tu respuesta con secciones claras`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, isPremium } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere un array de mensajes' },
        { status: 400 }
      )
    }

    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || !lastMessage.content || typeof lastMessage.content !== 'string') {
      return NextResponse.json(
        { error: 'El último mensaje debe tener contenido válido' },
        { status: 400 }
      )
    }

    // Build message history for the LLM
    const systemPrompt = isPremium ? SYSTEM_PROMPT_PRO : SYSTEM_PROMPT
    const chatMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.slice(-10).map((m: { role: string; content: string }) => ({
        role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.content,
      })),
    ]

    try {
      // Dynamic import to avoid bundling issues in non-API contexts
      const ZAI = (await import('z-ai-web-dev-sdk')).default
      const zai = await ZAI.create()

      const result = await zai.chat.completions.create({
        messages: chatMessages,
      })

      const aiContent =
        result?.choices?.[0]?.message?.content ||
        'Lo siento, no pude generar una respuesta en este momento. Por favor, intenta de nuevo.'

      return NextResponse.json({
        role: 'assistant',
        content: aiContent,
      })
    } catch (llmError) {
      console.error('LLM Error:', llmError)
      // Fallback response if LLM fails
      const fallbackResponses = [
        '¡Excelente pregunta sobre el espacio! Los misterios del universo son infinitos. Te recomiendo explorar nuestra sección de Exploración y los simuladores interactivos para profundizar más en este tema fascinante.',
        'El cosmos siempre nos sorprende con nuevos descubrimientos. Esta es un área activa de investigación astronómica. Visita nuestra Galería NASA para ver las últimas imágenes del espacio profundo.',
        'La ciencia espacial avanza rápidamente gracias a misiones como las de la NASA y SpaceX. Te sugiero revisar las Noticias Espaciales en ASTROVERSE para mantenerte al día con los últimos hallazgos.',
      ]
      return NextResponse.json({
        role: 'assistant',
        content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      })
    }
  } catch (error) {
    console.error('AI Chat API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
