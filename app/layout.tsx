import type { Metadata } from 'next'
import { Oswald, Space_Mono, Geist } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-space-mono' })

export const metadata: Metadata = {
  title: 'Heavy Hardware | Underground Chrome',
  description: 'Cyberpunk & Industrial Streetwear Culture',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${oswald.variable} ${spaceMono.variable} bg-black text-[#F3F4F6] font-sans antialiased`}>
        {/* Global Frame */}
        <Navbar />
        <CartSidebar />
        
        {/* Main Content */}
        <main className="relative pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}
