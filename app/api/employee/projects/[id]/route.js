// app/api/employee/projects/[id]/route.js

import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import User from '@/models/User';           // ← এই লাইনটা যোগ করো (অন্যান্য populate-এর জন্যও)
import { getServerSession } from '@/lib/auth';

export async function GET(request, context) {
  const session = await getServerSession(request);
  if (!session || session.user.role !== 'EMPLOYEE') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { params } = context;
  const { id } = await params;

  await connectDB();

  const project = await Project.findOne({
    _id: id,
    employeeIds: session.user.userId
  })
    .populate('clientId', 'name email')
    .populate('employeeIds', 'name email');

  if (!project) {
    return Response.json({ error: 'Project not found or access denied' }, { status: 404 });
  }

  return Response.json({ project });
}