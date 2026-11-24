import type { Metadata } from "next";
import "./globals.css";
import LenisScroll from "@/components/LenisScroll";

export const metadata: Metadata = {
  title: "Coderslands • Technovation Inter-Club Registration",
  description: "Official registration arena for Coderslands: Alice in Borderland themed inter-club technical tournament. WebDev, Cybersecurity, Cloud Computing, Networking.",
  icons: {
    icon: [
      { url: "/logo.webp", type: "image/webp" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo.webp",
    apple: "/logo.webp",
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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@500;700;900&family=Outfit:wght@300;400;600;700;800&family=Pirata+One&family=Rye&display=swap"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased selection:bg-red-700 selection:text-white">
        <LenisScroll />
        {children}
      </body>
    </html>
  );
}
