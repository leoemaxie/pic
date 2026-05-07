import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <div className="text-6xl font-black tracking-tight">PIC</div>
          <div className="text-xl font-medium text-blue-100">Price Intelligence Companion</div>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 space-y-4">
          <p className="text-lg font-medium">
            Plan your restocking by seeing what the market is doing — not guessing.
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-2xl mb-1">🛒</div>
              <div className="font-semibold">Retailers</div>
              <div className="text-blue-100 text-xs">Log purchases, get market alerts</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-2xl mb-1">🏪</div>
              <div className="font-semibold">Wholesalers</div>
              <div className="text-blue-100 text-xs">List inventory, see demand signals</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/signup"
            className="block w-full bg-white text-blue-700 font-bold py-4 rounded-2xl text-lg hover:bg-blue-50 transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="block w-full border-2 border-white/50 text-white font-semibold py-4 rounded-2xl text-lg hover:bg-white/10 transition-colors"
          >
            Sign In
          </Link>
        </div>

        <p className="text-blue-200 text-xs">
          Works offline • Mobile-first • For Nigerian markets
        </p>
      </div>
    </main>
  )
}
