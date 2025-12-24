import { connectDB } from '@/lib/db'
import Risk from '@/models/Risk'
import { getAuthUser } from '@/lib/auth'
import { allowRoles } from '@/lib/rbac'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const user = getAuthUser()
  allowRoles(user, ['EMPLOYEE'])
  await connectDB()
  const data = await req.json()
  return NextResponse.json(await Risk.create({ ...data, createdBy: user.userId, status: 'OPEN' }))
}

export async function GET() {
  const user = await getAuthUser();  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();

  if (user.role === 'ADMIN') {
    return NextResponse.json(await Risk.find().lean());
  }

  if (user.role === 'EMPLOYEE') {
    return NextResponse.json(
      await Risk.find({ createdBy: user.userId }).sort({ createdAt: -1 }).lean()
    );
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}