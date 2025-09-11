'use client'

import { useState, useRef, useEffect } from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import ResponseActions from './ResponseActions'

// Marketing Manager Personas
const MARKETING_MANAGERS = {
  dita: {
    name: "Sarah van der Berg",
    title: "Marketing Manager bij Dita Hockey",
    brand: "Dita",
    sport: "Hockey",
    avatar: "🏒",
    description: "Verantwoordelijk voor de wereldwijde merkstrategie van Dita, het premium hockeymerk uit Nederland",
    personality: "Professioneel, gepassioneerd over hockey, strategisch denkend, en trots op de Nederlandse hockey-erfenis",
    background: `Ik ben Sarah van der Berg, Marketing Manager bij Dita Hockey. Dita is een Nederlands premium hockeymerk dat sinds 1891 bestaat en bekend staat om innovatieve hockeysticks en uitrusting van topkwaliteit.

Mijn achtergrond:
- 8 jaar ervaring in sportmarketing
- Voormalig hockeyster op nationaal niveau
- Master in Sport Business Management
- Gespecialiseerd in premium merkpositionering

Over Dita:
- Opgericht in 1891 in Nederland
- Premium hockeymerk met focus op innovatie
- Gebruikt door topspelers wereldwijd
- Bekend om de iconische CompoTec technologie
- Sterke aanwezigheid in Europa, Azië en Oceanië
- Sponsor van nationale teams en topclubs

Onze merkwaarden:
- Innovatie en technologie
- Nederlandse vakmanschap
- Prestatie en kwaliteit
- Traditie en erfenis
- Duurzaamheid

Ik ben hier om je vragen te beantwoorden over onze marketingstrategie, merkpositionering, doelgroepen, uitdagingen in de hockeymarkt, en hoe we Dita als premium merk neerzetten in een competitieve sportmarkt.`,
    expertise: [
      "Premium merkpositionering",
      "Sponsoring en partnerships",
      "Internationale marktexpansie", 
      "Product marketing voor sportuitrusting",
      "Digital marketing in sport",
      "Influencer marketing met atleten",
      "Retail en distributie strategieën",
      "Merkactivatie tijdens toernooien"
    ]
  }
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function SportsChatBot() {
  const [selectedManager, setSelectedManager] = useState<keyof typeof MARKETING_MANAGERS>('dita')
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingResponse, setStreamingResponse] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const manager = MARKETING_MANAGERS[selectedManager]

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `Hallo! Ik ben **${manager.name}**, ${manager.title}. ${manager.avatar}

${manager.background}

**Wat kun je mij vragen?**
- Onze merkstrategie en positionering
- Hoe we omgaan met concurrentie (Grays, TK, Osaka)
- Onze sponsoring van topatleten en teams
- Marketing uitdagingen in de hockeywereld
- Internationale expansie strategieën
- Product innovatie en marketing
- Digital marketing en social media
- Retail partnerships en distributie

Stel gerust je vragen! Ik deel graag mijn ervaring en inzichten over marketing in de hockeyindustrie. 🏒`,
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [selectedManager])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingResponse])

  const generateSystemPrompt = (manager: typeof MARKETING_MANAGERS[keyof typeof MARKETING_MANAGERS]) => {
    return `Je bent ${manager.name}, ${manager.title}. Je hebt een ${manager.personality}.

ACHTERGROND EN CONTEXT:
${manager.background}

EXPERTISE GEBIEDEN:
${manager.expertise.map(item => `- ${item}`).join('\n')}

INSTRUCTIES VOOR HET GESPREK:
1. Blijf altijd in karakter als ${manager.name}
2. Gebruik je expertise en achtergrond om realistische, gedetailleerde antwoorden te geven
3. Deel concrete voorbeelden en ervaringen uit de hockeyindustrie
4. Wees professioneel maar toegankelijk - je praat met studenten
5. Gebruik Nederlandse taal (de student vraagt in het Nederlands)
6. Verwijs naar echte uitdagingen en trends in sportmarketing
7. Geef praktische inzichten die studenten kunnen gebruiken
8. Stel soms tegenvragen om het gesprek dieper te maken
9. Gebruik af en toe hockey-gerelateerde emoji's (🏒, 🥅, 🏆)
10. Verwijs naar echte concurrenten, spelers, en trends in hockey

BELANGRIJKE MERKINFO DITA:
- Premium Nederlands hockeymerk sinds 1891
- Bekend om CompoTec technologie
- Concurrenten: Grays, TK, Osaka, Adidas Hockey
- Sterke positie in Europa, groeiend in Azië
- Focus op innovatie en kwaliteit
- Sponsort topspelers en nationale teams

Antwoord altijd vanuit je rol als marketing manager met echte branche-expertise.`
  }

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading || isStreaming) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsLoading(true)
    setStreamingResponse('')

    // Create abort controller
    abortControllerRef.current = new AbortController()

    try {
      const systemPrompt = generateSystemPrompt(manager)
      const conversationHistory = messages.map(msg => 
        `${msg.role === 'user' ? 'Student' : manager.name}: ${msg.content}`
      ).join('\n\n')

      const fullPrompt = `${systemPrompt}

GESPREKGESCHIEDENIS:
${conversationHistory}

Student: ${currentMessage}

${manager.name}:`

      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: fullPrompt,
          aiModel: 'smart'
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setIsLoading(false)
      setIsStreaming(true)

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullResponse = ''

      if (!reader) throw new Error('No readable stream available')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.error) {
                throw new Error(data.message || 'Streaming error')
              }
              
              if (data.done) {
                setIsStreaming(false)
                const assistantMessage: Message = {
                  id: Date.now().toString(),
                  role: 'assistant',
                  content: fullResponse,
                  timestamp: new Date()
                }
                setMessages(prev => [...prev, assistantMessage])
                setStreamingResponse('')
                return
              }
              
              if (data.token) {
                fullResponse += data.token
                setStreamingResponse(fullResponse)
              }
            } catch (parseError) {
              console.error('Error parsing streaming data:', parseError)
            }
          }
        }
      }

    } catch (error: any) {
      console.error('Chat error:', error)
      setIsLoading(false)
      setIsStreaming(false)
      
      if (error.name !== 'AbortError') {
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Sorry, er is een technische fout opgetreden. Probeer het opnieuw. (${error.message})`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    const welcomeMessage: Message = {
      id: 'welcome-' + Date.now(),
      role: 'assistant',
      content: `Hallo! Ik ben **${manager.name}**, ${manager.title}. ${manager.avatar}

${manager.background}

**Wat kun je mij vragen?**
- Onze merkstrategie en positionering
- Hoe we omgaan met concurrentie (Grays, TK, Osaka)
- Onze sponsoring van topatleten en teams
- Marketing uitdagingen in de hockeywereld
- Internationale expansie strategieën
- Product innovatie en marketing
- Digital marketing en social media
- Retail partnerships en distributie

Stel gerust je vragen! Ik deel graag mijn ervaring en inzichten over marketing in de hockeyindustrie. 🏒`,
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
    setStreamingResponse('')
  }

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl">
              {manager.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold">{manager.name}</h2>
              <p className="text-blue-100">{manager.title}</p>
              <p className="text-sm text-blue-200">{manager.description}</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors text-sm"
            title="Nieuw gesprek starten"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              {message.role === 'assistant' ? (
                <div>
                  <MarkdownRenderer content={message.content} />
                  <ResponseActions 
                    content={message.content}
                    isMarkdown={true}
                    className="mt-3"
                  />
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
              <div className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {/* Streaming Response */}
        {isStreaming && streamingResponse && (
          <div className="flex justify-start">
            <div className="max-w-3xl bg-white border border-gray-200 shadow-sm rounded-lg p-4">
              <MarkdownRenderer content={streamingResponse} />
              <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse ml-1"></span>
              <ResponseActions 
                content={streamingResponse}
                isMarkdown={true}
                isStreaming={true}
                className="mt-3"
              />
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !isStreaming && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-gray-600 text-sm">{manager.name} denkt na...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Stel een vraag aan ${manager.name} over marketing bij ${manager.brand}...`}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              disabled={isLoading || isStreaming}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || isLoading || isStreaming}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading || isStreaming ? '⏳' : '🚀'}
          </button>
        </div>

        {/* Suggested Questions */}
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">💡 Voorbeeldvragen:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Hoe positioneert Dita zich ten opzichte van concurrenten?",
              "Welke marketing uitdagingen heeft de hockeyindustrie?",
              "Hoe kies je de juiste atleten voor sponsoring?",
              "Wat is jullie strategie voor social media marketing?"
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => setCurrentMessage(question)}
                disabled={isLoading || isStreaming}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}