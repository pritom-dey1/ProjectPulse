import { connectDB } from '@/lib/db';
import Notification from '@/models/Notification';
import { getServerSession } from '@/lib/auth';

export async function GET(request) {
  const session = await getServerSession(request);
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const notifications = await Notification.find({
    userId: session.user.userId
  }).sort({ createdAt: -1 }).limit(20);

  const unreadCount = await Notification.countDocuments({
    userId: session.user.userId,
    read: false
  });

  return Response.json({ notifications, unreadCount });
}

export async function PATCH(request) {
  const session = await getServerSession(request);
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id } = body;

  await connectDB();

  await Notification.findOneAndUpdate({
    _id: id,
    userId: session.user.userId
  }, { read: true });

  return Response.json({ success: true });
}