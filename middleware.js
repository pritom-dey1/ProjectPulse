import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function getUserFromToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

export default async function middleware(req) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;
  const user = token ? await getUserFromToken(token) : null;

  // =====================
  // NOT LOGGED IN
  // =====================
  if (!user) {
    if (pathname.startsWith("/login")) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/login", req.url));
  }

  // =====================
  // LOGGED IN
  // =====================
  if (pathname === "/") {
    if (user.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (user.role === "EMPLOYEE") {
      return NextResponse.redirect(new URL("/employee", req.url));
    }
    if (user.role === "CLIENT") {
      return NextResponse.redirect(new URL("/client", req.url));
    }
  }

  if (pathname.startsWith("/login")) {
    if (user.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (user.role === "EMPLOYEE") {
      return NextResponse.redirect(new URL("/employee", req.url));
    }
    if (user.role === "CLIENT") {
      return NextResponse.redirect(new URL("/client", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/admin/:path*",
    "/employee/:path*",
    "/client/:path*",
  ],
};
