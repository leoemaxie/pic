import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { hashPassword, signToken } from '@/lib/auth'
import { generateBriefingForUser } from '@/lib/market'
import admin from 'firebase-admin'

export async function POST(req: NextRequest) {
  try {
    const { phone, password, role, shopName, location, shopType } = await req.json()

    if (!phone || !password || !role || !shopName || !location) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const existing = await db.collection('users').where('phone', '==', phone).limit(1).get()
    if (!existing.empty) return NextResponse.json({ error: 'Phone already registered' }, { status: 400 })

    const hashedPw = await hashPassword(password)
    const userRef = db.collection('users').doc()
    const userData = {
      id: userRef.id,
      phone,
      password: hashedPw,
      role,
      shopName,
      location,
      shopType: shopType || 'provision',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastSyncAt: admin.firestore.FieldValue.serverTimestamp(),
    }
    await userRef.set(userData)

    if (role === 'retailer') {
      const briefingContent = await generateBriefingForUser(userRef.id, location, [])
      await db.collection('briefings').add({
        userId: userRef.id,
        content: JSON.stringify(briefingContent),
        delivered: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })
    }

    const token = signToken({ userId: userRef.id, role })
    const res = NextResponse.json({ ok: true, role }, { status: 201 })
    res.cookies.set('pic-token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
