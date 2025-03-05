import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cute or Not - Memecoin Trading Platform",
  description: "Trade on the cuteness of memes with our memecoin platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white`}
      >
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-gray-900 border-t border-gray-800 py-6">
            <div className="container mx-auto px-4 text-center text-sm text-gray-400">
              <p>© 2024 Cute or Not. All rights reserved.</p>
              <p className="mt-2">A memecoin trading platform for cute things.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
