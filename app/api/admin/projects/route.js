import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import Notification from '@/models/Notification';
import User from '@/models/User';
import { getAuthUser, allowRoles } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    allowRoles(user, ['ADMIN']);

    await connectDB();

    const body = await req.json();
    const { name, description, startDate, endDate, clientId, employeeIds = [] } = body;

    if (!name || !startDate || !endDate || !clientId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, startDate, endDate, clientId' },
        { status: 400 }
      );
    }

    const project = await Project.create({
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      clientId,
      employeeIds,
      healthScore: 100,
      status: 'ON_TRACK',
    });

    if (employeeIds.length > 0) {
      const employees = await User.find({ _id: { $in: employeeIds }, role: 'EMPLOYEE' });

      const notifications = employees.map(emp => ({
        userId: emp._id,
        message: `You have been assigned to a new project: ${name}`,
        link: `/employee/projects/${project._id}`,
        type: 'project_assign',
        read: false
      }));

      await Notification.insertMany(notifications);
    }

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error('Project creation error:', err);
    return NextResponse.json(
      { error: 'Server error', details: err.message },
      { status: 500 }
    );
  }
}