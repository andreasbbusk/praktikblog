"use client";

import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@200,201,300,301,400,401,500,501,600,601,700,701,1,2&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <SessionProvider>
          <AuthProvider>
            <Navbar />
            <div className="h-[50rem] w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative">
              <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
              <div className="container mx-auto py-8 relative z-10">
                {children}
              </div>
            </div>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
