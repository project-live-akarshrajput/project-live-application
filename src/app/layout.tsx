import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LiveChat - Random Video Chat",
  description:
    "Connect with random people around the world through live video chat",
  keywords: ["video chat", "random chat", "live video", "meet people"],
  authors: [{ name: "LiveChat Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-dark-950 text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
