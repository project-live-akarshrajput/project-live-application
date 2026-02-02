import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vibly - Random Video Chat",
  description:
    "Connect with random people around the world through live video chat",
  keywords: ["video chat", "random chat", "live video", "meet people"],
  authors: [{ name: "Vibly Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-surface-50 text-surface-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
