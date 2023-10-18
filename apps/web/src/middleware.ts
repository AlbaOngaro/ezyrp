import { NextRequest, NextResponse, URLPattern } from "next/server";

import { surreal } from "./server/surreal";
import { ACCESS_TOKEN_ID } from "./lib/constants";

const AUTH_ROUTES: URLPattern[] = [
  new URLPattern({ pathname: "/login" }),
  new URLPattern({ pathname: "/register" }),
];

const PUBLIC_ROUTES: URLPattern[] = [
  new URLPattern({ pathname: "/booking/:eventtype(eventtype:.*)" }),
];

export async function middleware(req: NextRequest) {
  if (PUBLIC_ROUTES.some((route) => route.test(req.url))) {
    return;
  }

  const token = req.cookies.get(ACCESS_TOKEN_ID)?.value;

  if (!token) {
    if (!AUTH_ROUTES.some((route) => route.test(req.url))) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return;
  }

  try {
    await surreal.authenticate(token);
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
