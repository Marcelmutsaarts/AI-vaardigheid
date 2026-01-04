'use client'

import { useState, useRef, useEffect } from 'react'
import { useNiveau } from '@/contexts/NiveauContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatMarkdownWithNewlines } from '@/lib/format-markdown'
import { useStreamingChat } from '@/hooks/useStreamingChat'

interface AICoachProps {
  currentModule?: 'kiezen' | 'instrueren' | 'evalueren' | 'spelregels'
  moduleContext?: string
}

export function AICoach({ currentModule = 'kiezen', moduleContext }: AICoachProps) {
  const { niveau } = useNiveau()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [hasAddedWelcome, setHasAddedWelcome] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { messages, isStreaming, streamingContent, sendMessage, setMessages, clearMessages } = useStreamingChat({
    context: {
      niveau: niveau.schoolType as 'vmbo' | 'havo' | 'vwo' | 'mbo' | 'hbo',
      leerjaar: niveau.leerjaar,
      currentModule,
      moduleContext,
    },
  })

  // Scroll to bottom when new messages arrive or during streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  // Welcome message based on niveau
  useEffect(() => {
    const hasValidNiveau = niveau.schoolType && (
      niveau.schoolType === 'mbo' || niveau.schoolType === 'hbo' || niveau.leerjaar
    )

    if (isOpen && messages.length === 0 && hasValidNiveau && !hasAddedWelcome) {
      const welcomeMessages: Record<string, string> = {
        'vmbo-1-2': 'Hey! Ik ben de KIES-coach. Ik help je om beter met AI om te gaan. Waar kan ik je mee helpen?',
        'vmbo-3-4': 'Hoi! Ik ben de KIES-coach. Heb je vragen over AI? Vraag maar!',
        'havo-1-3': 'Hallo! Ik ben de KIES-coach. Ik begeleid je bij het leren werken met AI. Waarmee kan ik je helpen?',
        'havo-4-5': 'Welkom! Ik ben de KIES-coach en help je AI-vaardigheden te ontwikkelen. Wat wil je weten?',
        'vwo-1-3': 'Hallo! Als KIES-coach help ik je kritisch en effectief met AI om te gaan. Waar wil je over praten?',
        'vwo-4-6': 'Welkom! Ik ben de KIES-coach. Ik begeleid je bij het ontwikkelen van AI-vaardigheden. Wat kan ik voor je betekenen?',
        'mbo': 'Hoi! Ik ben de KIES-coach. Ik help je om AI slim in te zetten voor je opleiding en stage. Wat wil je weten?',
        'hbo': 'Welkom! Ik ben de KIES-coach en begeleid je bij professioneel AI-gebruik. Waarmee kan ik je helpen?',
      }

      let category: string
      if (niveau.schoolType === 'mbo') {
        category = 'mbo'
      } else if (niveau.schoolType === 'hbo') {
        category = 'hbo'
      } else if (niveau.schoolType === 'vmbo') {
        category = (niveau.leerjaar || 1) <= 2 ? 'vmbo-1-2' : 'vmbo-3-4'
      } else if (niveau.schoolType === 'havo') {
        category = (niveau.leerjaar || 1) <= 3 ? 'havo-1-3' : 'havo-4-5'
      } else {
        category = (niveau.leerjaar || 1) <= 3 ? 'vwo-1-3' : 'vwo-4-6'
      }

      setMessages([{
        role: 'assistant',
        content: welcomeMessages[category],
      }])
      setHasAddedWelcome(true)
    }
  }, [isOpen, messages.length, niveau, hasAddedWelcome, setMessages])

  const handleSend = async () => {
    const needsLeerjaar = niveau.schoolType !== 'mbo' && niveau.schoolType !== 'hbo'
    if (!input.trim() || isStreaming || !niveau.schoolType || (needsLeerjaar && !niveau.leerjaar)) return

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

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary-hover transition-all hover:scale-110 flex items-center justify-center',
          isOpen && 'hidden'
        )}
        aria-label="Open AI Coach"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[480px] max-w-[calc(100vw-48px)] animate-in slide-in-from-bottom-4 duration-300">
          <Card className="flex flex-col h-[75vh] max-h-[calc(100vh-100px)] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary text-white rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">KIES-coach</h3>
                  <p className="text-xs text-white/80">Altijd klaar om te helpen</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-white/20 transition-colors"
                aria-label="Sluit chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start space-x-2',
                    message.role === 'user' && 'flex-row-reverse space-x-reverse'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      message.role === 'user'
                        ? 'bg-gray-200'
                        : 'bg-primary text-white'
                    )}
                  >
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'rounded-lg px-4 py-2 max-w-[80%]',
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-white border border-border'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.role === 'assistant' ? formatMarkdownWithNewlines(message.content) : message.content}
                    </p>
                  </div>
                </div>
              ))}

              {isStreaming && streamingContent && (
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-white border border-border rounded-lg px-4 py-2 max-w-[80%]">
                    <p className="text-sm whitespace-pre-wrap">
                      {formatMarkdownWithNewlines(streamingContent)}
                    </p>
                  </div>
                </div>
              )}

              {isStreaming && !streamingContent && (
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-white border border-border rounded-lg px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-white rounded-b-lg">
              <div className="flex items-end space-x-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Stel een vraag..."
                  className="flex-1 resize-none rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[40px] max-h-[120px]"
                  rows={1}
                  disabled={isStreaming}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isStreaming}
                  size="icon"
                  className="h-10 w-10 flex-shrink-0"
                >
                  {isStreaming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                De KIES-coach gebruikt AI om je te helpen
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
