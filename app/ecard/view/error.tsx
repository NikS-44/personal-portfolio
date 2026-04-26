"use client";

import Link from "next/link";

export default function ECardViewError() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-2xl font-semibold text-gray-800">Couldn&apos;t read this card</p>
      <p className="text-gray-500">This link may be invalid or expired.</p>
      <Link
        href="/ecard"
        className="rounded-xl bg-rose-500 px-6 py-3 text-lg font-semibold text-white hover:bg-rose-600"
      >
        Create a new card
      </Link>
    </div>
  );
}
