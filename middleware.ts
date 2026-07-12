import { NextResponse, type NextRequest } from "next/server";

export const config = {
  // Include bare `/plan` — `:path*` alone is easy to misread; be explicit.
  matcher: ["/plan", "/plan/:path*", "/api/plan-state"],
};

/**
 * Gate the personal planner behind `PLANNER_SECRET` (Vercel env). When the
 * secret is unset (local dev, or before it's configured) everything passes.
 * The unlock page sets the `plan-key` cookie via /api/plan-unlock.
 */
export function middleware(request: NextRequest) {
  const secret = process.env.PLANNER_SECRET;
  if (!secret) return NextResponse.next();

  if (request.cookies.get("plan-key")?.value === secret) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname === "/plan/unlock") return NextResponse.next();
  if (pathname.startsWith("/api/")) return new NextResponse(null, { status: 401 });

  return NextResponse.redirect(new URL("/plan/unlock", request.url));
}
