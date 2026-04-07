"use client";

import React, { useRef, useEffect, useState } from 'react';
import HeroScrollytelling from '../components/HeroScrollytelling';
import { useRouter } from 'next/navigation';
import GlitchButton from '../components/GlitchButton';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    // 1. STAGGERED_SPEC_REVEAL: Restoration of the weighted inertia entry
    gsap.from(".spec-card", {
      scrollTrigger: {
        trigger: ".specs-grid",
        start: "top 85%",
      },
      y: 100,
      opacity: 0,
      rotateX: -20,
      stagger: 0.15,
      duration: 1.2,
      ease: "expo.out"
    });

    // 2. PHILOSOPHY_REVEAL: High-end scale and clarity sync
    gsap.from(".philosophy-title", {
      scrollTrigger: {
        trigger: ".philosophy-section",
        start: "top 80%",
        scrub: 1,
      },
      scale: 0.8,
      opacity: 0,
      y: 100,
    });

    // 3. PILLAR_DECRYPT: Text staggered entry
    gsap.from(".philosophy-pillar", {
      scrollTrigger: {
        trigger: ".philosophy-pillars-grid",
        start: "top 85%",
      },
      opacity: 0,
      x: -30,
      stagger: 0.2,
      duration: 1,
      ease: "power2.out"
    });
  }, { scope: containerRef });

  const techSpecs = [
    { label: 'CORE_MATERIAL', value: 'AEROSPACE TITANIUM G5', detail: 'Maximum strength-to-weight ratio for urban deployment.' },
    { label: 'FINISH_PROTOCOL', value: 'PVD MATTE OBSIDIAN', detail: 'Ultra-thin, scratch-resistant diamond-like carbon coating.' },
    { label: 'SECURITY_LINK', value: 'STRIPE_256_ENCRYPTED', detail: 'Biometric verified extraction gateway for financial security.' },
    { label: 'WEIGHT_CLASS', value: '450g INDUSTRIAL HEAVY', detail: 'Calibrated presence for high-intensity hardware usage.' },
    { label: 'ASSEMBLY', value: 'MODULAR_HITCH_SYSTEM', detail: 'Interchangeable components for tactical versatility.' },
    { label: 'DURABILITY', value: 'SUB-ZERO CERTIFIED', detail: 'Tested at -40°C for extreme environmental resilience.' },
  ];

  return (
    <main ref={containerRef} className="min-h-screen bg-[#000000] text-[#F3F4F6] overflow-x-hidden perspective-1000">
      <HeroScrollytelling />

      {/* TECH_SPECS: DYNAMIC INDUSTRIAL GRID */}
      <section className="relative py-60 px-8 lg:px-24 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 border-l-4 border-tactical pl-10">
            <span className="text-tactical font-mono text-[11px] tracking-[1em] uppercase opacity-50 mb-4 block">
              [ Hardware.Intel // Verified ]
            </span>
            <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
              TECHNICAL<br />SPECIFICATIONS
            </h2>
          </div>

          <div className="specs-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {techSpecs.map((spec: any, i: number) => (
              <div key={i} className="spec-card group relative bg-black p-12 overflow-hidden hover:bg-[#050505] transition-colors duration-500">
                {/* Visual Data Decorations using tactical color */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-tactical transition-colors" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-tactical transition-colors" />
                
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.5em] mb-8 block group-hover:text-tactical/40">
                  ID_{mounted ? Math.random().toString(16).slice(2, 8).toUpperCase() : 'XXXXXX'} // 0{i + 1}
                </span>
                
                <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-3 group-hover:text-tactical transition-colors">
                  {spec.label}
                </h4>
                
                <div className="text-2xl font-black text-white uppercase mb-6 tracking-tight leading-tight group-hover:text-tactical transition-colors">
                  {spec.value}
                </div>
                
                <p className="text-[11px] font-mono text-white/30 leading-relaxed uppercase tracking-widest transition-colors">
                  {spec.detail}
                </p>

                {/* Subtle Hover Glitch Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[linear-gradient(var(--tactical-color)_1px,transparent_1px)] bg-[length:100%_4px] opacity-[0.03]" />
              </div>
            ))}
          </div>
        </div>

        {/* Ambient Noise Background */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:50px_50px] opacity-30" />
      </section>

      {/* BRAND PHILOSOPHY: DYNAMIC REVEAL */}
      <section className="philosophy-section relative py-80 px-8 lg:px-24 flex flex-col items-center justify-center text-center bg-black overflow-hidden border-t border-white/5">
        <div className="max-w-7xl z-10 w-full">
          <span className="text-tactical font-mono text-[11px] tracking-[1.2em] uppercase opacity-40 mb-16 block">
            [ Operation.Manifesto ]
          </span>
          
          <div className="relative mb-32">
            <h2 className="philosophy-title text-7xl md:text-[14rem] font-black uppercase tracking-tighter leading-[0.75] text-white">
              WEAR_THE<br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--tactical-color)' }}>FUTURE</span>
            </h2>
            {/* Dynamic Glow Behind Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-tactical/5 blur-[120px] -z-10 rounded-full" />
          </div>

          <div className="philosophy-pillars-grid grid grid-cols-1 md:grid-cols-3 gap-20 text-left border-t border-white/10 pt-24">
            {[
              { id: '01', title: 'PURE_BRUTALISM', content: 'KROM.SYS rejects the soft. We embrace the industrial, the raw, and the uncompromising.' },
              { id: '02', title: 'FULL_ANONYMITY', content: 'Our optics are engineered for the shadows. 99.9% opacity protocols for operatives.' },
              { id: '03', title: 'URBAN_EVOLUTION', content: 'Tactical deployment gear calibrated for the next urban age. Deploy or be deployed.' }
            ].map((pillar: any) => (
              <div key={pillar.id} className="philosophy-pillar space-y-6">
                <span className="text-tactical font-mono text-[10px] uppercase tracking-[0.5em] font-bold block mb-4">
                  {pillar.id} // {pillar.title}
                </span>
                <p className="text-[13px] font-mono text-white/40 uppercase leading-loose tracking-[0.15em]">
                  {pillar.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-32">
            <GlitchButton 
              text="START_EXTRACTION_SEQUENCE" 
              className="px-24 py-8 text-xl tracking-[0.5em]" 
              onClick={() => router.push('/catalog')}
            />
          </div>
        </div>

        {/* Cinematic Scanning Line */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(var(--tactical-color)_2px,transparent_2px)] bg-[length:100%_16px] opacity-[0.02]" />
      </section>

      <div className="fixed inset-0 pointer-events-none -z-20 bg-[radial-gradient(#111_1.5px,transparent_0)] bg-[length:80px_80px] opacity-40" />
    </main>
  );
}
