import type { Metadata } from 'next'
import { Oswald, Space_Mono, Geist } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import ThemeProvider from "@/components/ThemeProvider";
import EasterEggListener from "@/components/EasterEggListener";
import SystemMessage from "@/components/SystemMessage";
import Providers from "@/components/Providers";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-space-mono' })

export const metadata: Metadata = {
  title: 'Heavy Hardware | Underground Chrome',
  description: 'Cyberpunk & Industrial Streetwear Culture',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let fetchedColor = '#CCFF00'; // Default Acid Green

  if (user) {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { customColor: true }
    });
    if (profile?.customColor) {
      fetchedColor = profile.customColor;
    }
  }

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${oswald.variable} ${spaceMono.variable} bg-black text-[#F3F4F6] font-sans antialiased`}>
        <ThemeProvider initialColor={fetchedColor}>
          {/* Global Frame */}
          <Navbar />
          <CartSidebar />
          <EasterEggListener />
          <SystemMessage />
          
          {/* Main Content */}
          <main className="relative pt-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
   </html>
  )
}
