import type { Metadata } from "next";

import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
