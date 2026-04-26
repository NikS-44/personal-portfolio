"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import { decodeCardState } from "../_lib/encodeState";
import { ECardCanvas } from "./ECardCanvas";

export function ECardViewSkeleton() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-8">
      <div className="h-96 w-full max-w-2xl animate-pulse rounded-2xl bg-gray-200" />
    </div>
  );
}

export function ECardView() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("d");

  const cardState = useMemo(() => {
    if (!encoded) return null;
    return decodeCardState(encoded);
  }, [encoded]);

  if (!cardState) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
        <span className="text-5xl">💌</span>
        <p className="text-2xl font-semibold text-gray-800">Couldn&apos;t read this card</p>
        <p className="text-gray-500">This link may be invalid or the card may have been made with an older version.</p>
        <Link
          href="/ecard"
          className="rounded-xl bg-rose-500 px-6 py-3 text-lg font-semibold text-white transition hover:bg-rose-600"
        >
          Create a new card
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-8">
      <p className="text-center text-lg text-gray-500">
        {cardState.s ? `A card from ${cardState.s}` : "Someone sent you a card!"}
      </p>
      <ECardCanvas state={cardState} className="w-full max-w-2xl shadow-2xl" />
      <Link href="/ecard" className="text-base text-gray-400 underline transition hover:text-gray-600">
        Make your own card →
      </Link>
    </div>
  );
}
