"use client";

import React from 'react';
import HeroScrollytelling from '../components/HeroScrollytelling';
import { useCartStore } from '../store/useCartStore';

/**
 * HOME_PAGE: The Premium Cyber-Noir Landing
 * Integrates the high-end 3D Scrollytelling Hero.
 */
export default function HomePage() {
  const toggleCart = useCartStore((s) => s.toggleCart);

  return (
    <main className="min-h-screen bg-[#000000] text-[#F3F4F6]">
      {/* 3D SCROLLYTELLING HERO */}
      <HeroScrollytelling />

      {/* ADDITIONAL CONTENT SECTION (Optional) */}
      <section className="relative py-32 px-12 lg:px-24 flex flex-col items-center justify-center text-center bg-black border-t border-white/5">
         <div className="max-w-4xl">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8">
              MODULAR_SYSTEMS
            </h2>
            <p className="text-sm md:text-lg font-mono text-white/40 uppercase tracking-widest leading-relaxed">
              Engineered for high-intensity industrial survival. <br />
              KROM.SYS provides the most advanced tactical deployment systems <br />
              for the next age of urban evolution.
            </p>
         </div>

         {/* Visual Scanline Effect */}
         <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(204,255,0,0.02)_1.5px,transparent_1.5px)] bg-[length:100%_8px] opacity-20" />
      </section>

      {/* GRID DECORATION */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:50px_50px] opacity-30" />
    </main>
  );
}
