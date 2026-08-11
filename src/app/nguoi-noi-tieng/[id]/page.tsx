import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { InfluencerDetail } from "@/components/influencer-detail";
import { fetchInfluencerDetail } from "@/lib/api-influencer";

export default async function InfluencerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const influencer = await fetchInfluencerDetail(id);

  if (!influencer) {
    notFound();
  }

  return (
    <>
      <SiteChrome showTicker={false} />
      <InfluencerDetail influencer={influencer} />
      <SiteFooter />
    </>
  );
}
