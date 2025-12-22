import { NextResponse } from "next/server";

export function allowRoles(user, roles) {
  if (!user || !roles.includes(user.role)) {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 }
    );
  }
  return null;
}
