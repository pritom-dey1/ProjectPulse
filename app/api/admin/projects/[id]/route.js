// app/api/admin/projects/[id]/route.js
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Risk from "@/models/Risk";
import CheckIn from "@/models/CheckIn";
import { getAuthUser } from "@/lib/auth";
import { allowRoles } from "@/lib/rbac";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, context) {
  const params = await context.params; 
  const projectId = params.id;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  // Step 2: Auth check
  const user = await getAuthUser();
  allowRoles(user, ["ADMIN"]);

  // Step 3: DB connect & fetch
  await connectDB();
  const project = await Project.findById(projectId).lean();
  if (!project)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const risks = await Risk.find({ projectId }).lean();
  const checkIns = await CheckIn.find({ projectId }).lean();

  return NextResponse.json({ project, risks, checkIns });
}
