import { NextResponse } from "next/server";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export async function POST(request: Request) {
  const secret = process.env.PLANNER_SECRET;
  if (!secret) return NextResponse.json({ error: "not-configured" }, { status: 501 });

  const body = (await request.json().catch(() => null)) as { key?: unknown } | null;
  if (typeof body?.key !== "string" || body.key !== secret) {
    return NextResponse.json({ error: "wrong-key" }, { status: 401 });
  }

  const response = new NextResponse(null, { status: 204 });
  response.cookies.set("plan-key", secret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
  return response;
}
