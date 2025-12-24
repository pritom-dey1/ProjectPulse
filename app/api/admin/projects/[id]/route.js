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

export async function PATCH(req, context) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // allowRoles টেম্পোরারি রিমুভ / সিম্পল চেক
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();

    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const body = await req.json();

    const updated = await Project.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // recalculateHealth যদি থাকে তাহলে কল করো
    // await recalculateHealth(id);

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH project error:", err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}