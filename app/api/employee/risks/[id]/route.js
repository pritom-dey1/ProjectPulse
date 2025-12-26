import { connectDB } from '@/lib/db';
import Risk from '@/models/Risk';
import { recalculateHealth } from '@/lib/recalculateHealth';
import { getServerSession } from '@/lib/auth';

export async function PUT(request, { params }) {
  const session = await getServerSession(request);
  if (!session || session.user.role !== 'EMPLOYEE') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { status, mitigation } = body;

  await connectDB();

  const risk = await Risk.findOne({
    _id: params.id,
    createdBy: session.user.userId
  });

  if (!risk) {
    return Response.json({ error: 'Risk not found or access denied' }, { status: 404 });
  }

  const updateData = {};
  if (status) updateData.status = status;
  if (mitigation) updateData.mitigation = mitigation;

  const updatedRisk = await Risk.findByIdAndUpdate(params.id, updateData, { new: true });

  if (risk.projectId) {
    await recalculateHealth(risk.projectId);
  }

  return Response.json({ risk: updatedRisk });
}