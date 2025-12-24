// app/api/admin/projects/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import { getAuthUser, allowRoles } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    allowRoles(user, ['ADMIN']);

    await connectDB();

    const body = await req.json();

    const {
      name,
      description,
      startDate,
      endDate,
      clientId,
      employeeIds = [],
    } = body;

    if (!name || !startDate || !endDate || !clientId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, startDate, endDate, clientId' },
        { status: 400 }
      );
    }

    const project = await Project.create({
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      clientId,
      employeeIds,
      healthScore: 100,
      status: 'ON_TRACK',
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error('Project creation error:', err);
    return NextResponse.json(
      { error: 'Server error', details: err.message },
      { status: 500 }
    );
  }
}