import { connectDB } from '@/lib/db';
import Risk from '@/models/Risk';
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
  const { projectId, title, severity, mitigation } = body;

  if (!projectId || !title || !severity) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await connectDB();

  const project = await Project.findOne({
    _id: projectId,
    employeeIds: session.user.userId
  });

  if (!project) {
    return Response.json({ error: 'Access denied' }, { status: 403 });
  }

  const risk = await Risk.create({
    projectId,
    createdBy: session.user.userId,
    title,
    severity,
    mitigation,
    status: 'Open'
  });

  await recalculateHealth(projectId);

  const admins = await User.find({ role: 'ADMIN' });
  const notifications = admins.map(admin => ({
    userId: admin._id,
    message: `New risk reported: ${title} in project ${project.name}`,
    link: `/admin/projects/${projectId}`,
    type: 'new_risk',
    read: false
  }));
  await Notification.insertMany(notifications);

  return Response.json({ risk }, { status: 201 });
}

export async function GET(request) {
  const session = await getServerSession(request);
  if (!session || session.user.role !== 'EMPLOYEE') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  await connectDB();

  const query = { createdBy: session.user.userId };
  if (projectId) query.projectId = projectId;

  const risks = await Risk.find(query)
    .sort({ createdAt: -1 })
    .limit(20);

  return Response.json({ risks });
}