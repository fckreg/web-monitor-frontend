import "@/_app/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Geologica, Manrope } from "next/font/google";
import type { ReactNode } from "react";

import { SITE_DESCRIPTION, SITE_NAME } from "@/shared/config";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const geologica = Geologica({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geologica",
  display: "swap",
});

// Без metadataBase и robots: они зависят от рантайм-окружения и задаются на уровне страниц.
export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#10211e",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${geologica.variable}`}>
      <body>{children}</body>
    </html>
  );
}
