import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AstroVerse - Explora el Universo",
  description: "Plataforma educativa espacial interactiva. Explora planetas, galaxias, nebulosas y más con simuladores 3D y contenido educativo.",
  keywords: ["AstroVerse", "espacio", "educación", "planetas", "galaxias", "astronomía"],
  authors: [{ name: "AstroVerse Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: '#050510', color: '#ffffff' }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
