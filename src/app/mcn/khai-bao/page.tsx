import { RegistrationForm } from "@/components/registration-form";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";

export default function OrganizationRegistrationPage() {
  return <><SiteChrome showTicker={false} /><main className="registration-page"><RegistrationForm applicantType="organization" /></main><SiteFooter /></>;
}
