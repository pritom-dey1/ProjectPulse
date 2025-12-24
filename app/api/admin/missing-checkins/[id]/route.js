import { connectDB } from "@/lib/db";
import MissingCheckIn from "@/models/MissingCheckIn";
import { getAuthUser } from "@/lib/auth";
import { allowRoles } from "@/lib/rbac";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const user = await getAuthUser();
  allowRoles(user, ["ADMIN"]);
  await connectDB();
  const { id } = params;

  const missingCheckIn = await MissingCheckIn.findByIdAndUpdate(id, { resolved: true }, { new: true });
  if (!missingCheckIn) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(missingCheckIn);
}