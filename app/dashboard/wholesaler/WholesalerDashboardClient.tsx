'use client'

import { useState } from 'react'
import Link from 'next/link'

interface WholesalerPrice {
  id: string
  product: string
  pricePerUnit: number
  quantityUnit: string
  availableQuantity: number
  location: string
  notes: string | null
  lastUpdated: string
}

interface DemandSignal {
  product: string
  buyerCount: number
  avgPrice: number
}

interface Thread {
  id: string
  retailerName: string
  product: string
  lastMessage: string
  lastMessageAt: string
}

export default function WholesalerDashboardClient({
  user,
  prices,
  demandSignals,
  threads,
}: {
  user: { id: string; shopName: string; location: string }
  prices: WholesalerPrice[]
  demandSignals: DemandSignal[]
  threads: Thread[]
}) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'demand' | 'messages'>('inventory')
  const [showAddForm, setShowAddForm] = useState(false)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    product: '',
    pricePerUnit: '',
    quantityUnit: 'bag',
    availableQuantity: '',
    notes: '',
  })
  const [localPrices, setLocalPrices] = useState(prices)

  async function addPrice() {
    setAdding(true)
    try {
      const res = await fetch('/api/wholesalers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: form.product,
          pricePerUnit: parseFloat(form.pricePerUnit),
          quantityUnit: form.quantityUnit,
          availableQuantity: parseFloat(form.availableQuantity),
          notes: form.notes,
        }),
      })
      const data = await res.json()
      setLocalPrices(prev => [{ ...data, lastUpdated: data.lastUpdated || new Date().toISOString() }, ...prev])
      setShowAddForm(false)
      setForm({ product: '', pricePerUnit: '', quantityUnit: 'bag', availableQuantity: '', notes: '' })
    } catch {
      alert('Failed to add price')
    } finally {
      setAdding(false)
    }
  }

  const UNITS = ['bag', 'kg', 'carton', 'crate', 'litre', 'piece', 'pack', 'dozen']

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      <header className="bg-blue-600 text-white px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-black text-xl">PIC</div>
            <div className="text-blue-100 text-sm">{user.shopName} · Wholesaler</div>
            <div className="text-blue-200 text-xs">{user.location}</div>
          </div>
          <Link href="/api/auth/logout" className="bg-white/10 rounded-xl px-3 py-2 text-sm">
            Logout
          </Link>
        </div>
      </header>

      <div className="bg-white border-b flex px-2 sticky top-0 z-10 shadow-sm">
        {[
          { id: 'inventory', label: 'Inventory', icon: '📦' },
          { id: 'demand', label: 'Demand', icon: '📊' },
          { id: 'messages', label: 'Messages', icon: '💬', badge: threads.some(t => t.lastMessage) },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'inventory' | 'demand' | 'messages')}
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'inventory' && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">📦 My Inventory</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold"
              >
                + Add Product
              </button>
            </div>

            {showAddForm && (
              <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
                <h3 className="font-bold text-gray-800">Add Product</h3>
                <input
                  placeholder="Product name (e.g. rice)"
                  value={form.product}
                  onChange={e => setForm(prev => ({ ...prev, product: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 text-gray-800"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Price per unit (₦)"
                    type="number"
                    value={form.pricePerUnit}
                    onChange={e => setForm(prev => ({ ...prev, pricePerUnit: e.target.value }))}
                    className="border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 text-gray-800"
                  />
                  <select
                    value={form.quantityUnit}
                    onChange={e => setForm(prev => ({ ...prev, quantityUnit: e.target.value }))}
                    className="border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 text-gray-800"
                  >
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <input
                  placeholder="Available quantity"
                  type="number"
                  value={form.availableQuantity}
                  onChange={e => setForm(prev => ({ ...prev, availableQuantity: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 text-gray-800"
                />
                <input
                  placeholder="Notes (optional)"
                  value={form.notes}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 text-gray-800"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addPrice}
                    disabled={adding || !form.product || !form.pricePerUnit}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-50"
                  >
                    {adding ? 'Adding...' : 'Add Product'}
                  </button>
                </div>
              </div>
            )}

            {localPrices.length > 0 ? (
              localPrices.map(price => (
                <div key={price.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800 capitalize">{price.product}</span>
                    <span className="text-blue-600 font-bold">₦{price.pricePerUnit.toLocaleString()}/{price.quantityUnit}</span>
                  </div>
                  <div className="text-gray-500 text-sm mt-1">
                    {price.availableQuantity} {price.quantityUnit}s available
                  </div>
                  {price.notes && <div className="text-gray-400 text-xs mt-1">{price.notes}</div>}
                  <div className="text-gray-400 text-xs mt-2">
                    Updated {new Date(price.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📦</div>
                <p className="text-gray-500 text-sm">No products listed yet</p>
                <p className="text-gray-400 text-xs mt-1">Add your products so retailers can find you</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'demand' && (
          <>
            <h2 className="text-lg font-bold text-gray-800">📊 Retailer Demand Signals</h2>
            <p className="text-gray-500 text-sm">What retailers are buying this week</p>
            {demandSignals.length > 0 ? (
              demandSignals.map((signal, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800 capitalize">{signal.product}</span>
                    <span className="text-blue-600 font-bold text-sm">{signal.buyerCount} buyers</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min((signal.buyerCount / (demandSignals[0]?.buyerCount || 1)) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-gray-500 text-xs">Avg ₦{Math.round(signal.avgPrice).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📊</div>
                <p className="text-gray-500 text-sm">No demand signals yet</p>
                <p className="text-gray-400 text-xs mt-1">Data will appear as retailers log purchases</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'messages' && (
          <>
            <h2 className="text-lg font-bold text-gray-800">💬 Messages</h2>
            {threads.length > 0 ? (
              threads.map(thread => (
                <Link key={thread.id} href={`/dashboard/messages/${thread.id}`}>
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-800">{thread.retailerName}</span>
                      <span className="text-gray-400 text-xs">
                        {new Date(thread.lastMessageAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-blue-600 text-xs font-medium capitalize mb-1">{thread.product}</div>
                    <p className="text-gray-500 text-sm truncate">{thread.lastMessage || 'No messages yet'}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">💬</div>
                <p className="text-gray-500 text-sm">No messages yet</p>
                <p className="text-gray-400 text-xs mt-1">Retailers will contact you here</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
