import { createClient, type VercelKV } from "@vercel/kv";
import { cache } from "react";

/** KV key prefix for `/e/[slug]` → encoded `d` payload (same string as `?d=`). */
export const ECARD_LINK_KEY_PREFIX = "ecard:link:";

/** Default retention for shared links (renew on each new share with a new slug). */
export const ECARD_LINK_TTL_SECONDS = 60 * 60 * 24 * 365;

/** Slugs are URL-safe base64 from 6 bytes (~8 chars); allow some margin. */
const SLUG_RE = /^[A-Za-z0-9_-]{6,16}$/;

let kvSingleton: VercelKV | null = null;

/**
 * Resolve Redis REST credentials from env. Supports Vercel’s default integration names
 * (`KV_REST_*`), Upstash (`UPSTASH_REDIS_REST_*`), and Marketplace custom prefix such as
 * `STORAGE_URL` / `STORAGE_TOKEN`.
 */
export function redisRestCredentials(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? process.env.STORAGE_URL;
  const token =
    process.env.KV_REST_API_TOKEN ??
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.STORAGE_TOKEN ??
    process.env.STORAGE_READ_WRITE_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

export function getKv(): VercelKV | null {
  const creds = redisRestCredentials();
  if (!creds) return null;
  if (!kvSingleton) {
    kvSingleton = createClient({ url: creds.url, token: creds.token });
  }
  return kvSingleton;
}

export function isValidShortSlug(slug: string): boolean {
  return SLUG_RE.test(slug);
}

export function kvConfigured(): boolean {
  return redisRestCredentials() !== null;
}

/** Resolve slug → `d` payload; deduped per request (metadata + page). */
export const resolveShortLinkEncoded = cache(async (slug: string): Promise<string | null> => {
  if (!isValidShortSlug(slug)) return null;
  const kv = getKv();
  if (!kv) return null;
  try {
    const v = await kv.get<string>(`${ECARD_LINK_KEY_PREFIX}${slug}`);
    return typeof v === "string" && v.length > 0 ? v : null;
  } catch {
    return null;
  }
});
