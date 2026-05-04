import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ECardView, ECardViewSkeleton } from "@/app/ecard/_components/ECardView";
import { buildCardViewMetadataFromEncoded } from "@/app/ecard/_lib/cardViewMetadata";
import { isValidShortSlug, resolveShortLinkEncoded } from "@/app/ecard/_lib/shortLinkKv";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;
  if (!isValidShortSlug(slug)) {
    return buildCardViewMetadataFromEncoded(null);
  }
  const encoded = await resolveShortLinkEncoded(slug);
  return buildCardViewMetadataFromEncoded(encoded);
}

/** Short share URL: `/e/{slug}` resolves stored payload → same view as `/e?d=…`. */
export default async function ShortSlugECardPage({ params }: PageProps) {
  const { slug } = params;
  if (!isValidShortSlug(slug)) notFound();

  const encoded = await resolveShortLinkEncoded(slug);
  if (!encoded) notFound();

  return (
    <Suspense fallback={<ECardViewSkeleton />}>
      <ECardView encoded={encoded} />
    </Suspense>
  );
}
