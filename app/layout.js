

import { Autour_One, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Compassly",
  description: "Your Mentor on your journey to success",
};

export default function RootLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Clear Radix/shadcn scroll lock on every route change
    document.body.style.overflow = "";
    document.body.removeAttribute("data-scroll-locked");
  }, [pathname]);

  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Header */}
            <Header />

            <main className="min-h-screen">{children}</main>

            {/* Toast notifications */}
            <Toaster richColors />

            {/* Footer */}
            <footer className="bg-muted">
              <div className="container mx-auto py-4 text-center text-gray-200">
                <p>
                  © Compassly. All rights reserved. Made with ❤️ by Pratham
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
