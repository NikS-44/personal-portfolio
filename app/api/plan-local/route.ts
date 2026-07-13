import { NextResponse } from "next/server";
import { PLAN_LOCAL_COOKIE } from "../../plan/_lib/localMode";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** Enable or disable local-only board access (no planner key, no server sync). */
export async function POST() {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(PLAN_LOCAL_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
  return response;
}

export async function DELETE() {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(PLAN_LOCAL_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
