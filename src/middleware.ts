import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/bookings(.*)",
  "/accept-invite(.*)",
]);
const isOnboardingRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/success(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (!auth().userId && !isPublicRoute(req)) {
    return auth().redirectToSignIn();
  }

  if (auth().userId && !auth().orgId && !isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
