import { connectDB } from '@/lib/db'
import EmployeeCheckIn from '@/models/EmployeeCheckIn'
import ClientFeedback from '@/models/ClientFeedback'
import Risk from '@/models/Risk'
import { getAuthUser } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()

  const projectId = params.id

  const checkins = await EmployeeCheckIn.find({ projectId })
  const feedbacks = await ClientFeedback.find({ projectId })
  const risks = await Risk.find({ projectId })

  const timeline = [
    ...checkins.map(i => ({ type: 'CHECKIN', data: i })),
    ...feedbacks.map(f => ({ type: 'FEEDBACK', data: f })),
    ...risks.map(r => ({ type: 'RISK', data: r }))
  ].sort((a, b) => b.data.createdAt - a.data.createdAt)

  return NextResponse.json(timeline)
}
