import { RegistrationForm } from "@/components/registration-form";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";

export default function IndividualRegistrationPage() {
  return <><SiteChrome showTicker={false} /><main className="registration-page"><RegistrationForm applicantType="individual" /></main><SiteFooter /></>;
}
