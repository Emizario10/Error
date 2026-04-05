"use client";

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';

/**
 * NAVBAR: Minimalist Cyber-Noir Finalized
 * Integrated with the ARSENAL Cart Rig.
 */
export default function Navbar() {
  const { toggleCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

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
          href="/catalog" 
          className="text-[10px] font-mono tracking-widest text-[#F3F4F6]/40 hover:text-[#CCFF00] uppercase transition-colors"
        >
          [ _CATALOG ]
        </Link>
        <Link 
          href="/admin" 
          className="text-[10px] font-mono tracking-widest text-[#F3F4F6]/40 hover:text-[#CCFF00] uppercase transition-colors"
        >
          [ _ADMIN ]
        </Link>
        
        <button 
          onClick={toggleCart}
          className="relative group p-1"
        >
          <ShoppingBag className="w-5 h-5 text-[#F3F4F6] group-hover:text-[#CCFF00] transition-colors" />
          
          {/* Item Badge */}
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] flex items-center justify-center bg-[#CCFF00] text-black text-[8px] font-bold rounded-full shadow-[0_0_8px_#CCFF00]">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
