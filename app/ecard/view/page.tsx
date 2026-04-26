import { Suspense } from "react";
import { ECardView, ECardViewSkeleton } from "../_components/ECardView";

export default function ECardViewPage() {
  return (
    <Suspense fallback={<ECardViewSkeleton />}>
      <ECardView />
    </Suspense>
  );
}
