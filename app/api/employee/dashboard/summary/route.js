import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import Risk from '@/models/Risk';
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
  });

  const totalProjects = projects.length;

  const projectIds = projects.map(p => p._id);

  const openRisks = await Risk.countDocuments({
    projectId: { $in: projectIds },
    createdBy: session.user.userId,
    status: { $ne: 'Resolved' }
  });

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentCheckIns = await EmployeeCheckIn.countDocuments({
    employeeId: session.user.userId,
    createdAt: { $gte: oneWeekAgo }
  });

  const pendingCheckIns = totalProjects - recentCheckIns;

  return Response.json({
    totalProjects,
    openRisks,
    pendingCheckInsThisWeek: pendingCheckIns > 0 ? pendingCheckIns : 0,
    averageHealth: totalProjects > 0 
      ? Math.round(projects.reduce((sum, p) => sum + p.healthScore, 0) / totalProjects)
      : 0
  });
}