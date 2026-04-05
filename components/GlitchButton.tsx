"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface GlitchButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

/**
 * GLITCH_BUTTON: Premium Cyber-Noir CTA
 * Features Acid Green pulsing glow and high-frequency fragmentation glitch on hover.
 */
export default function GlitchButton({ text, onClick, className = "" }: GlitchButtonProps) {
  const container = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const glitchRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: container });

  const handleMouseEnter = contextSafe(() => {
    const tl = gsap.timeline({ repeat: -1 });
    
    // Rapid color flash and fragment shift
    tl.to(container.current, {
      borderColor: '#FF003C', // Infrared Red
      duration: 0.05,
      repeat: 5,
      yoyo: true,
      ease: "none"
    })
    .to(glitchRef.current, {
      clipPath: `inset(${Math.random() * 50}% 0 ${Math.random() * 50}% 0)`,
      x: () => (Math.random() - 0.5) * 15,
      opacity: 1,
      duration: 0.1,
    }, 0);

    // Main text jitter
    gsap.to(textRef.current, {
      x: () => (Math.random() - 0.5) * 5,
      y: () => (Math.random() - 0.5) * 2,
      duration: 0.05,
      repeat: -1,
      yoyo: true
    });

    // Intense glow pulse
    gsap.to(glowRef.current, {
      opacity: 1,
      scale: 1.2,
      duration: 0.2,
      backgroundColor: '#FF003C'
    });
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.killTweensOf([container.current, textRef.current, glitchRef.current, glowRef.current]);
    
    // Reset to base Acid Green state
    gsap.to(container.current, { borderColor: '#CCFF00', duration: 0.3 });
    gsap.to(textRef.current, { x: 0, y: 0, duration: 0.2 });
    gsap.to(glitchRef.current, { opacity: 0, duration: 0.2 });
    gsap.to(glowRef.current, { opacity: 0.4, scale: 1, backgroundColor: '#CCFF00', duration: 0.3 });
  });

  return (
    <button
      ref={container}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative px-8 py-3 border-2 border-[#CCFF00] bg-transparent transition-colors group overflow-hidden ${className}`}
      style={{
        boxShadow: '0 0 15px rgba(204, 255, 0, 0.2)',
      }}
    >
      {/* Ambient Pulsing Glow Overlay */}
      <div 
        ref={glowRef}
        className="absolute inset-0 bg-[#CCFF00] opacity-20 blur-xl pointer-events-none animate-pulse"
      />

      {/* Main Text */}
      <span 
        ref={textRef}
        className="relative z-10 text-[#F3F4F6] font-mono font-bold tracking-[0.2em] uppercase"
      >
        {text}
      </span>

      {/* Glitch Fragment Layer */}
      <span 
        ref={glitchRef}
        className="absolute inset-0 flex items-center justify-center z-20 text-[#FF003C] font-mono font-bold tracking-[0.2em] uppercase opacity-0 pointer-events-none select-none"
      >
        {text}
      </span>
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </button>
  );
}
