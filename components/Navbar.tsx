"use client";

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

/**
 * NAVBAR: Minimalist Cyber-Noir Finalized
 * Fixed top position, refined backdrop blur, and minimal chrome-inspired borders.
 */
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] h-16 flex items-center justify-between px-8 lg:px-20 bg-black/50 backdrop-blur-md border-b border-[#333]">
      {/* Brand Logo */}
      <Link href="/" className="group">
        <span className="text-sm font-bold tracking-[0.6em] text-[#F3F4F6] transition-all group-hover:text-[#CCFF00]">
          KROM.SYS
        </span>
      </Link>

      {/* Action Area */}
      <div className="flex items-center gap-10">
        <Link 
          href="/admin" 
          className="text-[10px] font-mono tracking-widest text-[#F3F4F6]/40 hover:text-[#CCFF00] uppercase transition-colors"
        >
          [ _ADMIN_ACCESS ]
        </Link>
        
        <button className="relative group p-1">
          <ShoppingBag className="w-5 h-5 text-[#F3F4F6] group-hover:text-[#CCFF00] transition-colors" />
          {/* Neon Active Indicator */}
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#CCFF00] rounded-full shadow-[0_0_8px_#CCFF00]" />
        </button>
      </div>
    </nav>
  );
}
