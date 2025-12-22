import { connectDB } from '@/lib/db'
import ClientFeedback from '@/models/ClientFeedback'
import { getAuthUser } from '@/lib/auth'
import { allowRoles } from '@/lib/rbac'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const user = getAuthUser()
  allowRoles(user, ['CLIENT'])
  await connectDB()
  const data = await req.json()
  const feedback = await ClientFeedback.create({ ...data, clientId: user.userId })
  return NextResponse.json(feedback)
}
