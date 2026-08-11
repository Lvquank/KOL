import { NewsArchive } from "@/components/news-archive";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { fetchApiCategories, fetchApiNews } from "@/lib/api-news";

export default async function NewsPage() {
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
        />
      </main>
      <SiteFooter />
    </>
  );
}
