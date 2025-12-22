import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

async function getUserFromToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload
  } catch {
    return null
  }
}

export default async function middleware(req) {
  const { pathname } = req.nextUrl

  const token = req.cookies.get("token")?.value
  const user = token ? await getUserFromToken(token) : null

  // =====================
  // PUBLIC ROUTES
  // =====================
  if (pathname === "/" || pathname.startsWith("/login")) {
    return NextResponse.next()
  }

  // =====================
  // NOT LOGGED IN
  // =====================
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // =====================
  // ROLE PROTECTION
  // =====================
  if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (pathname.startsWith("/employee") && user.role !== "EMPLOYEE") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (pathname.startsWith("/client") && user.role !== "CLIENT") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/employee/:path*",
    "/client/:path*",
    "/login",
    "/"
  ],
}
