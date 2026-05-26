import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { getAppUrl } from "@/lib/env";

const appUrl = getAppUrl();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "DailyOS — Your Everyday Productivity OS",
    template: "%s · DailyOS",
  },
  description:
    "Notes, timers, tasks, habits, and utilities in one beautiful dashboard. Free, installable, and built for daily rituals.",
  keywords: [
    "productivity",
    "notes",
    "pomodoro",
    "habits",
    "tasks",
    "dashboard",
    "PWA",
  ],
  authors: [{ name: "DailyOS" }],
  creator: "DailyOS",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appUrl,
    siteName: "DailyOS",
    title: "DailyOS — Your Everyday Productivity OS",
    description:
      "Notes, timers, tasks, habits, and utilities in one beautiful dashboard.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DailyOS — Your Everyday Productivity OS",
    description:
      "Notes, timers, tasks, habits, and utilities in one beautiful dashboard.",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DailyOS",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0d12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--background-elevated)] focus:px-4 focus:py-2 focus:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        >
          Skip to main content
        </a>
        <AppProviders>
          <div id="main-content">{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
