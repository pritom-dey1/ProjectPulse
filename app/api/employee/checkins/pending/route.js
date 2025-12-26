import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import EmployeeCheckIn from '@/models/EmployeeCheckIn';
import { getServerSession } from '@/lib/auth';

export async function GET(request) {
  const session = await getServerSession(request);
  if (!session || session.user.role !== 'EMPLOYEE') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const projects = await Project.find({
    employeeIds: session.user.userId
  }).select('_id');

  const projectIds = projects.map(p => p._id);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentCheckIns = await EmployeeCheckIn.find({
    projectId: { $in: projectIds },
    employeeId: session.user.userId,
    createdAt: { $gte: oneWeekAgo }
  }).select('projectId');

  const checkedProjectIds = new Set(recentCheckIns.map(ci => ci.projectId.toString()));

  const pending = projectIds
    .filter(id => !checkedProjectIds.has(id.toString()))
    .map(id => ({ projectId: id }));

  return Response.json({ pending });
}