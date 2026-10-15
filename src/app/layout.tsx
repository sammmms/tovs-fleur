import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#8B5E3C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://tovs-fleur.vercel.app'),
  title: "Tov's Fleur - Boutique Florist & Invoice System",
  description: "Florist based in Medan & Lubuk Pakam. Fresh flowers, Artificial bouquets, Preserved glass dome, Bloom box & Instant Florist Invoicing.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Tov's Fleur - Boutique Florist & Invoice",
    description: "Share some blooms and happiness. Based in Medan & Lubuk Pakam.",
    images: [{ url: "/logo.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${cormorant.variable} ${jakarta.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-[#FAF6F0] text-[#2A2421] font-sans antialiased selection:bg-[#E8D8C8] selection:text-[#5C3D2E]">
        {children}
      </body>
    </html>
  );
}
