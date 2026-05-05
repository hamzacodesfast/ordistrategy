import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ORDI vs MSTR BTC Yield Dashboard",
  description:
    "Compare ORDI's decentralized BTC-denominated yield against MSTR's engineered BTC-denominated yield.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}

