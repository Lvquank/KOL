import { notFound } from "next/navigation";
import { RegistrationForm } from "@/components/registration-form";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";

export default async function RegistrationPage({ params }: PageProps<"/dang-ky/[type]">) {
  const { type } = await params;
  if (type !== "kol" && type !== "mcn") notFound();
  return <><SiteChrome showTicker={false} /><main className="registration-page"><RegistrationForm applicantType={type === "kol" ? "individual" : "organization"} /></main><SiteFooter /></>;
}
