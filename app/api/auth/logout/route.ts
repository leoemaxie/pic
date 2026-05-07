import { NextResponse } from 'next/server'

export async function GET() {
  const res = NextResponse.redirect(new URL('/', process.env.NEXTAUTH_URL || 'http://localhost:3000'))
  res.cookies.delete('pic-token')
  return res
}
