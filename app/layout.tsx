import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PIC - Price Intelligence Companion',
  description: 'Market intelligence for retailers and wholesalers in Nigeria',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
