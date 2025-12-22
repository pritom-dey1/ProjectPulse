import { connectDB } from '@/lib/db'
import Risk from '@/models/Risk'
import { getAuthUser } from '@/lib/auth'
import { allowRoles } from '@/lib/rbac'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const user = getAuthUser()
  allowRoles(user, ['EMPLOYEE'])
  await connectDB()
  const data = await req.json()
  return NextResponse.json(await Risk.create({ ...data, createdBy: user.userId, status: 'OPEN' }))
}

export async function GET() {
  const user = getAuthUser()
  allowRoles(user, ['ADMIN'])
  await connectDB()
  return NextResponse.json(await Risk.find())
}
