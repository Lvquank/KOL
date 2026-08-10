import { NewsBoard } from "@/components/news-board";
import { Rankings } from "@/components/rankings";
import { RegistrationSafety } from "@/components/registration-safety";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SocialIndex } from "@/components/social-index";

export default function Home() {
  return <>
    <SiteChrome />
    <main>
      <h1 className="sr-only">Cổng thông tin &amp; Cơ sở dữ liệu về KOLs, MCN và Influencers, Creators — bản tham chiếu local</h1>
      <div className="home-surface"><div className="site-container"><NewsBoard /><Rankings /><SocialIndex /><RegistrationSafety /></div></div>
    </main>
    <SiteFooter />
  </>;
}
