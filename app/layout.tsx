import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./(application)/_components/navbar";
import { Toaster } from "sonner";
import { IconOfficial } from "./(application)/_components/icon";
import Script from "next/script";
export const metadata: Metadata = {
  title: "Virtual UI",
  description: "Virtual UI is a Component Library for Micro Interactions.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
            defer
            data-website-id="6870851ca26924c695ba1abe"
            data-domain="virtual-ui-eight.vercel.app"
            src="https://datafa.st/js/script.js"
          />
      </head>
      <body>
        <Navbar 
          variant="blur"
          brand={{
            href: "/",
            children: (
              <>
                <IconOfficial className="w-6 h-6" />
                <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent font-bold text-xl">
                  Virtual UI
                </span>
              </>
            ),
          }}
          componentsLink={{ href: "/components", text: "Components" }}
        >
          <a href="https://github.com/yuribodo/virtual-ui" className="text-sm text-[var(--base-content)] hover:text-[var(--primary)] transition-colors" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>          
        </Navbar>
        
        <main className="pt-16">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
