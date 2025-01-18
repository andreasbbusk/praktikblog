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
            <div className="container mx-auto py-8">{children}</div>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
