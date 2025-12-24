// app/employee/projects/[projectId]/route.js
import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/db";
import Project from "@/models/Project";

export async function GET(request, { params }) {
  await connectDB();
  const user = await getAuthUser();
  
  if (!user || user.role !== "EMPLOYEE") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await Project.findOne({
    _id: params.projectId,
    employeeIds: user.userId,
  }).lean();

  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({
    project: {
      id: project._id,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      healthScore: project.healthScore,
    },
  });
}