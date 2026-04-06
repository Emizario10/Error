"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingBag, Zap } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { createClient } from '@/utils/supabase/client';
import GlitchButton from './GlitchButton';
import { User } from '@supabase/supabase-js';

/**
 * NAVBAR: Hardened Identity Controller.
 * Eliminates loading loops and strictly gates protected routes.
 */
export default function Navbar() {
  const { toggleCart, items } = useCartStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  
  const itemCount = items.length;

  useEffect(() => {
    let mounted = true;

    // 1. INITIAL_SYNC: Get session immediately
    const syncIdentity = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted) {
          setUser(session?.user ?? null);
        }
      } catch (err) {
        console.error('[AUTH_SYNC_FAIL]:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    syncIdentity();

    // 2. LIVE_LISTENER: Handle state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Admin Verification (Verified Operative)
  const isAdmin = user?.email === 'juanfe13lasso@gmail.com';

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] h-16 bg-black/60 backdrop-blur-xl border-b border-white/5 px-6 lg:px-16 flex items-center justify-between">
      {/* BRANDING_BLOCK */}
      <div className="flex items-center gap-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="text-sm font-black tracking-[0.5em] text-[#F3F4F6] transition-all group-hover:text-[#CCFF00]">
            KROM.SYS
          </span>
          {user && !loading && (
            <div className="flex items-center gap-2 px-2 py-0.5 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-sm">
              <div className="w-1 h-1 bg-[#CCFF00] rounded-full animate-pulse shadow-[0_0_5px_#CCFF00]" />
              <span className="text-[7px] font-mono text-[#CCFF00] uppercase tracking-widest">System_Online</span>
            </div>
          )}
        </Link>

        {/* PERSISTENT_LINKS (Only shown when not syncing) */}
        {!loading && (
          <div className="hidden md:flex items-center gap-8 font-mono text-[10px] uppercase tracking-[0.3em]">
            <Link href="/catalog" className="text-white/40 hover:text-[#CCFF00] transition-colors">Catalog</Link>
            <Link href="/underground" className="text-white/40 hover:text-[#CCFF00] transition-colors">Underground</Link>
          </div>
        )}
      </div>

      {/* IDENTITY_AND_ACTIONS */}
      <div className="flex items-center gap-6 lg:gap-10">
        {loading ? (
          /* SYNCING_STATE */
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 border border-[#CCFF00]/30 border-t-[#CCFF00] rounded-full animate-spin" />
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.4em] animate-pulse">
              System_Sync...
            </span>
          </div>
        ) : (
          /* AUTH_STATE_RESOLVED */
          <>
            {user ? (
              <div className="flex items-center gap-6 lg:gap-8 font-mono text-[10px] uppercase tracking-[0.3em]">
                {isAdmin && (
                  <Link href="/nexus-command" className="text-[#CCFF00] hover:brightness-125 transition-all flex items-center gap-2">
                    <Zap size={10} />
                    Nexus
                  </Link>
                )}
                <Link href="/account" className="text-white/60 hover:text-white transition-colors">
                  My_Account
                </Link>
              </div>
            ) : (
              <Link href="/login">
                <GlitchButton text="ACCESS" className="text-[9px] py-1.5 px-6" />
              </Link>
            )}
          </>
        )}

        {/* GLOBAL_CART (Always visible once sync is complete) */}
        {!loading && (
          <button 
            onClick={toggleCart}
            className="relative group p-1"
          >
            <ShoppingBag className="w-5 h-5 text-[#F3F4F6] group-hover:text-[#CCFF00] transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center bg-[#CCFF00] text-black text-[9px] font-black rounded-full shadow-[0_0_10px_#CCFF00]">
                {itemCount}
              </span>
            )}
          </button>
        )}
      </div>
    </nav>
  );
}
