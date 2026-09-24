import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-editorial",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "COTONOU / 3D",
  description:
    "COTONOU / 3D — étude interactive de l’architecture et de l’hospitalité à Cotonou · interactive study of architecture and hospitality in Cotonou, Benin.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${geist.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
