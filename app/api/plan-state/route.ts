import { NextResponse } from "next/server";
import { getKv } from "@/app/ecard/_lib/shortLinkKv";
import { sanitizePlanState } from "@/app/plan/_lib/planState";
import { mergePlanStates, planRevision } from "@/app/plan/_lib/taskMerge";
import type { PlanState } from "@/app/plan/_lib/types";

const KV_KEY = "plan:board";

type StoredSnapshot = {
  state: PlanState;
  updatedAt: string;
};

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

function authorized(request: Request): boolean {
  const secret = process.env.PLANNER_SECRET;
  if (!secret) return false;
  return cookieValue(request, "plan-key") === secret;
}

function readStored(raw: unknown): StoredSnapshot | null {
  if (typeof raw !== "object" || raw === null) return null;
  const parsed = raw as Partial<StoredSnapshot>;
  const state = sanitizePlanState(parsed.state);
  if (!state) return null;
  return {
    state,
    updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : planRevision(state),
  };
}

export async function GET(request: Request) {
  if (!authorized(request)) return new NextResponse(null, { status: 401 });
  const kv = getKv();
  if (!kv) return NextResponse.json({ error: "kv-not-configured" }, { status: 501 });

  const snapshot = readStored(await kv.get(KV_KEY));
  if (!snapshot) return new NextResponse(null, { status: 204 });
  return NextResponse.json(snapshot);
}

export async function PUT(request: Request) {
  if (!authorized(request)) return new NextResponse(null, { status: 401 });
  const kv = getKv();
  if (!kv) return NextResponse.json({ error: "kv-not-configured" }, { status: 501 });

  const body = (await request.json().catch(() => null)) as Partial<StoredSnapshot> | null;
  const incoming = sanitizePlanState(body?.state);
  if (!incoming) {
    return NextResponse.json({ error: "bad-snapshot" }, { status: 400 });
  }

  const existing = readStored(await kv.get(KV_KEY));
  const merged = existing ? mergePlanStates(existing.state, incoming) : incoming;
  const updatedAt = planRevision(merged);
  const snapshot: StoredSnapshot = { state: merged, updatedAt };
  await kv.set(KV_KEY, snapshot);
  return NextResponse.json(snapshot);
}
