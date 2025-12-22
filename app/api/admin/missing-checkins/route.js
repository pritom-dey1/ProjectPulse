import { connectDB } from '@/lib/db'
import Project from '@/models/Project'
import EmployeeCheckIn from '@/models/EmployeeCheckIn'
import { getAuthUser } from '@/lib/auth'
import { allowRoles } from '@/lib/rbac'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  allowRoles(user, ['ADMIN'])

  await connectDB()

  const projects = await Project.find()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const missing = []

  for (const project of projects) {
    const lastCheckin = await EmployeeCheckIn.findOne({
      projectId: project._id
    }).sort({ createdAt: -1 })

    if (!lastCheckin || lastCheckin.createdAt < sevenDaysAgo) {
      missing.push(project)
    }
  }

  return NextResponse.json(missing)
}
