import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

import "./globals.css";

const inter = Inter({
 variable: "--font-inter",
 subsets: ["latin"],
 display: "swap",
});

export const metadata: Metadata = {
 title: "Polaris | AI-Powered Cloud Code Editor",
 description:
  "The Next-Gen In-Browser Cloud IDE. Full-stack Node.js WebContainers, multi-model AI coding agents, and seamless GitHub synchronization.",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <html lang="en" suppressHydrationWarning>
   <body className={`${inter.variable} antialiased`}>
    <Providers>
     {" "}
     {children}
     <Toaster />
    </Providers>
   </body>
  </html>
 );
}
