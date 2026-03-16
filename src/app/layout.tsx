import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://zylosystems.com"),
  title: "Zylosystems | Living Documentation Platform",
  description:
    "Keeping your docs in sync with AI. zylo-docs syncs your documentation automatically so you can focus on building.",
  openGraph: {
    type: "website",
    title: "Zylosystems | Living Documentation Platform",
    description:
      "Keeping your docs in sync with AI. zylo-docs syncs your documentation automatically so you can focus on building.",
    images: ["/zylo-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zylosystems | Living Documentation Platform",
    description:
      "Keeping your docs in sync with AI. zylo-docs syncs your documentation automatically so you can focus on building.",
    images: ["/zylo-logo.png"],
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
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
            </TooltipProvider>
            </ThemeProvider>
          </ConvexClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
