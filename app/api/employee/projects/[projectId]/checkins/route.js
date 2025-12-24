// app/employee/projects/[projectId]/checkins/route.js
import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import EmployeeCheckIn from "@/models/EmployeeCheckIn";
import { recalculateHealth } from "@/lib/recalculateHealth";

export async function GET(request, { params }) {
  await connectDB();
  const user = await getAuthUser();
  
  if (!user || user.role !== "EMPLOYEE") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const checkins = await EmployeeCheckIn.find({
    projectId: params.projectId,
    employeeId: user.userId,
  })
    .sort({ createdAt: -1 })
    .lean();

  return Response.json({ checkins });
}

export async function POST(request, { params }) {
  await connectDB();
  const user = await getAuthUser();
  
  if (!user || user.role !== "EMPLOYEE") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await Project.findOne({
    _id: params.projectId,
    employeeIds: user.userId,
  });

  if (!project) {
    return Response.json({ error: "Access denied" }, { status: 404 });
  }

  const body = await request.json();
  const { progressSummary, blockers, confidence, completion } = body;

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setUTCHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);

  const existing = await EmployeeCheckin.findOne({
    projectId: params.projectId,
    employeeId: user.userId,
    createdAt: { $gte: startOfWeek },
  });

  if (existing) {
    return Response.json({ error: "Already submitted this week" }, { status: 400 });
  }

  const checkin = await EmployeeCheckin.create({
    projectId: params.projectId,
    employeeId: user.userId,
    progressSummary,
    blockers,
    confidence,
    completion,
  });

  await recalculateHealth(params.projectId);

  return Response.json({ checkin }, { status: 201 });
}