import { connectDB } from '@/lib/db'
import Risk from '@/models/Risk'
import { getAuthUser } from '@/lib/auth'
import { allowRoles } from '@/lib/rbac'
import { recalculateHealth } from '@/lib/recalculateHealth'
import { NextResponse } from 'next/server'

export async function PATCH(req, context) {  // context নামটা রাখো
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    allowRoles(user, ['ADMIN']);

    await connectDB();

    // এখানে context.params await করো
    const params = await context.params;  // ← এটা অবশ্যই await করো
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Risk ID is required' }, { status: 400 });
    }

    const risk = await Risk.findById(id);

    if (!risk) {
      return NextResponse.json({ error: 'Risk not found' }, { status: 404 });
    }

    risk.status = 'RESOLVED';
    await risk.save();

    if (risk.projectId) {
      await recalculateHealth(risk.projectId);
    }

    return NextResponse.json(risk);
  } catch (err) {
    console.error('Risk resolve error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}