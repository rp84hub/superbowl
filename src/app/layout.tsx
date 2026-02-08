import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Super Bowl LX 2026 Predictions",
  description: "Seahawks vs Patriots — Submit your picks and see the leaderboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">
        <header className="border-b border-white/10 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold tracking-tight">
              <span className="text-seahawks-green">Super Bowl</span>
              <span className="text-superbowl-gold"> LX </span>
              <span className="text-patriots-red">2026</span>
            </Link>
            <nav>
              <Link
                href="/admin"
                className="text-sm text-white/70 hover:text-white transition"
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6 pb-12">{children}</main>
      </body>
    </html>
  );
}
