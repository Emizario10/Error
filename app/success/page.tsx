"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GlitchButton from '@/components/GlitchButton';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useSystemStore } from '@/store/useSystemStore';

/**
 * SUCCESS_PAGE: Extraction Confirmation (Refined).
 */
export default function SuccessPage() {
  const [text, setText] = useState("");
  const fullText = "DECRYPTING_TRANSACTION... SUCCESS.\nLOAD_BALANCING... STABLE.\nHARDWARE_EXTRACTION_INITIATED.\n[ AUTH_KEY_SENT_TO_COMM_LINK ]\n// TRANSACTION_VERIFIED //";
  const router = useRouter();
  const { clearCart } = useCartStore();
  const { addMessage } = useSystemStore();

  useEffect(() => {
    // 1. CLEAR_TACTICAL_RIG
    clearCart();

    // 2. SYSTEM_CONSCIOUSNESS
    addMessage("[!] EXTRACTION_CONFIRMED. Hardware is being routed through secondary nodes.", "INFO");

    // 3. TERMINAL_FEEDBACK_SEQUENCE
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* VERIFIED INDUSTRIAL BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop" 
          alt="Extraction Success"
          fill
          className="object-cover opacity-10 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* Visual Hub */}
      <div className="z-10 w-full max-w-xl">
        <div className="w-20 h-20 border-2 border-tactical rounded-full flex items-center justify-center mx-auto mb-12 shadow-[0_0_30px_var(--tactical-color)]">
           <div className="w-10 h-10 bg-tactical rounded-full animate-ping" />
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8">
          TRANSACTION_VERIFIED
        </h1>

        {/* Terminal Feedback */}
        <pre className="font-mono text-[10px] md:text-xs text-tactical bg-black/80 backdrop-blur-md p-8 border border-white/10 text-left mb-12 h-40 overflow-hidden leading-relaxed uppercase tracking-widest whitespace-pre-wrap">
          {text}
          <span className="animate-pulse">_</span>
        </pre>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <GlitchButton 
            text="VIEW_ACCOUNT" 
            onClick={() => router.push('/account')} 
            className="px-8 py-4"
          />
          <GlitchButton 
            text="RETURN_TO_ARSENAL" 
            onClick={() => router.push('/catalog')} 
            className="px-8 py-4"
          />
        </div>
      </div>

      {/* Aesthetic Overlays */}
      <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:40px_40px] opacity-40" />
      <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(204,255,0,0.02)_1px,transparent_1px)] bg-[length:100%_4px]" />
    </div>
  );
}
