import { notFound } from "next/navigation";
import { McnDetail } from "@/components/mcn-detail";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { fetchMcnDetail } from "@/lib/api-mcn";

export default async function McnDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mcn = await fetchMcnDetail(id);
  if (!mcn) notFound();

  return (
    <>
      <SiteChrome showTicker={false} />
      <McnDetail mcn={mcn} />
      <SiteFooter />
    </>
  );
}
