import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KOL.GOV.VN — Bản tham chiếu local",
  description: "Bản tham chiếu giao diện local, không phải website chính thức. Nguồn: kol.gov.vn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
