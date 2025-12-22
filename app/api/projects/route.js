import { connectDB } from '@/lib/db'
import Project from '@/models/Project'
import { getAuthUser } from '@/lib/auth'
import { allowRoles } from '@/lib/rbac'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const user = getAuthUser()
  allowRoles(user, ['ADMIN'])
  await connectDB()
  const data = await req.json()
  const project = await Project.create({ ...data, status: 'ON_TRACK', healthScore: 100 })
  return NextResponse.json(project)
}

export async function GET() {
  const user = getAuthUser()
  await connectDB()

  if (user.role === 'ADMIN') return NextResponse.json(await Project.find())
  if (user.role === 'EMPLOYEE') return NextResponse.json(await Project.find({ employeeIds: user.userId }))
  if (user.role === 'CLIENT') return NextResponse.json(await Project.find({ clientId: user.userId }))
}
