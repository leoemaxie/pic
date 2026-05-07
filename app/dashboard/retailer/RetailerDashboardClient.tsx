'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { savePendingPurchase, syncPendingPurchases } from '@/lib/offline-db'

interface PurchaseLog {
  id: string
  product: string
  quantity: number
  quantityUnit: string
  pricePerUnit: number
  rawMessage: string
  timestamp: string
  confidenceScore: number
}

interface MarketData {
  id: string
  product: string
  location: string
  priceMin: number
  priceMax: number
  priceMean: number
  trend: string
  buyerCount: number
}

interface BriefingAlert {
  product: string
  location: string
  priceRange: string
  trend: string
  message: string
  buyerCount: number
}

interface Briefing {
  alerts: BriefingAlert[]
  generatedAt: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  parsed?: {
    product: string
    quantity: number
    quantityUnit: string
    pricePerUnit: number
    confidence: number
  }
}

export default function RetailerDashboardClient({
  user,
  recentLogs,
  briefing,
  marketData,
}: {
  user: { id: string; shopName: string; location: string; role: string }
  recentLogs: PurchaseLog[]
  briefing: Briefing | null
  marketData: MarketData[]
}) {
  const [activeTab, setActiveTab] = useState<'chat' | 'briefing' | 'market' | 'history'>('chat')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: `👋 Hi! I'm PIC. Tell me what you bought today and I'll log it for you.\n\nTry: "I bought 5 bags of rice at ₦8,500"`,
    },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [showBriefingBadge, setShowBriefingBadge] = useState(!!briefing)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Sync any pending offline purchases when back online
  useEffect(() => {
    function handleOnline() {
      syncPendingPurchases(async (purchase) => {
        await fetch('/api/purchases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: purchase.message }),
        })
      }).then(count => {
        if (count > 0) {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: `🔄 Synced ${count} offline purchase${count !== 1 ? 's' : ''} to server.`,
          }])
        }
      }).catch(() => {})
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [])

  async function sendMessage() {
    if (!input.trim() || sending) return
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setSending(true)

    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })
      const data = await res.json()

      if (data.parsed && data.parsed.confidence > 0.5) {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.parsed.confidence < 0.7
            ? `I understood:\n• ${data.parsed.product} — ${data.parsed.quantity} ${data.parsed.quantityUnit} at ₦${data.parsed.pricePerUnit.toLocaleString()}\n\nDoes that look right? ✓`
            : `✅ Logged! ${data.parsed.product} — ${data.parsed.quantity} ${data.parsed.quantityUnit} at ₦${data.parsed.pricePerUnit.toLocaleString()}/unit\n\n${data.marketInsight || ''}`,
          parsed: data.parsed,
        }
        setMessages(prev => [...prev, assistantMsg])
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I couldn't fully understand that. Try saying:\n"I bought [quantity] [unit] of [product] at [price]"\n\nExample: "I bought 10 bags of rice at ₦8,200"`,
        }])
      }
    } catch {
      // Save to IndexedDB for later sync
      await savePendingPurchase({ id: Date.now().toString(), message: userMsg.content, timestamp: new Date().toISOString(), synced: false }).catch(() => {})
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Saved offline. Will sync when connected.',
      }])
    } finally {
      setSending(false)
    }
  }

  const trendIcon = (trend: string) => trend === 'rising' ? '📈' : trend === 'falling' ? '📉' : '➡️'
  const trendColor = (trend: string) => trend === 'rising' ? 'text-red-600' : trend === 'falling' ? 'text-green-600' : 'text-gray-600'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      <header className="bg-blue-600 text-white px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-black text-xl">PIC</div>
            <div className="text-blue-100 text-sm">{user.shopName} · {user.location}</div>
          </div>
          <div className="flex gap-2 items-center">
            <Link href="/dashboard/wholesalers" className="bg-white/20 rounded-xl px-3 py-2 text-sm font-semibold">
              Find Suppliers
            </Link>
            <Link href="/api/auth/logout" className="bg-white/10 rounded-xl px-3 py-2 text-sm">
              Logout
            </Link>
          </div>
        </div>
      </header>

      <div className="bg-white border-b flex px-2 sticky top-0 z-10 shadow-sm">
        {[
          { id: 'chat', label: 'Chat', icon: '💬' },
          { id: 'briefing', label: 'Briefing', icon: '📰', badge: showBriefingBadge },
          { id: 'market', label: 'Market', icon: '📊' },
          { id: 'history', label: 'History', icon: '📋' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as 'chat' | 'briefing' | 'market' | 'history')
              if (tab.id === 'briefing') setShowBriefingBadge(false)
            }}
            className={`flex-1 py-3 text-xs font-semibold flex flex-col items-center gap-1 relative transition-colors ${
              activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-white shadow-sm text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    {msg.content.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < msg.content.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                    {msg.parsed && (
                      <div className={`mt-2 pt-2 border-t text-xs ${msg.role === 'user' ? 'border-blue-400 text-blue-100' : 'border-gray-100 text-gray-500'}`}>
                        Confidence: {Math.round(msg.parsed.confidence * 100)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-sm rounded-2xl px-4 py-3 text-gray-400 text-sm">
                    <span className="animate-pulse">PIC is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
              {['5 bags of rice at ₦8,500', '10 litres of oil at ₦3,000', '2 cartons of noodles at ₦4,200'].map(s => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="whitespace-nowrap text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1.5 font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="p-4 bg-white border-t flex gap-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="I bought 5 bags of rice at ₦8,500..."
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 text-gray-800"
              />
              <button
                onClick={sendMessage}
                disabled={sending || !input.trim()}
                className="bg-blue-600 text-white rounded-xl px-4 py-3 font-bold disabled:opacity-50 hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </>
        )}

        {activeTab === 'briefing' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {briefing ? (
              <>
                <div className="text-sm text-gray-500">
                  Generated {new Date(briefing.generatedAt).toLocaleDateString()}
                </div>
                <h2 className="text-lg font-bold text-gray-800">📰 Today&apos;s Market Briefing</h2>
                {briefing.alerts.map((alert, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-800 capitalize">{alert.product}</span>
                      <span className={`text-sm font-semibold ${trendColor(alert.trend)}`}>
                        {trendIcon(alert.trend)} {alert.trend}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{alert.message}</p>
                    <div className="mt-2 flex gap-4 text-xs text-gray-500">
                      <span>Range: {alert.priceRange}</span>
                      <span>{alert.buyerCount} buyers</span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📰</div>
                <h3 className="text-lg font-bold text-gray-700">No briefing yet</h3>
                <p className="text-gray-500 text-sm mt-2">
                  Start logging purchases to get personalized market briefings
                </p>
                <button onClick={() => setActiveTab('chat')} className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold">
                  Log a Purchase
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'market' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <h2 className="text-lg font-bold text-gray-800">📊 Market Intelligence</h2>
            {marketData.length > 0 ? (
              marketData.map(item => (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-800 capitalize">{item.product}</span>
                    <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      item.trend === 'rising' ? 'bg-red-50 text-red-600' :
                      item.trend === 'falling' ? 'bg-green-50 text-green-600' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {trendIcon(item.trend)} {item.trend}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-green-50 rounded-xl p-2">
                      <div className="text-xs text-gray-500">Lowest</div>
                      <div className="font-bold text-green-700 text-sm">₦{item.priceMin.toLocaleString()}</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-2">
                      <div className="text-xs text-gray-500">Average</div>
                      <div className="font-bold text-blue-700 text-sm">₦{Math.round(item.priceMean).toLocaleString()}</div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-2">
                      <div className="text-xs text-gray-500">Highest</div>
                      <div className="font-bold text-red-700 text-sm">₦{item.priceMax.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">{item.buyerCount} buyers in {item.location}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📊</div>
                <p className="text-gray-500 text-sm">Market data will appear as more users log purchases</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <h2 className="text-lg font-bold text-gray-800">📋 Purchase History</h2>
            {recentLogs.length > 0 ? (
              recentLogs.map(log => (
                <div key={log.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800 capitalize">{log.product}</span>
                    <span className="text-blue-600 font-bold">₦{log.pricePerUnit.toLocaleString()}/unit</span>
                  </div>
                  <div className="text-gray-500 text-sm mt-1">
                    {log.quantity} {log.quantityUnit} · ₦{(log.pricePerUnit * log.quantity).toLocaleString()} total
                  </div>
                  <div className="text-gray-400 text-xs mt-2">
                    {new Date(log.timestamp).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="mt-2 text-xs text-gray-400 italic truncate">&quot;{log.rawMessage}&quot;</div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-gray-500 text-sm">No purchases logged yet. Start chatting!</p>
                <button onClick={() => setActiveTab('chat')} className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold">
                  Log First Purchase
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
