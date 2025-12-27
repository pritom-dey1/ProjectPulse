import { connectDB } from '@/lib/db';
import Risk from '@/models/Risk';
import Notification from '@/models/Notification';
import { recalculateHealth } from '@/lib/recalculateHealth';
import { getServerSession } from '@/lib/auth';

export async function PUT(request, context) {
  const session = await getServerSession(request);
  if (!session || session.user.role !== 'EMPLOYEE') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { status, mitigation } = body;

  const { params } = context;
  const { id } = await params;

  await connectDB();

  const risk = await Risk.findOne({
    _id: id,
    createdBy: session.user.userId
  });

  if (!risk) {
    return Response.json({ error: 'Risk not found or access denied' }, { status: 404 });
  }

  const updateData = {};
  if (status) updateData.status = status;
  if (mitigation) updateData.mitigation = mitigation;

  const updatedRisk = await Risk.findByIdAndUpdate(id, updateData, { new: true });

  if (risk.projectId) {
    await recalculateHealth(risk.projectId);
  }

  if (status === 'Resolved') {
    const notifications = [{
      userId: session.user.userId,
      message: `Your reported risk "${risk.title}" has been resolved`,
      link: `/employee/risks/${id}`,
      type: 'risk_resolved',
      read: false
    }];
    await Notification.insertMany(notifications);
  }

  return Response.json({ risk: updatedRisk });
}