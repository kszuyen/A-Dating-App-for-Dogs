import type { Metadata } from "next";
import { Head } from "next/document";
import { Inter } from "next/font/google";

import { EdgeStoreProvider } from "@/lib/edgestore";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tindog",
  description: "A dating app for dogs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 如果沒有加"overflow-x-hidden"，swipe頁面往右滑之後會有bug，有可能會可以往右拖移看到滑出去的卡
    <html lang="en" className="overflow-x-hidden">
      <Head>
        {/* <link rel="shortcut icon" href={favicon} /> */}
        <link rel="icon" href="./favicon.png" />
      </Head>
      <body className={inter.className}>
        <EdgeStoreProvider>{children}</EdgeStoreProvider>
      </body>
    </html>
  );
}
