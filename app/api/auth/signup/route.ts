import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, signToken } from '@/lib/auth'
import { generateBriefingForUser } from '@/lib/market'

export async function POST(req: NextRequest) {
  try {
    const { phone, password, role, shopName, location, shopType } = await req.json()

    if (!phone || !password || !role || !shopName || !location) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { phone } })
    if (existing) return NextResponse.json({ error: 'Phone already registered' }, { status: 400 })

    const hashedPw = await hashPassword(password)
    const user = await prisma.user.create({
      data: { phone, password: hashedPw, role, shopName, location, shopType: shopType || 'provision' },
    })

    if (role === 'retailer') {
      const briefingContent = await generateBriefingForUser(user.id, location, [])
      await prisma.briefing.create({
        data: { userId: user.id, content: JSON.stringify(briefingContent) },
      })
    }

    const token = signToken({ userId: user.id, role })
    const res = NextResponse.json({ ok: true, role }, { status: 201 })
    res.cookies.set('pic-token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
