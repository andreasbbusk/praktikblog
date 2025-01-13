"use client";

import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { SessionProvider } from "next-auth/react";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <SessionProvider>
          <AuthProvider>{children}</AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
