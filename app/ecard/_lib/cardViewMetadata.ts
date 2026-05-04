import type { Metadata } from "next";
import { decodeCardState } from "./encodeState";

function firstSearchParam(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

const FALLBACK_TITLE = "An eCard for you";
const FALLBACK_DESCRIPTION = "Tap to open your personalized card.";

/** WhatsApp / Open Graph — keep titles ~≤60 chars where practical. */
export function buildCardViewMetadataFromEncoded(encoded: string | null | undefined): Metadata {
  const state = encoded ? decodeCardState(encoded) : null;

  if (!state) {
    return {
      title: FALLBACK_TITLE,
      description: FALLBACK_DESCRIPTION,
      openGraph: {
        title: FALLBACK_TITLE,
        description: FALLBACK_DESCRIPTION,
      },
      twitter: {
        card: "summary_large_image",
        title: FALLBACK_TITLE,
        description: FALLBACK_DESCRIPTION,
      },
    };
  }

  const recipient = state.r.trim();
  const sender = state.s.trim();

  const title =
    recipient.length > 0
      ? `An eCard for ${recipient.length > 40 ? `${recipient.slice(0, 37)}…` : recipient}`
      : FALLBACK_TITLE;

  const description =
    sender.length > 0
      ? `Open your card — from ${sender.length > 72 ? `${sender.slice(0, 69)}…` : sender}.`
      : FALLBACK_DESCRIPTION;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildCardViewMetadata(searchParams: { [key: string]: string | string[] | undefined }): Metadata {
  const encoded = firstSearchParam(searchParams.d);
  return buildCardViewMetadataFromEncoded(encoded);
}
