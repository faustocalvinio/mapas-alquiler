import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "./components/SessionProvider";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Mapas Alquiler",
   description:
      "Encuentra y añade apartamentos en alquiler en Madrid con mapas interactivos",
   applicationName: "Mapas Alquiler",
   authors: [{ name: "Tu Nombre" }],
   generator: "Next.js",
   keywords: ["apartamentos", "alquiler", "madrid", "mapa", "inmobiliaria"],
   referrer: "origin-when-cross-origin",
   colorScheme: "light",
   creator: "Tu Nombre",
   publisher: "Tu Nombre",
   formatDetection: {
      email: false,
      address: false,
      telephone: false,
   },
   metadataBase: new URL("https://tu-dominio.com"), // Cambia por tu dominio
   alternates: {
      canonical: "/",
   },
   openGraph: {
      type: "website",
      locale: "es_ES",
      url: "https://tu-dominio.com", // Cambia por tu dominio
      siteName: "Mapas Alquiler",
      title: "Mapas Alquiler - Apartamentos en Madrid",
      description:
         "Encuentra y añade apartamentos en alquiler en Madrid con mapas interactivos",
   },
   twitter: {
      card: "summary_large_image",
      title: "Mapas Alquiler",
      description: "Encuentra y añade apartamentos en alquiler en Madrid",
   },
   robots: {
      index: true,
      follow: true,
      googleBot: {
         index: true,
         follow: true,
         "max-video-preview": -1,
         "max-image-preview": "large",
         "max-snippet": -1,
      },
   },
   icons: {
      icon: [
         {
            url: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
         },
         {
            url: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
         },
      ],
      apple: [
         { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
   },
   manifest: "/manifest.json",
   appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Mapas Alquiler",
      startupImage: "/icons/icon-512x512.png",
   },
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="es">
         <head>
            {/* PWA Meta Tags */}
            <meta name="theme-color" content="#3b82f6" />
            <meta name="background-color" content="#ffffff" />
            <meta
               name="viewport"
               content="width=device-width, initial-scale=1, minimum-scale=1, shrink-to-fit=no, viewport-fit=cover"
            />

            {/* Apple PWA Meta Tags */}
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta
               name="apple-mobile-web-app-status-bar-style"
               content="default"
            />
            <meta name="apple-mobile-web-app-title" content="Mapas Alquiler" />

            {/* Microsoft Tiles */}
            <meta name="msapplication-TileColor" content="#3b82f6" />
            <meta
               name="msapplication-TileImage"
               content="/icons/icon-144x144.png"
            />
            <meta name="msapplication-config" content="/browserconfig.xml" />
         </head>
         <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
         >
            <SessionProviderWrapper>{children}</SessionProviderWrapper>
         </body>
      </html>
   );
}
