import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";
import bcrypt from "bcryptjs"; 
export async function POST(req) {
  try {
    const currentUser = await getAuthUser(req);
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await connectDB();

    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    if (!["EMPLOYEE", "CLIENT"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const { password: _, ...userWithoutPass } = newUser.toObject();

    return NextResponse.json(userWithoutPass, { status: 201 });
  } catch (err) {
    console.error("Create user error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}