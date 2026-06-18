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
    type: "website",
    url: "https://backspaceoddity.com",
    title: "Backspace Oddity — AI-native GTM agency",
    description:
      "GTM strategy is not a set of tactics across channels. We build the system underneath — audience, jobs, context, competition, fit — that makes the channels worth running.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Backspace Oddity — AI-native GTM agency",
    description:
      "GTM strategy is not a set of tactics across channels. We build the system underneath — audience, jobs, context, competition, fit — that makes the channels worth running.",
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
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Backspace Oddity",
    url: "https://backspaceoddity.com",
    logo: "https://backspaceoddity.com/images/Logo%20Mark.svg",
    description: "AI-native GTM agency. We build the system underneath go-to-market — audience, jobs, context, competition, fit — that makes the channels worth running.",
    email: "yegor@backspaceoddity.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Vijzelstraat 68-78",
      postalCode: "1017 ES",
      addressLocality: "Amsterdam",
      addressCountry: "NL",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "yegor@backspaceoddity.com",
      contactType: "sales",
    },
  };
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Backspace Oddity",
    url: "https://backspaceoddity.com",
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
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
