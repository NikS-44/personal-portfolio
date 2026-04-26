"use client";

export default function ECardError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-2xl font-semibold text-gray-800">Something went wrong</p>
      <p className="text-gray-500">We couldn&apos;t load the card creator. Please try again.</p>
      <button
        onClick={reset}
        className="rounded-xl bg-rose-500 px-6 py-3 text-lg font-semibold text-white hover:bg-rose-600"
      >
        Try again
      </button>
    </div>
  );
}
