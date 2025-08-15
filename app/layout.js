import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Compassly",
  description: "Your Mentor on your journey to success",
};

export default async function RootLayout({ children }) {
  return (

    <ClerkProvider appearance={{
      baseTheme: dark,
    }}>
      <html lang="en" suppressHydrationWarning >
        <body
          className={`${inter.className} `} style={{overflow:"scroll"}}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Header */}
            <Header />


            <main className="min-h-screen">{children}</main>
               < Toaster richColors />
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
