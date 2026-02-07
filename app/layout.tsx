import React from "react"
import Script from "next/script"
import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Painel do Uriel - O Melhor Painel para Dominar",
  description:
    "Adquira o Painel do Uriel com desconto exclusivo. O painel mais completo e poderoso do mercado.",
}

export const viewport: Viewport = {
  themeColor: "#dc2626",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <Script id="utmify-pixel" strategy="afterInteractive">
          {`
            window.pixelId = "6987c267c4fb9b7e8c2a8494";
            (function () {
              var a = document.createElement("script");
              a.async = true;
              a.defer = true;
              a.src = "https://cdn.utmify.com.br/scripts/pixel/pixel.js";
              document.head.appendChild(a);
            })();
          `}
        </Script>
      </head>

      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
