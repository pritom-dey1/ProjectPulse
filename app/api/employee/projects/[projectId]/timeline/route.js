// app/api/employee/projects/[projectId]/timeline/route.js
import connectDB from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import EmployeeCheckIn from '@/models/EmployeeCheckIn';
import Risk from '@/models/Risk';

export async function GET(request, { params }) {
  await connectDB();
  
  const user = await getAuthUser();
  if (!user || user.role !== "EMPLOYEE") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projectId = params.projectId;

  const checkins = await EmployeeCheckIn.find({
    projectId,
    employeeId: user.userId
  })
    .sort({ createdAt: -1 })
    .select('progressSummary blockers confidence completion createdAt')
    .lean();

  const risks = await Risk.find({
    projectId,
    createdBy: user.userId
  })
    .sort({ createdAt: -1 })
    .select('title severity mitigation status createdAt resolvedAt')
    .lean();

  const activities = [
    ...checkins.map(item => ({
      type: 'checkin',
      date: item.createdAt,
      title: 'Weekly Check-in',
      description: item.progressSummary || 'No summary',
      details: {
        blockers: item.blockers || null,
        confidence: item.confidence,
        completion: item.completion
      }
    })),
    ...risks.map(item => ({
      type: 'risk',
      date: item.resolvedAt || item.createdAt,
      title: item.status === 'Resolved' ? 'Risk Resolved' : 'Risk Reported',
      description: item.title,
      details: {
        severity: item.severity,
        mitigation: item.mitigation || null,
        status: item.status,
        resolvedAt: item.resolvedAt || null
      }
    }))
  ];

  activities.sort((a, b) => new Date(b.date) - new Date(a.date));

  return Response.json({ activities });
}