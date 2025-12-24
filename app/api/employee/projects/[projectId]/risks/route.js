// app/employee/projects/[projectId]/risks/route.js
import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import Risk from "@/models/Risk";
import { recalculateHealth } from "@/lib/recalculateHealth";

export async function GET(request, { params }) {
  await connectDB();
  const user = await getAuthUser();
  
  if (!user || user.role !== "EMPLOYEE") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const risks = await Risk.find({
    projectId: params.projectId,
    createdBy: user.userId,
  })
    .sort({ createdAt: -1 })
    .lean();

  return Response.json({ risks });
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
  const { title, severity, mitigation } = body;

  const risk = await Risk.create({
    projectId: params.projectId,
    createdBy: user.userId,
    title,
    severity,
    mitigation,
    status: "Open",
  });

  await recalculateHealth(params.projectId);

  return Response.json({ risk }, { status: 201 });
}