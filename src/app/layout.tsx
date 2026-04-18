import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from 'next/headers'
import "./globals.css";
import { PHProvider } from './providers'
import PostHogPageView from './_components/PostHogPageView'
import {
  LANDING_THEME_HTML_ATTR,
  LANDING_THEME_STORAGE_KEY,
  landingThemeFromCookieValue,
} from '@/lib/landing-theme'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "releafZ ",
  description: "AI-powered medical cannabis platform",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "releafZ",
  },
  icons: {
    icon: '/logo1.ico',
    shortcut: '/logo1.ico',
    apple: '/logo1.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jar = await cookies()
  const htmlLandingTheme = landingThemeFromCookieValue(jar.get(LANDING_THEME_STORAGE_KEY)?.value)

  return (
    <html lang="en" suppressHydrationWarning data-releafz-landing-theme={htmlLandingTheme}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Before paint: align <html> + cookie with localStorage so refresh / hydration match. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k=${JSON.stringify(LANDING_THEME_STORAGE_KEY)};var a=${JSON.stringify(LANDING_THEME_HTML_ATTR)};var t=localStorage.getItem(k);if(t==='dark'||t==='light'){document.documentElement.setAttribute(a,t);document.cookie=k+'='+t+';path=/;max-age=31536000;SameSite=Lax';}}catch(e){}})();`,
          }}
        />
        <PHProvider landingThemeInitial={htmlLandingTheme}>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          {children}
        </PHProvider>
      </body>
    </html>
  );
}
