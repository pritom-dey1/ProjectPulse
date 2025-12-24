import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import EmployeeCheckIn from "@/models/EmployeeCheckIn";
import ClientFeedback from "@/models/ClientFeedback";
import Risk from "@/models/Risk";
import { getAuthUser } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = params;

    // Fetch all relevant activities for timeline
    const checkins = await EmployeeCheckIn.find({ projectId: id })
      .sort({ createdAt: -1 })
      .lean();

    const feedbacks = await ClientFeedback.find({ projectId: id })
      .sort({ createdAt: -1 })
      .lean();

    const risks = await Risk.find({ projectId: id })
      .sort({ createdAt: -1 })
      .lean();

    // Combine and format for timeline
    const timeline = [
      ...checkins.map(ci => ({
        type: "CHECKIN",
        data: ci,
        createdAt: ci.createdAt
      })),
      ...feedbacks.map(fb => ({
        type: "FEEDBACK",
        data: fb,
        createdAt: fb.createdAt
      })),
      ...risks.map(r => ({
        type: "RISK",
        data: r,
        createdAt: r.createdAt
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json(timeline);
  } catch (error) {
    console.error("Timeline fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}