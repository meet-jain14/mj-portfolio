import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "../components/SmoothScrollProvider";
import { CursorProvider } from "@/components/cursor";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "MJ Portfolio",
  description: "Interactive AI Engineer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.variable}>
      <SmoothScrollProvider>
        <CursorProvider>
          {children}
        </CursorProvider>
      </SmoothScrollProvider>
      </body>
    </html>
  );
}