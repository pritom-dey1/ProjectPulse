import { connectDB } from '@/lib/db';
import ClientFeedback from '@/models/ClientFeedback';
import Project from '@/models/Project';
import { recalculateHealth } from '@/lib/recalculateHealth';
import { getServerSession } from '@/lib/auth';

export async function POST(request) {
  const session = await getServerSession(request);
  if (!session || session.user.role !== 'CLIENT') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { projectId, satisfaction, communication, comments, issueFlag, weekStart } = body;

  if (!projectId || satisfaction < 1 || satisfaction > 5 || communication < 1 || communication > 5) {
    return Response.json({ error: 'Invalid data' }, { status: 400 });
  }

  await connectDB();

  const project = await Project.findOne({
    _id: projectId,
    clientId: session.user.userId
  });

  if (!project) {
    return Response.json({ error: 'Access denied' }, { status: 403 });
  }

  const feedback = await ClientFeedback.create({
    projectId,
    clientId: session.user.userId,
    weekStart: weekStart || new Date(),
    satisfaction,
    communication,
    comments,
    issueFlag: issueFlag || false
  });

  await recalculateHealth(projectId);

  return Response.json({ feedback }, { status: 201 });
}

export async function GET(request) {
  const session = await getServerSession(request);
  if (!session || session.user.role !== 'CLIENT') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  await connectDB();

  const query = { clientId: session.user.userId };
  if (projectId) query.projectId = projectId;

  const feedbacks = await ClientFeedback.find(query)
    .sort({ createdAt: -1 })
    .limit(20);

  return Response.json({ feedbacks });
}