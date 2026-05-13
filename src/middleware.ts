import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const timestamp = new Date().toLocaleTimeString();
  const session = request.cookies.get("auth_session");


  if (!session) {
    
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};