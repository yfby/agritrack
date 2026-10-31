import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import "./globals.css";
import { NavLinks } from "@/components/NavLinks";
import { CURRENCY, CURRENCY_SYMBOL } from "@/lib/money";

export const metadata: Metadata = {
  title: {
    default: "AgriTrack — Farm expense tracker",
    template: "%s · AgriTrack",
  },
  description:
    "Track farm costs per harvest, category by category. Simple, fast, mobile-friendly.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col antialiased">
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white"
                aria-hidden
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4.5 w-4.5"
                >
                  <path d="M12 21V9" />
                  <path d="M12 9C12 5.5 9 3 5 3c0 4 3 6 7 6Z" />
                  <path d="M12 13c0-3.5 3-6 7-6 0 4-3 6-7 6Z" />
                </svg>
              </span>
              <span className="text-base font-bold tracking-tight text-stone-900">
                AgriTrack
              </span>
            </Link>
            <Suspense
              fallback={
                <nav
                  className="flex items-center gap-1 text-sm font-semibold text-stone-600"
                  aria-label="Main"
                >
                  <span className="px-3 py-2">Harvests</span>
                  <span className="px-3 py-2">Categories</span>
                </nav>
              }
            >
              <NavLinks />
            </Suspense>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>

        <footer className="mx-auto w-full max-w-5xl px-4 pb-8 pt-4 text-xs text-stone-500 sm:px-6">
          Amounts in {CURRENCY} ({CURRENCY_SYMBOL}) · Data stays on this device
        </footer>
      </body>
    </html>
  );
}
