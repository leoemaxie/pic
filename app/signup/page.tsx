'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { getClientAuth } from '@/lib/firebase-client'

const SHOP_TYPES = ['provision', 'tailoring', 'pharmacy', 'foodstuffs', 'stationery', 'other']
const NIGERIA_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'
]
const WHOLESALE_MARKETS = [
  'Ile-Epo Market, Lagos', 'Trade Fair Complex, Lagos', 'Bodija Market, Ibadan',
  'Onitsha Main Market, Anambra', 'Ariaria Market, Aba', 'Wuse Market, Abuja',
  'Sabon Gari Market, Kano', 'Balogun Market, Lagos', 'Computer Village, Lagos',
  'Mile 12 Market, Lagos', 'Other'
]

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    phone: '',
    password: '',
    role: '',
    shopName: '',
    location: '',
    shopType: 'provision',
    market: '',
  })

  const updateForm = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  async function handleSubmit() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: form.phone,
          password: form.password,
          role: form.role,
          shopName: form.shopName,
          location: form.role === 'wholesaler' ? form.market : form.location,
          shopType: form.shopType,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Signup failed')

      // Sign into Firebase Auth so client SDK has a session for offline persistence
      try {
        const auth = getClientAuth()
        await createUserWithEmailAndPassword(auth, `${form.phone}@pic.app`, form.password)
      } catch {
        // Firebase Auth error is non-fatal; JWT cookie auth still works
      }

      router.push(form.role === 'retailer' ? '/dashboard/retailer' : '/dashboard/wholesaler')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <div className="text-2xl font-black">PIC</div>
          <div className="text-blue-100 text-sm">Create your account</div>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-white' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 space-y-4">
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold text-gray-800">Who are you?</h2>
              <p className="text-gray-500 text-sm">Choose your role in the market</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => updateForm('role', 'retailer')}
                  className={`p-4 rounded-2xl border-2 text-center transition-all ${
                    form.role === 'retailer' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <div className="text-3xl mb-2">🛒</div>
                  <div className="font-bold">Retailer</div>
                  <div className="text-xs mt-1">Shop owner / trader</div>
                </button>
                <button
                  onClick={() => updateForm('role', 'wholesaler')}
                  className={`p-4 rounded-2xl border-2 text-center transition-all ${
                    form.role === 'wholesaler' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <div className="text-3xl mb-2">🏪</div>
                  <div className="font-bold">Wholesaler</div>
                  <div className="text-xs mt-1">Market distributor</div>
                </button>
              </div>
              <button
                disabled={!form.role}
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl mt-4 disabled:opacity-50 hover:bg-blue-700 transition-colors"
              >
                Continue →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold text-gray-800">Contact Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={form.phone}
                    onChange={e => updateForm('phone', e.target.value)}
                    className="mt-1 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 text-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={e => updateForm('password', e.target.value)}
                    className="mt-1 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 text-gray-800"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl">
                  Back
                </button>
                <button
                  disabled={!form.phone || !form.password}
                  onClick={() => setStep(3)}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-2xl disabled:opacity-50 hover:bg-blue-700 transition-colors"
                >
                  Continue →
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-bold text-gray-800">Your Shop</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {form.role === 'wholesaler' ? 'Business Name' : 'Shop Name'}
                  </label>
                  <input
                    type="text"
                    placeholder={form.role === 'wholesaler' ? 'Alhaji Rice Depot' : 'Mama Ngozi Store'}
                    value={form.shopName}
                    onChange={e => updateForm('shopName', e.target.value)}
                    className="mt-1 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 text-gray-800"
                  />
                </div>
                {form.role === 'retailer' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700">State</label>
                      <select
                        value={form.location}
                        onChange={e => updateForm('location', e.target.value)}
                        className="mt-1 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 text-gray-800"
                      >
                        <option value="">Select your state</option>
                        {NIGERIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Shop Type</label>
                      <select
                        value={form.shopType}
                        onChange={e => updateForm('shopType', e.target.value)}
                        className="mt-1 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 text-gray-800"
                      >
                        {SHOP_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                      </select>
                    </div>
                  </>
                )}
                {form.role === 'wholesaler' && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Market Location</label>
                    <select
                      value={form.market}
                      onChange={e => updateForm('market', e.target.value)}
                      className="mt-1 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 text-gray-800"
                    >
                      <option value="">Select your market</option>
                      {WHOLESALE_MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                )}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep(2)} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl">
                  Back
                </button>
                <button
                  disabled={loading || !form.shopName || (form.role === 'retailer' ? !form.location : !form.market)}
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-2xl disabled:opacity-50 hover:bg-blue-700 transition-colors"
                >
                  {loading ? 'Setting up...' : 'Join PIC ✓'}
                </button>
              </div>
            </>
          )}

          <p className="text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
