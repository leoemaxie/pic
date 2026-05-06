'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: string
  read: boolean
}

interface Thread {
  id: string
  product: string
  retailerName: string
  wholesalerName: string
}

export default function MessagesClient({
  thread,
  initialMessages,
  userId,
}: {
  thread: Thread
  initialMessages: Message[]
  userId: string
}) {
  const router = useRouter()
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || sending) return
    setSending(true)
    try {
      const res = await fetch(`/api/messages/${thread.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { ...data, timestamp: data.timestamp || new Date().toISOString() }])
      setInput('')
    } catch {
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      <header className="bg-blue-600 text-white px-4 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-white/80 hover:text-white">
            ←
          </button>
          <div>
            <div className="font-bold">{thread.retailerName} ↔ {thread.wholesalerName}</div>
            <div className="text-blue-100 text-sm capitalize">{thread.product}</div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.senderId === userId
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white shadow-sm text-gray-800 rounded-bl-sm'
              }`}
            >
              <p>{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.senderId === userId ? 'text-blue-200' : 'text-gray-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white border-t flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 text-gray-800"
        />
        <button
          onClick={sendMessage}
          disabled={sending || !input.trim()}
          className="bg-blue-600 text-white rounded-xl px-4 py-3 font-bold disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}
