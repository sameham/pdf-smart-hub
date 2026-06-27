import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured', content: 'عذراً، خدمة الذكاء الاصطناعي غير مُهيأة. يرجى إضافة OPENAI_API_KEY في إعدادات Vercel.' },
        { status: 503 }
      )
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 1500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API error:', error)
      return NextResponse.json(
        { content: 'حدث خطأ في الاتصال بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى.' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || 'لم أتمكن من الإجابة.'

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { content: 'حدث خطأ داخلي. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    )
  }
}
