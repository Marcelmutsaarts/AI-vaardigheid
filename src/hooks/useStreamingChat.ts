'use client'

import { useState, useCallback, useRef } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatContext {
  niveau: 'vmbo' | 'havo' | 'vwo' | 'mbo' | 'hbo'
  leerjaar: number | null
  currentModule: 'kiezen' | 'instrueren' | 'evalueren' | 'spelregels'
  moduleContext?: string
  aiMode?: 'helpt' | 'doet'
}

interface UseStreamingChatOptions {
  context: ChatContext
  onError?: (error: string) => void
}

interface UseStreamingChatReturn {
  messages: Message[]
  isStreaming: boolean
  streamingContent: string
  sendMessage: (message: string) => Promise<void>
  clearMessages: () => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

export function useStreamingChat({ context, onError }: UseStreamingChatOptions): UseStreamingChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isStreaming) return

    // Add user message
    const userMessage: Message = { role: 'user', content: message.trim() }
    setMessages(prev => [...prev, userMessage])
    setIsStreaming(true)
    setStreamingContent('')

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          context: {
            ...context,
            conversationHistory: messages,
          },
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Er ging iets mis')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Geen response stream')
      }

      const decoder = new TextDecoder()
      let fullContent = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.content) {
                fullContent += data.content
                setStreamingContent(fullContent)
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      // Add the complete assistant message
      if (fullContent) {
        setMessages(prev => [...prev, { role: 'assistant', content: fullContent }])
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was aborted, don't show error
        return
      }

      const errorMessage = error instanceof Error ? error.message : 'Er ging iets mis'
      onError?.(errorMessage)

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, er ging iets mis. Probeer het opnieuw.'
      }])
    } finally {
      setIsStreaming(false)
      setStreamingContent('')
      abortControllerRef.current = null
    }
  }, [context, messages, isStreaming, onError])

  const clearMessages = useCallback(() => {
    // Abort any ongoing request
    abortControllerRef.current?.abort()
    setMessages([])
    setStreamingContent('')
    setIsStreaming(false)
  }, [])

  return {
    messages,
    isStreaming,
    streamingContent,
    sendMessage,
    clearMessages,
    setMessages,
  }
}
