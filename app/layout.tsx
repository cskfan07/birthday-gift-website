import type { Metadata } from "next";
import { Dancing_Script, Pacifico, Poppins } from "next/font/google";

import "./globals.css";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-pacifico",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-dancing-script",
});

export const metadata: Metadata = {
  title: "Our Surprise | Create a Birthday Story",
  description: "Create a personal birthday surprise with memories, messages, and live animation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pacifico.variable} ${poppins.variable} ${dancingScript.variable}`}>
      <body>{children}</body>
    </html>
  );
}
