import type { Metadata } from "next";
import { Suspense } from "react";
import { ECardView, ECardViewSkeleton } from "../ecard/_components/ECardView";
import { buildCardViewMetadata } from "../ecard/_lib/cardViewMetadata";

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return buildCardViewMetadata(searchParams);
}

/** Short share URL: `/e?d=…` (same query shape as `/ecard/view`). */
export default function ShortECardViewPage() {
  return (
    <Suspense fallback={<ECardViewSkeleton />}>
      <ECardView />
    </Suspense>
  );
}
