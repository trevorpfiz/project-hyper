import "~/app/globals.css";
import "~/styles/prosemirror.css";

import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

// import { OpenAPI } from "@hyper/api/client";
import { cn } from "@hyper/ui";
import { Toaster } from "@hyper/ui/sonner";
import { ThemeProvider } from "@hyper/ui/theme";

import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";

// if (env.NODE_ENV === "production") {
//   OpenAPI.BASE = env.NEXT_PUBLIC_FASTAPI_URL;
// }

export const metadata: Metadata = {
  metadataBase: new URL(
    env.NODE_ENV === "production"
      ? "https://getwellchart.com"
      : "http://localhost:3000",
  ),
  title: "WellChart",
  description: "Automated pre-charting for digital health.",
  openGraph: {
    title: "WellChart",
    description: "Automated pre-charting for digital health.",
    url: "https://www.getwellchart.com",
    siteName: "WellChart",
  },
  twitter: {
    card: "summary_large_image",
    site: "@trevorpfiz",
    creator: "@trevorpfiz",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
