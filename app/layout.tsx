import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";
import { EditModeShell } from "@/components/EditModeShell";

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://backspaceoddity.com"),
  title: "Backspace Oddity — A strategic brand growth agency",
  description:
    "GTM strategy is not a set of tactics across channels. We build the system underneath — audience, jobs, context, competition, fit — that makes the channels worth running.",
  openGraph: {
    title: "Backspace Oddity — A strategic brand growth agency",
    description:
      "GTM strategy is not a set of tactics across channels. We build the system underneath — audience, jobs, context, competition, fit — that makes the channels worth running.",
    images: ["/images/og-image-v2.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Backspace Oddity — A strategic brand growth agency",
    description:
      "GTM strategy is not a set of tactics across channels. We build the system underneath — audience, jobs, context, competition, fit — that makes the channels worth running.",
    images: ["/images/og-image-v2.jpg"],
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
    <html lang="en" className={ebGaramond.variable}>
      <body>
        <EditModeShell>{children}</EditModeShell>
      </body>
    </html>
  );
}
