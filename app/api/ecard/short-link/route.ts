import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { decodeCardState } from "@/app/ecard/_lib/encodeState";
import { ECARD_LINK_KEY_PREFIX, ECARD_LINK_TTL_SECONDS, getKv } from "@/app/ecard/_lib/shortLinkKv";

export const runtime = "nodejs";

const MAX_D_LENGTH = 8192;

/**
 * Creates a short `/e/{slug}` URL backed by Vercel KV / Upstash Redis.
 *
 * Vercel: add a Redis integration (Marketplace) or legacy KV; link the project so
 * Redis REST env vars are set (see `redisRestCredentials` in `shortLinkKv.ts`).
 * Without them, this route returns 503 and the client falls back to `/e?d=…`.
 */
export async function POST(req: Request) {
  const kv = getKv();
  if (!kv) {
    return NextResponse.json({ ok: false, error: "kv_unconfigured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || typeof (body as { d?: unknown }).d !== "string") {
    return NextResponse.json({ ok: false, error: "missing_d" }, { status: 400 });
  }

  const d = (body as { d: string }).d;
  if (d.length === 0 || d.length > MAX_D_LENGTH) {
    return NextResponse.json({ ok: false, error: "bad_payload_size" }, { status: 413 });
  }

  if (!decodeCardState(d)) {
    return NextResponse.json({ ok: false, error: "invalid_card" }, { status: 400 });
  }

  for (let attempt = 0; attempt < 16; attempt++) {
    const slug = randomBytes(6).toString("base64url");
    const key = `${ECARD_LINK_KEY_PREFIX}${slug}`;
    const set = await kv.set(key, d, { nx: true, ex: ECARD_LINK_TTL_SECONDS });
    if (set !== null) {
      return NextResponse.json({ ok: true, slug });
    }
  }

  return NextResponse.json({ ok: false, error: "slug_collision" }, { status: 503 });
}
