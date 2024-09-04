import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Love in Action - Sponsorship Portal",
  description: "Sponsor a child and change their life",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-64"> {/* Add left margin on large screens to account for sidebar width */}
              {/* Header */}
              <Header />
              
              {/* Page Content */}
              <main className="flex-1 w-full max-w-5xl mx-auto p-5">
                {children}
              </main>
              
              {/* Footer */}
              <footer className="w-full flex items-center justify-center border-t text-center text-xs gap-8 py-8">
                <p>
                  Powered by{" "}
                  <a
                    href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Supabase
                  </a>
                </p>
              </footer>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}