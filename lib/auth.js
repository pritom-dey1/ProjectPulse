import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET

export function signToken(user) {
  return jwt.sign(
    { userId: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function getAuthUser() {
  const token = cookies().get('token')?.value
  if (!token) return null
  return jwt.verify(token, JWT_SECRET)
}
