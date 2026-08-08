import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { AppShell } from "@/components/AppShell";
import { getLocale, t } from "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "cockpitlm-frontier.openai.site";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const image = new URL("/og.png", base).toString();
  return {
    metadataBase: base,
    title: { default: "CockpitLM Frontier", template: "%s · CockpitLM Frontier" },
    description: t(locale, "面向智能座舱团队的 VLM、OMNI、多模态智能体与世界模型前沿研究情报平台。", "Research intelligence for VLM, OMNI, multimodal agents and world models—translated into intelligent cockpit engineering decisions."),
    applicationName: "CockpitLM Frontier",
    openGraph: { title: "CockpitLM Frontier", description: t(locale, "面向智能座舱的 VLM · OMNI · 世界模型", "VLM · OMNI · World Models for Intelligent Cockpits"), type: "website", images: [{ url: image, width: 1733, height: 909, alt: "CockpitLM Frontier research intelligence" }] },
    twitter: { card: "summary_large_image", title: "CockpitLM Frontier", description: t(locale, "面向智能座舱团队的前沿研究情报。", "Research intelligence for intelligent cockpit teams."), images: [image] },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('cockpitlm-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}})()` }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppShell locale={locale}>{children}</AppShell>
      </body>
    </html>
  );
}
