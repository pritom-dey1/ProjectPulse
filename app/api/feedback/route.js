import { connectDB } from '@/lib/db'
import ClientFeedback from '@/models/ClientFeedback'
import { getAuthUser } from '@/lib/auth'
import { allowRoles } from '@/lib/rbac'
import { recalculateHealth } from '@/lib/recalculateHealth'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  allowRoles(user, ['CLIENT'])

  await connectDB()
  const data = await req.json()

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - 7)

  const exists = await ClientFeedback.findOne({
    clientId: user.userId,
    projectId: data.projectId,
    createdAt: { $gte: weekStart }
  })

  if (exists) {
    return NextResponse.json(
      { error: 'Weekly feedback already submitted' },
      { status: 400 }
    )
  }

  const feedback = await ClientFeedback.create({
    ...data,
    clientId: user.userId
  })

  await recalculateHealth(data.projectId)

  return NextResponse.json(feedback)
}
