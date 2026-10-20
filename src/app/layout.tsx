
import type { Metadata } from 'next';
import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import ThemeProvider from '@/components/shared/theme-provider/theme-provider';
import { Suspense } from 'react';
import { AuthProvider } from '@/components/auth/auth-provider';
import AuthGate from '@/components/auth/auth-gate';
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Reyansha Dashboard',
  description: 'Manage your Reyansha Ecosystem from one place.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        jetbrainsMono.variable,
        'font-sans',
      )}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Suspense
              fallback={
                <main className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
                  Loading...
                </main>
              }
            >
              <AuthGate>{children}</AuthGate>
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
