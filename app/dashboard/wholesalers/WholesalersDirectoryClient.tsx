'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface WholesalerListing {
  id: string
  product: string
  pricePerUnit: number
  quantityUnit: string
  availableQuantity: number
  location: string
  notes: string | null
  wholesaler: {
    id: string
    shopName: string
    location: string
    phone: string
  }
}

export default function WholesalersDirectoryClient({ userId: _userId }: { userId: string }) {
  const [listings, setListings] = useState<WholesalerListing[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchListings()
  }, [])

  async function fetchListings(product?: string) {
    setLoading(true)
    try {
      const url = product ? `/api/wholesalers?product=${encodeURIComponent(product)}` : '/api/wholesalers'
      const res = await fetch(url)
      const data = await res.json()
      setListings(Array.isArray(data) ? data : [])
    } catch {
      setListings([])
    } finally {
      setLoading(false)
    }
  }

  async function contactWholesaler(wholesalerId: string, product: string) {
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wholesalerId, product, text: `Hi, I'm interested in your ${product}. Is it still available?` }),
      })
      alert('Message sent! Check your messages tab.')
    } catch {
      alert('Failed to send message')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      <header className="bg-blue-600 text-white px-4 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/retailer" className="text-white/80 hover:text-white">
            ← Back
          </Link>
          <div>
            <div className="font-black text-xl">Find Suppliers</div>
            <div className="text-blue-100 text-sm">Browse wholesaler listings</div>
          </div>
        </div>
      </header>

      <div className="p-4 bg-white border-b">
        <div className="flex gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchListings(search)}
            placeholder="Search for rice, beans, oil..."
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 text-gray-800"
          />
          <button
            onClick={() => fetchListings(search)}
            className="bg-blue-600 text-white px-4 py-3 rounded-xl font-bold text-sm"
          >
            Search
          </button>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {['rice', 'beans', 'oil', 'flour', 'sugar'].map(p => (
            <button
              key={p}
              onClick={() => { setSearch(p); fetchListings(p) }}
              className="whitespace-nowrap text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1.5 font-medium capitalize"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : listings.length > 0 ? (
          listings.map(listing => (
            <div key={listing.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-gray-800 capitalize">{listing.product}</span>
                  <div className="text-blue-600 font-bold">₦{listing.pricePerUnit.toLocaleString()}/{listing.quantityUnit}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-600">{listing.wholesaler.shopName}</div>
                  <div className="text-xs text-gray-400">{listing.location}</div>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {listing.availableQuantity} {listing.quantityUnit}s available
              </div>
              {listing.notes && <div className="text-xs text-gray-400 mt-1">{listing.notes}</div>}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => contactWholesaler(listing.wholesaler.id, listing.product)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-bold"
                >
                  Contact Supplier
                </button>
                <a
                  href={`tel:${listing.wholesaler.phone}`}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold"
                >
                  Call
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🏪</div>
            <p className="text-gray-500 text-sm">No wholesalers found</p>
            <p className="text-gray-400 text-xs mt-1">Try searching for a specific product</p>
          </div>
        )}
      </div>
    </div>
  )
}
