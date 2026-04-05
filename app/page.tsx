"use client";

import React from 'react';
import HeroScrollytelling from '../components/HeroScrollytelling';
import { useCartStore } from '../store/useCartStore';
import { useRouter } from 'next/navigation';
import GlitchButton from '../components/GlitchButton';

/**
 * HOME_PAGE: Refined Pro Aesthetic
 */
export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#000000] text-[#F3F4F6]">
      {/* 3D SCROLLYTELLING HERO */}
      <HeroScrollytelling />

      {/* REFINED CTA OVERLAY (Optional extra push if needed, but Hero already has one) */}
      {/* We ensure the HeroScrollytelling component itself uses the high-end GlitchButton style */}

      {/* MODULAR_SYSTEMS SECTION */}
      <section className="relative py-48 px-12 lg:px-24 flex flex-col items-center justify-center text-center bg-black border-t border-white/5">
         <div className="max-w-4xl z-10">
            <span className="text-[#CCFF00] font-mono text-[10px] tracking-[0.8em] uppercase opacity-40 mb-6 block">
              [ Core.Architecture ]
            </span>
            <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-12 leading-none">
              MODULAR<br />DEPLOYMENT
            </h2>
            <p className="text-sm md:text-base font-mono text-white/30 uppercase tracking-[0.3em] leading-loose max-w-2xl mx-auto mb-16">
              KROM.SYS provides advanced tactical hardware calibrated for the next age of industrial survival.
            </p>
            
            <GlitchButton 
              text="START_EXTRACTION" 
              className="px-16 py-6 text-lg" 
              onClick={() => router.push('/catalog')}
            />
         </div>

         {/* Tech-Noir Grid */}
         <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:40px_40px] opacity-40" />
      </section>
    </main>
  );
}
