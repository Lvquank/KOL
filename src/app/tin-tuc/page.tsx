import { NewsArchive } from "@/components/news-archive";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { fetchApiCategories, fetchApiNews } from "@/lib/api-news";

type NewsPageSearchParams = {
  page?: string | string[];
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<NewsPageSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const rawPage = Array.isArray(resolvedSearchParams.page)
    ? resolvedSearchParams.page[0]
    : resolvedSearchParams.page;
  const parsedPage = Number.parseInt(rawPage || "1", 10);
  const initialPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const [initialCategories, initialNews] = await Promise.all([
    fetchApiCategories(),
    fetchApiNews(),
  ]);

  return (
    <>
      <SiteChrome showTicker={false} />
      <main>
        <NewsArchive
          initialCategories={initialCategories}
          initialNews={initialNews}
          initialPage={initialPage}
        />
      </main>
      <SiteFooter />
    </>
  );
}
