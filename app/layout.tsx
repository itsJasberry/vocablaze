import type { Metadata } from "next";
import { Space_Grotesk, Roboto_Slab } from "next/font/google";
import ThemeProvider from "@/context/ThemeProvider";
import { NextUIProvider } from "@nextui-org/react";

import "./globals.css";

import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

import { Toaster } from "@/components/ui/sonner";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-spaceGrotesk'
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-robotoSlab'
});

export const metadata: Metadata = {
  title: "Blackfyre - Language Learning Made Fun",
  description:
    "Blackfyre is an innovative language learning app that uses flashcards and interactive games like hangman and word matching to make learning new languages engaging and enjoyable.",
  icons: {
    icon: "/assets/images/logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${spaceGrotesk.className} antialiased h-full`}>
          <Toaster />
          <NextUIProvider className="h-full">
            <ThemeProvider>{children}</ThemeProvider>
          </NextUIProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
