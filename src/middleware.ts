import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const timestamp = new Date().toLocaleTimeString();
  const session = request.cookies.get("auth_session");

  // console.info(`[${timestamp}] Middleware: Checking ${pathname}`);

  if (!session) {
    // console.warn(`[${timestamp}] Middleware: No session found. Redirecting to /`);
    
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};