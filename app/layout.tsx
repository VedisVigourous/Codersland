import type { Metadata } from "next";
import "./globals.css";
import LenisScroll from "@/components/LenisScroll";

export const metadata: Metadata = {
  title: "CoderLands • Technovation Inter-Club Registration",
  description: "Official registration arena for CoderLands: Alice in Borderland themed inter-club technical tournament. WebDev, Cybersecurity, Cloud Computing, Networking.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased selection:bg-red-700 selection:text-white">
        <LenisScroll />
        {children}
      </body>
    </html>
  );
}
