import { connectDB } from '@/lib/db';
import EmployeeCheckIn from '@/models/EmployeeCheckIn';
import Project from '@/models/Project';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { recalculateHealth } from '@/lib/recalculateHealth';
import { getServerSession } from '@/lib/auth';

export async function POST(request) {
  const session = await getServerSession(request);
  if (!session || session.user.role !== 'EMPLOYEE') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { projectId, progressSummary, blockers, confidence, completion, weekStart } = body;

  if (!projectId || !confidence || confidence < 1 || confidence > 5 || completion < 0 || completion > 100) {
    return Response.json({ error: 'Invalid data' }, { status: 400 });
  }

  await connectDB();

  const project = await Project.findOne({
    _id: projectId,
    employeeIds: session.user.userId
  });

  if (!project) {
    return Response.json({ error: 'Access denied' }, { status: 403 });
  }

  const checkIn = await EmployeeCheckIn.create({
    projectId,
    employeeId: session.user.userId,
    weekStart: weekStart || new Date(),
    progressSummary,
    blockers,
    confidence,
    completion
  });

  await recalculateHealth(projectId);

  const admins = await User.find({ role: 'ADMIN' });
  const notifications = admins.map(admin => ({
    userId: admin._id,
    message: `Check-in submitted for project: ${project.name}`,
    link: `/admin/missing-checkins`,
    type: 'checkin_submit',
    read: false
  }));
  await Notification.insertMany(notifications);

  return Response.json({ checkIn }, { status: 201 });
}

export async function GET(request) {
  const session = await getServerSession(request);
  if (!session || session.user.role !== 'EMPLOYEE') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  await connectDB();

  const query = { employeeId: session.user.userId };
  if (projectId) query.projectId = projectId;

  const checkIns = await EmployeeCheckIn.find(query)
    .sort({ createdAt: -1 })
    .limit(20);

  return Response.json({ checkIns });
}