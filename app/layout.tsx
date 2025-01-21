import DeployButton from '@/components/deploy-button';
import { EnvVarWarning } from '@/components/env-var-warning';
import HeaderAuth from '@/components/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import Script from 'next/script';
import './globals.css';
import { AuthProvider } from './providers/AuthProvider';
import ToastComponent from '@/components/ui/toast-component';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Love in Action - Sponsorship Portal',
  description: 'Sponsor a child and change their life',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <head>
        <Script
          src="https://zeffy-scripts.s3.ca-central-1.amazonaws.com/embed-form-script.min.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${GeistSans.className} bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              {!hasEnvVars && <EnvVarWarning />}

              {/* Header */}
              <header className="w-full border-b border-b-foreground/10 sticky top-0 z-40 bg-background">
                <div className="w-full h-12 px-3 flex justify-end items-center gap-2">
                  <HeaderAuth />
                  <ThemeSwitcher />
                </div>
              </header>

              {/* <ToastComponent /> */}

              {/* Page Content */}
              <main className="flex-1 flex flex-col items-center justify-center">
                {children}
              </main>

              {/* Footer */}
              <footer className="w-full border-t py-4">
                <div className="w-full px-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Powered by{' '}
                    <a
                      href="https://loveinaction.co/"
                      target="_blank"
                      className="font-bold hover:underline"
                      rel="noreferrer"
                    >
                      Love in Action
                    </a>
                  </p>
                </div>
              </footer>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
