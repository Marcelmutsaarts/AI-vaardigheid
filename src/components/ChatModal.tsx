'use client'

import { useRef, useEffect, useState } from 'react'
import { X, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNiveau } from '@/contexts/NiveauContext'
import { formatMarkdownWithNewlines } from '@/lib/format-markdown'
import { useStreamingChat } from '@/hooks/useStreamingChat'

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  role: {
    id: string
    emoji: string
    titel: string
    beschrijving: string
    voorbeeld: string
    voorbeeldMBO?: string
    voorbeeldHBO?: string
  }
  mode: 'helpt' | 'doet'
}

const rolePrompts: Record<string, string> = {
  // AI helpt mij
  uitlegger: 'Je bent nu in "Uitlegger" modus. De leerling wil iets begrijpen. Leg dingen helder en eenvoudig uit. Gebruik voorbeelden. Vraag of ze het snappen.',
  brainstormer: 'Je bent nu in "Brainstormer" modus. Help de leerling met ideeën bedenken. Stel vragen om creativiteit te stimuleren. Geef suggesties maar laat de leerling kiezen.',
  feedbacker: 'Je bent nu in "Feedbacker" modus. De leerling wil feedback op iets. Geef constructieve feedback. Benoem wat goed is en wat beter kan. Wees bemoedigend.',
  oefenmaatje: 'Je bent nu in "Oefenmaatje" modus. Help de leerling oefenen. Dit kan een quiz zijn, een rollenspel, of samen iets doornemen. Maak het interactief.',
  // AI doet het
  schrijver: 'Je bent nu in "Schrijver" modus. De leerling vraagt je iets te schrijven. Schrijf een korte tekst zoals gevraagd. Houd het beknopt (max 100 woorden). Vraag daarna of ze het willen aanpassen.',
  vertaler: 'Je bent nu in "Vertaler" modus. Vertaal teksten naar de gewenste taal. Wees accuraat. Vraag om verduidelijking als iets onduidelijk is.',
  verbeteraar: 'Je bent nu in "Verbeteraar" modus. Verbeter spelling, grammatica en zinsbouw van teksten. Leg kort uit wat je hebt verbeterd.',
  samenvatter: 'Je bent nu in "Samenvatter" modus. Maak korte, duidelijke samenvattingen. Houd de kern intact. Vraag om de tekst die samengevat moet worden.',
}

export function ChatModal({ isOpen, onClose, role, mode }: ChatModalProps) {
  const { niveau } = useNiveau()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { messages, isStreaming, streamingContent, sendMessage, clearMessages } = useStreamingChat({
    context: {
      niveau: niveau.schoolType as 'vmbo' | 'havo' | 'vwo' | 'mbo' | 'hbo',
      leerjaar: niveau.leerjaar,
      currentModule: 'kiezen',
      moduleContext: rolePrompts[role.id] || '',
      aiMode: mode,
    },
  })

  // Reset chat when role changes, pre-fill with example
  useEffect(() => {
    if (isOpen) {
      clearMessages()
      // Pre-fill input with example (remove quotes) and replace placeholders with actual niveau
      // Use MBO/HBO-specific example if available
      let example: string
      if (niveau.schoolType === 'mbo' && role.voorbeeldMBO) {
        example = role.voorbeeldMBO
      } else if (niveau.schoolType === 'hbo' && role.voorbeeldHBO) {
        example = role.voorbeeldHBO
      } else {
        example = role.voorbeeld.replace(/^["']|["']$/g, '')
        // Replace placeholders for VO
        example = example
          .replace(/{schoolType}/g, niveau.schoolType?.toUpperCase() || 'HAVO')
          .replace(/{leerjaar}/g, String(niveau.leerjaar || 3))
      }
      setInput(example)
      setTimeout(() => {
        inputRef.current?.focus()
        // Select the text so user can easily modify or replace
        inputRef.current?.select()
      }, 100)
    }
  }, [isOpen, role.id, role.voorbeeld, role.voorbeeldMBO, role.voorbeeldHBO, niveau.schoolType, niveau.leerjaar, clearMessages])

  // Scroll to bottom when messages change or during streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return
    const message = input.trim()
    setInput('')
    await sendMessage(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl h-[75vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{role.emoji}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{role.titel}</h3>
              <p className="text-xs text-gray-500">
                {mode === 'helpt' ? 'AI helpt mij' : 'AI doet het'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && !isStreaming && (
            <p className="text-center text-gray-400 text-sm mt-8">
              Pas de voorbeeldprompt aan of verstuur direct
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">
                  {msg.role === 'assistant' ? formatMarkdownWithNewlines(msg.content) : msg.content}
                </p>
              </div>
            </div>
          ))}
          {isStreaming && streamingContent && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-2 bg-gray-100 text-gray-900">
                <p className="text-sm whitespace-pre-wrap">
                  {formatMarkdownWithNewlines(streamingContent)}
                </p>
              </div>
            </div>
          )}
          {isStreaming && !streamingContent && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Typ je bericht..."
              rows={4}
              className="flex-1 px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              disabled={isStreaming}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              size="icon"
              className="rounded-full h-10 w-10 flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
