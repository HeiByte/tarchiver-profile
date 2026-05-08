import { NextResponse } from "next/server";

console.log("!!!!!!!!!! MIDDLEWARE FILE LOADED !!!!!!!!!!");

export function middleware(request) {
  const { pathname } = request.nextUrl;

  console.log("-----------------------------------------");
  console.log(">>> MIDDLEWARE CHECKING PATH:", pathname);

  // Ambil cookie auth_session
  const session = request.cookies.get("auth_session");

  console.log(">>> Session Status:", session ? "VALID (Found)" : "INVALID (Not Found)");

  // Jika tidak ada session cookie, redirect ke halaman login (root)
  if (!session) {
    console.log(">>> ACTION: Access Denied. Redirecting to /");
    console.log("-----------------------------------------");
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  console.log(">>> ACTION: Access Granted.");
  console.log("-----------------------------------------");
  // Jika ada session, lanjutkan request
  return NextResponse.next();
}

// Implementasikan config matcher untuk rute sensitif
export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*"
  ],
};