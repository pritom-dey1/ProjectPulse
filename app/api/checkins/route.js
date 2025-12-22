import { connectDB } from '@/lib/db'
import EmployeeCheckIn from '@/models/EmployeeCheckIn'
import { getAuthUser } from '@/lib/auth'
import { allowRoles } from '@/lib/rbac'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const user = getAuthUser()
  allowRoles(user, ['EMPLOYEE'])
  await connectDB()
  const data = await req.json()
  const checkin = await EmployeeCheckIn.create({ ...data, employeeId: user.userId })
  return NextResponse.json(checkin)
}
