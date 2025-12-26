import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import ClientFeedback from '@/models/ClientFeedback';
import { getServerSession } from '@/lib/auth';

export async function GET(request) {
  const session = await getServerSession(request);
  if (!session || session.user.role !== 'CLIENT') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const projects = await Project.find({
    clientId: session.user.userId
  });

  const totalProjects = projects.length;

  const projectIds = projects.map(p => p._id);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentFeedbacks = await ClientFeedback.countDocuments({
    clientId: session.user.userId,
    createdAt: { $gte: oneWeekAgo }
  });

  const pendingFeedback = totalProjects - recentFeedbacks;

  const avgSatisfaction = await ClientFeedback.aggregate([
    { $match: { clientId: session.user.userId } },
    { $group: { _id: null, avg: { $avg: "$satisfaction" } } }
  ]);

  return Response.json({
    totalProjects,
    pendingFeedbackThisWeek: pendingFeedback > 0 ? pendingFeedback : 0,
    averageSatisfaction: avgSatisfaction.length > 0 ? Math.round(avgSatisfaction[0].avg * 10) / 10 : 0
  });
}