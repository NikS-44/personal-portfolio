import { NextResponse } from "next/server";
import { getKv } from "@/app/ecard/_lib/shortLinkKv";
import { sanitizePlanState } from "@/app/plan/_lib/storage";

const KV_KEY = "plan:board";

type StoredSnapshot = {
  state: unknown;
  updatedAt: string;
};

/** Read a cookie value the same way middleware does (URL-decoded). */
function cookieValue(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq) !== name) continue;
    try {
      return decodeURIComponent(part.slice(eq + 1));
    } catch {
      return part.slice(eq + 1);
    }
  }
  return undefined;
}

/** Middleware already gates this route by cookie; re-check here as defense in depth. */
function authorized(request: Request): boolean {
  const secret = process.env.PLANNER_SECRET;
  if (!secret) return false;
  return cookieValue(request, "plan-key") === secret;
}

export async function GET(request: Request) {
  if (!authorized(request)) return new NextResponse(null, { status: 401 });
  const kv = getKv();
  if (!kv) return NextResponse.json({ error: "kv-not-configured" }, { status: 501 });

  const snapshot = await kv.get<StoredSnapshot>(KV_KEY);
  if (!snapshot) return new NextResponse(null, { status: 204 });
  return NextResponse.json(snapshot);
}

export async function PUT(request: Request) {
  if (!authorized(request)) return new NextResponse(null, { status: 401 });
  const kv = getKv();
  if (!kv) return NextResponse.json({ error: "kv-not-configured" }, { status: 501 });

  const body = (await request.json().catch(() => null)) as Partial<StoredSnapshot> | null;
  const state = sanitizePlanState(body?.state);
  if (!state || typeof body?.updatedAt !== "string") {
    return NextResponse.json({ error: "bad-snapshot" }, { status: 400 });
  }

  await kv.set(KV_KEY, { state, updatedAt: body.updatedAt } satisfies StoredSnapshot);
  return new NextResponse(null, { status: 204 });
}
