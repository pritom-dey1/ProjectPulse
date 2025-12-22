import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Risk from "@/models/Risk";
import { getAuthUser } from "@/lib/auth";
import { allowRoles } from "@/lib/rbac";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getAuthUser();

  const forbidden = allowRoles(user, ["ADMIN"]);
  if (forbidden) return forbidden;

  await connectDB();

  const projects = await Project.find();
  const risks = await Risk.find({ status: "OPEN" });

  return NextResponse.json({ projects, risks });
}
