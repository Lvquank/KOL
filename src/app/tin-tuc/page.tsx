import { NewsArchive } from "@/components/news-archive";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";

export default function NewsPage() {
  return <>
    <SiteChrome showTicker={false} />
    <main><NewsArchive /></main>
    <SiteFooter />
  </>;
}
