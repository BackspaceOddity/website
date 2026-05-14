import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { EditModeShell } from "@/components/EditModeShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://backspaceoddity.com"),
  title: "Backspace Oddity — AI-native GTM agency",
  description:
    "GTM strategy is not a set of tactics across channels. We build the system underneath — audience, jobs, context, competition, fit — that makes the channels worth running.",
  openGraph: {
    title: "Backspace Oddity — AI-native GTM agency",
    description:
      "GTM strategy is not a set of tactics across channels. We build the system underneath — audience, jobs, context, competition, fit — that makes the channels worth running.",
    images: ["/images/og-image-v3.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Backspace Oddity — AI-native GTM agency",
    description:
      "GTM strategy is not a set of tactics across channels. We build the system underneath — audience, jobs, context, competition, fit — that makes the channels worth running.",
    images: ["/images/og-image-v3.jpg"],
  },
  icons: {
    icon: "/images/Logo Mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <EditModeShell>{children}</EditModeShell>
        <Script
          src="https://app.rybbit.io/api/script.js"
          data-site-id="41dafd61e53c"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
