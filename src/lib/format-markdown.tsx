import React from 'react'

// Eenvoudige markdown parser voor bold en italic tekst
export function formatMarkdown(text: string): React.ReactNode[] {
  // Eerst bold (**tekst**), dan italic (*tekst*)
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={index}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

// Format een hele tekst met newlines
export function formatMarkdownWithNewlines(text: string): React.ReactNode {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>
      {formatMarkdown(line)}
      {i < arr.length - 1 && '\n'}
    </span>
  ))
}
