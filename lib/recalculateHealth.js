import {connectDB} from '@/lib/db';
import Project from '@/models/Project';
import Risk from '@/models/Risk';
import EmployeeCheckIn from '@/models/EmployeeCheckIn';

export async function recalculateHealth(projectId) {
  await connectDB();

  const project = await Project.findById(projectId);
  if (!project) return;

  const openRisks = await Risk.countDocuments({
    projectId,
    status: { $ne: 'Resolved' }
  });

  const recentCheckIns = await EmployeeCheckIn.find({ projectId })
    .sort({ createdAt: -1 });

  let score = 100;

  score -= openRisks * 8;

  if (recentCheckIns.length > 0) {
    const avgConfidence = recentCheckIns.reduce((sum, ci) => sum + (ci.confidence || 3), 0) / recentCheckIns.length;
    score -= (5 - avgConfidence) * 7;
  } else {
    score -= 20;
  }

  const latestCompletion = recentCheckIns.length > 0 ? recentCheckIns[0].completion || 0 : 0;

  const totalDays = (new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24);
  const daysPassed = (new Date() - new Date(project.startDate)) / (1000 * 60 * 60 * 24);
  const expectedProgress = totalDays > 0 ? Math.min(100, (daysPassed / totalDays) * 100) : 0;
  const progressGap = Math.max(0, expectedProgress - latestCompletion);

  score -= progressGap * 0.7;

  if (new Date() > new Date(project.endDate) && project.status !== 'COMPLETED') {
    score -= 25;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let status = 'ON_TRACK';
  if (score < 60) status = 'CRITICAL';
  else if (score < 80) status = 'AT_RISK';

  await Project.findByIdAndUpdate(projectId, {
    healthScore: score,
    status
  });
}