import { connectDB } from '@/lib/db'
import Risk from '@/models/Risk'
import { getAuthUser } from '@/lib/auth'
import { allowRoles } from '@/lib/rbac'
import { recalculateHealth } from '@/lib/recalculateHealth'
import { NextResponse } from 'next/server'

export async function PATCH(req, { params }) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  allowRoles(user, ['ADMIN'])

  await connectDB()

  const risk = await Risk.findById(params.id)
  risk.status = 'RESOLVED'
  await risk.save()

  await recalculateHealth(risk.projectId)

  return NextResponse.json(risk)
}
