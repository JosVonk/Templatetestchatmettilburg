'use client'

import { useState, useEffect, useRef } from 'react'

interface ResponseActionsProps {
  content: string
  isMarkdown?: boolean
  isStreaming?: boolean
  className?: string
}

export default function ResponseActions({ 
  content, 
  isMarkdown = true, 
  isStreaming = false,
  className = ""
}: ResponseActionsProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'success' | 'error'>('idle')
  const [ttsStatus, setTtsStatus] = useState<'idle' | 'playing' | 'paused' | 'error' | 'waiting'>('idle')
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [bestVoice, setBestVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [speechRate, setSpeechRate] = useState(1.0)
  const [showSettings, setShowSettings] = useState(false)
  
  const speechActiveRef = useRef(false)

  // Predefined speed options
  const speedOptions = [
    { label: '🐌 Langzaam', value: 0.75 },
    { label: '📚 Normaal', value: 1.0 },
    { label: '⚡ Snel', value: 1.5 },
    { label: '🚀 Allersnelst', value: 2.0 }
  ]

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      setAvailableVoices(voices)
      
      // Find the best available voice
      const bestVoice = findBestVoice(voices)
      setBestVoice(bestVoice)
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      loadVoices()
      
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
      
      setTimeout(loadVoices, 100)
    }
  }, [])

  // Smart voice selection
  const findBestVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    if (voices.length === 0) return null

    const priorities = [
      { lang: 'nl-NL', quality: ['neural', 'premium', 'enhanced'] },
      { lang: 'nl-BE', quality: ['neural', 'premium', 'enhanced'] },
      { lang: 'en-US', quality: ['neural', 'premium', 'enhanced'] },
    ]

    for (const priority of priorities) {
      for (const qualityKeyword of priority.quality) {
        const voice = voices.find(v => 
          v.lang.toLowerCase().startsWith(priority.lang.toLowerCase()) &&
          v.name.toLowerCase().includes(qualityKeyword)
        )
        if (voice) return voice
      }
      
      const regularVoice = voices.find(v => 
        v.lang.toLowerCase().startsWith(priority.lang.toLowerCase())
      )
      if (regularVoice) return regularVoice
    }

    return voices[0]
  }

  // Convert markdown to plain text
  const convertMarkdownToPlainText = (markdown: string): string => {
    return markdown
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/^[\s]*[-*+]\s+/gm, '')
      .replace(/^[\s]*\d+\.\s+/gm, '')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim()
  }

  const handleCopy = async () => {
    if (isStreaming || !content.trim()) return

    setCopyStatus('copying')
    
    try {
      const textToCopy = isMarkdown ? convertMarkdownToPlainText(content) : content
      await navigator.clipboard.writeText(textToCopy)
      setCopyStatus('success')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch (error) {
      setCopyStatus('error')
      setTimeout(() => setCopyStatus('idle'), 2000)
    }
  }

  const handleTextToSpeech = () => {
    if (isStreaming || !content.trim()) return

    if (!('speechSynthesis' in window)) {
      setTtsStatus('error')
      setTimeout(() => setTtsStatus('idle'), 3000)
      return
    }

    if (ttsStatus === 'playing') {
      window.speechSynthesis.pause()
      setTtsStatus('paused')
      return
    }

    if (ttsStatus === 'paused') {
      window.speechSynthesis.resume()
      setTtsStatus('playing')
      return
    }

    startNewSpeech()
  }

  const startNewSpeech = () => {
    window.speechSynthesis.cancel()
    speechActiveRef.current = false
    
    setTimeout(() => {
      const textToSpeak = isMarkdown ? convertMarkdownToPlainText(content) : content
      
      if (!textToSpeak.trim()) return

      setTtsStatus('waiting')

      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      
      if (bestVoice) {
        utterance.voice = bestVoice
        utterance.lang = bestVoice.lang
      } else {
        utterance.lang = 'nl-NL'
      }

      utterance.rate = speechRate
      utterance.pitch = 1.1
      utterance.volume = 0.9

      utterance.onstart = () => {
        speechActiveRef.current = true
        setTtsStatus('playing')
      }

      utterance.onend = () => {
        speechActiveRef.current = false
        setTtsStatus('idle')
      }

      utterance.onerror = (event) => {
        if (event.error === 'interrupted' || event.error === 'canceled') {
          speechActiveRef.current = false
          setTtsStatus('idle')
        } else {
          speechActiveRef.current = false
          setTtsStatus('error')
          setTimeout(() => setTtsStatus('idle'), 3000)
        }
      }

      utterance.onpause = () => setTtsStatus('paused')
      utterance.onresume = () => setTtsStatus('playing')

      window.speechSynthesis.speak(utterance)
    }, 200)
  }

  const stopTextToSpeech = () => {
    window.speechSynthesis.cancel()
    speechActiveRef.current = false
    setTtsStatus('idle')
  }

  const changeSpeed = (newRate: number) => {
    setSpeechRate(newRate)
    
    if (ttsStatus === 'playing') {
      startNewSpeech()
    }
  }

  const getCopyButtonText = () => {
    switch (copyStatus) {
      case 'copying': return '⏳ Kopiëren...'
      case 'success': return '✅ Gekopieerd!'
      case 'error': return '❌ Fout'
      default: return '📋 Kopiëren'
    }
  }

  const getTtsButtonText = () => {
    if (bestVoice) {
      switch (ttsStatus) {
        case 'playing': return '⏸️ Pauzeren'
        case 'paused': return '▶️ Hervatten'
        case 'waiting': return '⏳ Starten...'
        case 'error': return '❌ Fout'
        default: return `🔊 Uitspreken`
      }
    } else {
      switch (ttsStatus) {
        case 'playing': return '⏸️ Pauzeren'
        case 'paused': return '▶️ Hervatten'
        case 'waiting': return '⏳ Starten...'
        case 'error': return '❌ Fout'
        default: return '🔊 Uitspreken'
      }
    }
  }

  const getButtonClass = (status: string) => {
    const baseClass = "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed"
    
    switch (status) {
      case 'success':
        return `${baseClass} bg-green-100 text-green-700 border border-green-200`
      case 'error':
        return `${baseClass} bg-red-100 text-red-700 border border-red-200`
      case 'loading':
        return `${baseClass} bg-blue-100 text-blue-700 border border-blue-200`
      case 'playing':
        return `${baseClass} bg-blue-100 text-blue-700 border border-blue-200 animate-pulse`
      case 'paused':
        return `${baseClass} bg-yellow-100 text-yellow-700 border border-yellow-200`
      default:
        return `${baseClass} bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-200`
    }
  }

  if (!content.trim()) return null

  return (
    <div className={`mt-3 ${className}`}>
      <div className="flex items-center justify-end space-x-2 relative">
        {/* TTS Button */}
        <button
          onClick={handleTextToSpeech}
          disabled={isStreaming}
          className={getButtonClass(ttsStatus)}
          title={
            isStreaming ? "Wacht tot response compleet is" :
            ttsStatus === 'playing' ? "Pauzeer voorlezen" :
            ttsStatus === 'paused' ? "Hervat voorlezen" :
            "Lees voor"
          }
        >
          <span>{getTtsButtonText()}</span>
        </button>

        {/* Stop TTS Button */}
        {(ttsStatus === 'playing' || ttsStatus === 'paused') && (
          <button
            onClick={stopTextToSpeech}
            className="p-2 rounded-lg text-sm transition-all duration-200 bg-red-100 hover:bg-red-200 text-red-700 border border-red-200"
            title="Stop voorlezen"
          >
            ⏹️
          </button>
        )}

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg text-sm transition-all duration-200 ${
            showSettings 
              ? 'bg-blue-100 text-blue-700 border border-blue-200' 
              : 'bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-700 border border-gray-200'
          }`}
          title="TTS instellingen"
        >
          ⚙️
        </button>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          disabled={isStreaming || copyStatus === 'copying'}
          className={getButtonClass(copyStatus)}
          title="Kopieer naar klembord"
        >
          <span>{getCopyButtonText()}</span>
        </button>
      </div>

      {/* Settings Dropdown */}
      {showSettings && (
        <div className="absolute z-20 mt-2 right-0 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-xl">
          <div>
            <label className="block text-blue-700 text-sm font-medium mb-2">⚡ Spraaksnelheid</label>
            <div className="grid grid-cols-2 gap-2">
              {speedOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => changeSpeed(option.value)}
                  className={`px-3 py-2 text-xs rounded-lg transition-all duration-200 ${
                    speechRate === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="mt-2 text-blue-600 text-xs text-center">
              Huidige snelheid: {speechRate}x
            </div>
          </div>
        </div>
      )}
    </div>
  )
}