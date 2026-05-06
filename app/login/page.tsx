'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ phone: '', password: '' })

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      router.push(data.role === 'retailer' ? '/dashboard/retailer' : '/dashboard/wholesaler')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <div className="text-2xl font-black">PIC</div>
          <div className="text-blue-100 text-sm">Welcome back</div>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Sign In</h2>

          <div>
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              placeholder="+234 800 000 0000"
              value={form.phone}
              onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
              className="mt-1 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
              className="mt-1 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 text-gray-800"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-gray-500 text-sm">
            New to PIC?{' '}
            <Link href="/signup" className="text-blue-600 font-semibold">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
