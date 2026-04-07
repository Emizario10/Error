"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import GlitchButton from '@/components/GlitchButton';
import Image from 'next/image';

/**
 * CANCEL_PAGE: Extraction Aborted.
 */
export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* ABORTED BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop" 
          alt="Extraction Aborted"
          fill
          className="object-cover opacity-5 grayscale invert"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* Visual Hub */}
      <div className="z-10 w-full max-w-xl">
        <div className="w-20 h-20 border-2 border-[#FF3131] rounded-full flex items-center justify-center mx-auto mb-12 shadow-[0_0_30px_rgba(255,49,49,0.4)]">
           <div className="w-10 h-10 bg-[#FF3131] rounded-full opacity-50" />
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8">
          TRANSACTION_ABORTED
        </h1>

        {/* Terminal Feedback */}
        <div className="font-mono text-[10px] md:text-xs text-[#FF3131] bg-black/80 backdrop-blur-md p-8 border border-[#FF3131]/20 text-left mb-12 leading-relaxed uppercase tracking-widest">
          [ SYSTEM_ALERT ] EXTRACTION_SEQUENCE_TERMINATED_BY_USER.<br/>
          // NO_HARDWARE_LOCKED_IN_VAULT //
        </div>

        <GlitchButton 
          text="RETURN_TO_CATALOG" 
          onClick={() => router.push('/catalog')} 
          className="px-12 py-4"
        />
      </div>

      {/* Aesthetic Overlays */}
      <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:40px_40px] opacity-40" />
      <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(255,49,49,0.02)_1px,transparent_1px)] bg-[length:100%_4px]" />
    </div>
  );
}
