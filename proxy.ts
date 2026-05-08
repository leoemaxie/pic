import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const publicRoutes = ['/', '/login', '/signup', '/api/auth', '/dashboard/*']
  const isPublic = publicRoutes.some(route => pathname.startsWith(route))

  const token = request.cookies.get('pic-token')?.value

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
