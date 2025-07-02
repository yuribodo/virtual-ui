import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./(application)/_components/navbar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Virtual UI",
  description: "Virtual UI is a Component Library for Micro Interactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar 
          variant="blur"
          brand={{ text: "Virtual UI", href: "/" }}
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
