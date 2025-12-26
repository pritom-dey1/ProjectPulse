import { connectDB } from '@/lib/db';
import ClientFeedback from '@/models/ClientFeedback';
import Project from '@/models/Project';
import User from '@/models/User';
import { getServerSession } from '@/lib/auth';

export async function GET(request) {
  const session = await getServerSession(request);
  if (!session || session.user.role !== 'ADMIN') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const flagged = await ClientFeedback.find({
    issueFlag: true
  })
    .populate('projectId', 'name')
    .populate('clientId', 'name')
    .sort({ createdAt: -1 })
    .limit(20);

  return Response.json(flagged);
}