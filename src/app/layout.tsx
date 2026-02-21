import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import AuthProvider from "@/components/auth-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://keysprint.in'),
  title: {
    default: "Keysprint | Master Your Keyboard",
    template: "%s | Keysprint",
  },
  description: "The premier competitive typing platform. Test your typing speed, improve your accuracy, and compete globally.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://keysprint.in",
    siteName: "Keysprint",
    title: {
      default: "Keysprint | Master Your Keyboard",
      template: "%s | Keysprint",
    },
    description: "The premier competitive typing platform. Test your typing speed, improve your accuracy, and compete globally.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Keysprint - Competitive Typing Platform",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Keysprint | Master Your Keyboard",
    description: "The premier competitive typing platform. Test your typing speed, improve your accuracy, and compete globally.",
    images: ["/og-image.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
