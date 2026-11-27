import { type NextRequest, NextResponse } from "next/server";
import { AUTH_TOKEN_COOKIE_KEY } from "@/lib/cookies";

export function middleware(request: NextRequest) {
  if (!request.cookies.has(AUTH_TOKEN_COOKIE_KEY)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|auth(?:/|$)|favicon.ico|.*\\..*).*)",
  ],
};
