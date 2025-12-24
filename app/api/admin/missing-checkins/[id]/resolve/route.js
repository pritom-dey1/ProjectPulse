// app/api/admin/missing-checkins/[id]/resolve/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import MissingCheckIn from '@/models/MissingCheckIn';
import { getAuthUser, allowRoles } from '@/lib/auth';

export async function PATCH(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    allowRoles(user, ['ADMIN']);

    await connectDB();

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const updated = await MissingCheckIn.findByIdAndUpdate(
      id,
      {
        resolved: true,
        resolvedAt: new Date(),
        resolvedBy: user.userId || user._id,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Missing check-in not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error('Resolve error:', err);
    return NextResponse.json(
      { error: 'Server error', details: err.message },
      { status: 500 }
    );
  }
}