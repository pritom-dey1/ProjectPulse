import { connectDB } from '@/lib/db'
import EmployeeCheckIn from '@/models/EmployeeCheckIn'
import { getAuthUser } from '@/lib/auth'
import { allowRoles } from '@/lib/rbac'
import { recalculateHealth } from '@/lib/recalculateHealth'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  allowRoles(user, ['EMPLOYEE'])

  await connectDB()
  const data = await req.json()

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - 7)

  const exists = await EmployeeCheckIn.findOne({
    employeeId: user.userId,
    projectId: data.projectId,
    createdAt: { $gte: weekStart }
  })

  if (exists) {
    return NextResponse.json(
      { error: 'Weekly check-in already submitted' },
      { status: 400 }
    )
  }

  const checkin = await EmployeeCheckIn.create({
    ...data,
    employeeId: user.userId
  })

  await recalculateHealth(data.projectId)

  return NextResponse.json(checkin)
}
