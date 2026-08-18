import type { Metadata } from "next";
import { Sarabun, Mitr } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const mitr = Mitr({
  variable: "--font-mitr",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CheckJai — แบบทดสอบความรัก",
  description: "ทดสอบความรู้สึกในความสัมพันธ์ วัดเคมี และค้นหาคำตอบในใจ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${sarabun.variable} ${mitr.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
