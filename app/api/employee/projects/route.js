// app/employee/projects/route.js
import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import EmployeeCheckIn from "@/models/EmployeeCheckIn";
import Risk from "@/models/Risk";

export async function GET() {
  await connectDB();
  const user = await getAuthUser();
  
  if (!user || user.role !== "EMPLOYEE") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await Project.find({ employeeIds: user.userId })
    .select("name description startDate endDate status healthScore")
    .lean();

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setUTCHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);

  const result = await Promise.all(
    projects.map(async (project) => {
      const hasCheckinThisWeek = await EmployeeCheckIn.findOne({
        projectId: project._id,
        employeeId: user.userId,
        createdAt: { $gte: startOfWeek },
      });

      const openRisks = await Risk.countDocuments({
        projectId: project._id,
        createdBy: user.userId,
        status: { $ne: "Resolved" },
      });

      return {
        id: project._id,
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
        healthScore: project.healthScore,
        hasPendingCheckin: !hasCheckinThisWeek,
        openRisksCount: openRisks,
      };
    })
  );

  return Response.json({ projects: result });
}