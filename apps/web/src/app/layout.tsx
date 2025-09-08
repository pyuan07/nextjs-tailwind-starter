import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthInitializer } from "@/components/providers/auth-initializer";
import { ConditionalNavbar } from "@/components/features/common/ConditionalNavbar";
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
  title: "React Tailwind Starter",
  description:
    "A modern React starter with Next.js 15, Tailwind CSS v4, and TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthInitializer>
              <ConditionalNavbar />
              {children}
              <Toaster />
            </AuthInitializer>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
