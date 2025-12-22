import { connectDB } from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(req) {
  await connectDB()
  const { email, password } = await req.json()

  const user = await User.findOne({ email })
  if (!user) return NextResponse.json({ error: 'Invalid' }, { status: 401 })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return NextResponse.json({ error: 'Invalid' }, { status: 401 })

  const token = signToken(user)

  const res = NextResponse.json({ role: user.role })
  res.cookies.set('token', token, { httpOnly: true })
  return res
}
