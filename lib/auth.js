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

export async function getAuthUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export function allowRoles(user, allowedRoles) {
  if (!user) {
    throw new Error('No authenticated user')
  }

  if (!user.role) {
    throw new Error('User role not found')
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions')
  }
}