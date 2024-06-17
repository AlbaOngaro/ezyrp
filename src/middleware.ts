import { NextRequest, NextResponse, URLPattern } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { jwtDecode } from "jwt-decode";

const AUTH_ROUTES: URLPattern[] = [new URLPattern({ pathname: "/login" })];

const PUBLIC_ROUTES: URLPattern[] = [
  new URLPattern({ pathname: "/booking/:eventtype(eventtype:.*)" }),
];

type ClerkSession = {
  azp: string;
  exp: number;
  iat: number;
  iss: string;
  nbf: number;
  sid: string;
  sub: string;
};

export async function middleware(req: NextRequest) {
  if (PUBLIC_ROUTES.some((route) => route.test(req.url))) {
    return;
  }

  const __session = req.cookies.get("__session")?.value;

  if (!__session) {
    if (!AUTH_ROUTES.some((route) => route.test(req.url))) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return;
  }

  try {
    const { sid } = jwtDecode<ClerkSession>(__session);
    await clerkClient.sessions.getToken(sid, "convex");

    if (AUTH_ROUTES.some((route) => route.test(req.url))) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch (error: unknown) {
    if (!AUTH_ROUTES.some((route) => route.test(req.url))) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
    "/!service-worker.js",
  ],
};
