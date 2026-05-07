import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect } from 'next/navigation'
import WholesalersDirectoryClient from './WholesalersDirectoryClient'

export default async function WholesalersDirectory() {
  const cookieStore = await cookies()
  const token = cookieStore.get('pic-token')?.value
  if (!token) redirect('/login')

  const payload = verifyToken(token)
  if (!payload) redirect('/login')

  return <WholesalersDirectoryClient userId={payload.userId} />
}
