import type { Metadata } from "next";
import { Playfair_Display, Inter, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter", 
  display: "swap",
});

const pinyon = Pinyon_Script({
  weight: "400",
  subsets: ["latin"], 
  variable: "--font-pinyon",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumaire Studio",
  description: "The wedding planning platform that feels calm, grounded, and emotional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${pinyon.variable} bg-lumaire-ivory text-lumaire-brown min-h-screen flex`}>
        {/* The Sidebar is fixed on the left */}
        <Sidebar />
        
        {/* The Page Content - pushed 64 units (16rem) to the right to make room for sidebar */}
        <div className="flex-1 ml-64">
          {children}
        </div>
      </body>
    </html>
  );
}
