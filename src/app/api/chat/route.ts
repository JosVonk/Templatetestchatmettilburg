import { GoogleGenerativeAI, Tool } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'API configuratie ontbreekt. Voeg GEMINI_API_KEY toe aan environment variables.'
        }, 
        { status: 500 }
      )
    }

    const body = await request.json()
    
    const { message } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Bericht is vereist' },
        { status: 400 }
      )
    }

    if (typeof message !== 'string' || message.length > 100000) {
      return NextResponse.json(
        { error: 'Bericht moet een string zijn van maximaal 100.000 karakters' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: message }] }]
    })

    const response = await result.response
    const text = response.text()

    return NextResponse.json({ response: text, success: true })

  } catch (error) {
    console.error('Fout bij het aanroepen van Gemini API:', error)
    
    // Betere error information voor debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { 
        error: 'Er is een fout opgetreden bij het verwerken van je bericht',
        details: errorMessage
      },
      { status: 500 }
    )
  }
} 