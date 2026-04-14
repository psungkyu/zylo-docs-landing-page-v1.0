import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import PostHogInit from "@/app/posthog-init";
import "@/app/globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.zylo-docs.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Zylosystems | Living Documentation Platform",
  description:
    "Keeping your docs in sync with AI. zylo-docs syncs your documentation automatically so you can focus on building.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "zylo-docs",
    title: "Zylosystems | Living Documentation Platform",
    description:
      "Keeping your docs in sync with AI. zylo-docs syncs your documentation automatically so you can focus on building.",
    // OG 이미지: `opengraph-image.jpg` (App Router 파일 규칙) — 크롤러 호환성이 가장 좋음
  },
  twitter: {
    card: "summary_large_image",
    title: "Zylosystems | Living Documentation Platform",
    description:
      "Keeping your docs in sync with AI. zylo-docs syncs your documentation automatically so you can focus on building.",
    // 트위터 카드: `twitter-image.jpg` 파일 규칙
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="dark">
        <ErrorBoundary>
          <ConvexClientProvider>
            <ThemeProvider defaultTheme="dark">
              <TooltipProvider>
                {children}
                <Toaster />
                <Analytics />
                <PostHogInit />
              </TooltipProvider>
            </ThemeProvider>
          </ConvexClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
