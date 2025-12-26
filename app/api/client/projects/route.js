import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import { getServerSession } from '@/lib/auth';

export async function GET(request) {
  const session = await getServerSession(request);
  if (!session || session.user.role !== 'CLIENT') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const projects = await Project.find({
    clientId: session.user.userId
  })
    .select('name description startDate endDate healthScore status employeeIds')
    .sort({ healthScore: 1 });

  return Response.json({ projects });
}