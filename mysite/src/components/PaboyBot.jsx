import {useEffect, useRef, useState} from 'react'

/**
 * PaboyBot - lightweight on-page helper bot.
 * Features:
 * - Floating toggle button
 * - Small chat window with persistent history (localStorage)
 * - Simple rule-based matcher for FAQs
 * - Graceful fallback to generic response
 */
export function PaboyBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem('paboy_history')
      return stored ? JSON.parse(stored) : [
        { id: 'intro', role: 'bot', text: 'Hi! I\'m Paboy 🤖. Ask me about the gallery, images, or how to add content.' }
      ]
    } catch {
      return [{ id: 'intro', role: 'bot', text: 'Hi! I\'m Paboy 🤖.' }]
    }
  })
  const [input, setInput] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    try { localStorage.setItem('paboy_history', JSON.stringify(messages.slice(-60))) } catch {}
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return

    const userMsg = { id: Date.now() + '-u', role: 'user', text: trimmed }
    setMessages(m => [...m, userMsg])
    setInput('')

    setTimeout(() => {
      const reply = generateReply(trimmed)
      setMessages(m => [...m, { id: Date.now() + '-b', role: 'bot', text: reply }])
    }, 180)
  }

  function generateReply(text) {
    const q = text.toLowerCase()
    const rules = [
      { match: /(hello|hi|hey)/, answer: 'Hello! How can I help? You can ask "how do I add an image".' },
      { match: /add(ing)? (an? )?image|upload/, answer: 'Open Sanity Studio → New “Gallery Item” → fill title, image, description → Publish. It appears here automatically.' },
      { match: /order|sort|reorder/, answer: 'Use the "Display Order" field in a gallery item. Lower numbers show first.' },
      { match: /deploy|publish/, answer: 'Frontend deploys via GitHub Actions on push. Studio can be deployed separately if needed.' },
      { match: /draft|unpublish/, answer: 'Uncheck Published to hide an item. Draft support preview could be added later.' },
      { match: /tags?/, answer: 'Tags are stored but not yet filterable in the UI. A filter bar can be added next.' },
      { match: /help|what can you do/, answer: 'I can answer basic questions about the gallery setup, ordering, deployment, and content updates.' },
    ]

    const found = rules.find(r => r.match.test(q))
    if (found) return found.answer
    if (q.length < 6) return 'Could you phrase that with a bit more detail?'
    return 'Not sure yet. Try asking about: adding images, ordering, deploy, tags, or drafts.'
  }

  return (
    <>
      <button
        aria-label={open ? 'Close Paboy bot' : 'Open Paboy bot'}
        className={`paboy-toggle ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        {open ? '✖' : 'Paboy'}
      </button>
      {open && (
        <div className="paboy-panel" role="dialog" aria-label="Paboy assistant">
          <header className="paboy-header">
            <strong>Paboy</strong>
            <button className="paboy-close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </header>
          <ul className="paboy-messages" ref={listRef}>
            {messages.map(m => (
              <li key={m.id} className={m.role === 'bot' ? 'bot' : 'user'}>
                <span>{m.text}</span>
              </li>
            ))}
          </ul>
          <form className="paboy-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask something..."
              aria-label="Message Paboy"
              autoComplete="off"
            />
            <button type="submit" disabled={!input.trim()}>Send</button>
          </form>
        </div>
      )}
    </>
  )
}
