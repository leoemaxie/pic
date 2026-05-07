import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { comparePassword, signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json()

    const snap = await db.collection('users').where('phone', '==', phone).limit(1).get()
    if (snap.empty) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const user = snap.docs[0].data()
    const valid = await comparePassword(password, user.password)
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken({ userId: user.id, role: user.role })
    const res = NextResponse.json({ ok: true, role: user.role })
    res.cookies.set('pic-token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
    return res
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
