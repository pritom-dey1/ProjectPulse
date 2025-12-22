import { connectDB } from '@/lib/db'
import EmployeeCheckIn from '@/models/EmployeeCheckIn'
import User from '@/models/User'
import Project from '@/models/Project'
import { getAuthUser } from '@/lib/auth'
import { allowRoles } from '@/lib/rbac'
import { recalculateHealth } from '@/lib/recalculateHealth'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const user = await getAuthUser()
    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    allowRoles(user, ['EMPLOYEE'])

    await connectDB()

    const data = await req.json()
    const { projectId, progressSummary, confidenceLevel } = data

    if (!projectId || !progressSummary || confidenceLevel == null) {
      return NextResponse.json(
        { error: 'Project ID, progress summary, and confidence level are required' },
        { status: 400 }
      )
    }

    // Start of week (7 days ago)
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - 7)

    // Check if weekly check-in already exists
    const exists = await EmployeeCheckIn.findOne({
      employeeId: user.userId,
      projectId,
      createdAt: { $gte: weekStart }
    })

    if (exists) {
      return NextResponse.json(
        { error: 'Weekly check-in already submitted' },
        { status: 400 }
      )
    }

    // Create new check-in
    const checkin = await EmployeeCheckIn.create({
      projectId,
      progressSummary,
      confidenceLevel,
      employeeId: user.userId,
      createdAt: new Date()
    })

    await recalculateHealth(projectId)

    return NextResponse.json(checkin, { status: 201 })

  } catch (err) {
    console.error('Error creating check-in:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Only ADMIN can fetch missing check-ins
    allowRoles(user, ['ADMIN'])

    await connectDB()

    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - 7)

    // Fetch all employees and projects
    const employees = await User.find({ role: 'EMPLOYEE' }).lean()
    const projects = await Project.find().lean()

    // Fetch all check-ins for last week
    const recentCheckIns = await EmployeeCheckIn.find({
      createdAt: { $gte: weekStart }
    }).lean()

    // Build missing check-ins
    const missing = []

    for (const emp of employees) {
      for (const proj of projects) {
        const exists = recentCheckIns.find(
          ci =>
            ci.employeeId.toString() === emp._id.toString() &&
            ci.projectId.toString() === proj._id.toString()
        )
        if (!exists) {
          missing.push({
            employeeId: emp._id,
            employeeName: emp.name,
            projectId: proj._id,
            projectName: proj.name,
            weekStart,
            resolved: false
          })
        }
      }
    }

    return NextResponse.json(missing)

  } catch (err) {
    console.error('Error fetching missing check-ins:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
