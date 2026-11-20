import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function safeNextPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/events";
  }
  return path;
}

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session");
  if (session?.value) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set(
    "next",
    safeNextPath(`${request.nextUrl.pathname}${request.nextUrl.search}`),
  );

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/bookings/:path*"],
};
