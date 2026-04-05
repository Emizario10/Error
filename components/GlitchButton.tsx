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
 * GLITCH_BUTTON: Refactored for Cyber-Noir Aesthetic
 * Hollow design, Acid Green border, and ambient neon glow.
 */
export default function GlitchButton({ text, onClick, className = "" }: GlitchButtonProps) {
  const container = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const glitchRef = useRef<HTMLSpanElement>(null);

  const { contextSafe } = useGSAP({ scope: container });

  const handleMouseEnter = contextSafe(() => {
    const tl = gsap.timeline({ repeat: -1 });
    
    // High-frequency color flash and fragment shift
    tl.to(container.current, {
      borderColor: '#FF003C', // Infrared flash
      boxShadow: '0 0 25px rgba(255, 0, 60, 0.4)',
      duration: 0.05,
      repeat: 3,
      yoyo: true,
      ease: "none"
    })
    .to(glitchRef.current, {
      clipPath: () => `inset(${Math.random() * 80}% 0 ${Math.random() * 80}% 0)`,
      x: () => (Math.random() - 0.5) * 20,
      opacity: 0.8,
      duration: 0.08,
    }, 0);

    // Text jitter
    gsap.to(textRef.current, {
      x: () => (Math.random() - 0.5) * 4,
      y: () => (Math.random() - 0.5) * 2,
      duration: 0.04,
      repeat: -1,
      yoyo: true
    });
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.killTweensOf([container.current, textRef.current, glitchRef.current]);
    
    // Reset to base Acid Green hollow state
    gsap.to(container.current, { 
      borderColor: '#CCFF00', 
      boxShadow: '0 0 15px rgba(204, 255, 0, 0.2)',
      duration: 0.3 
    });
    gsap.to(textRef.current, { x: 0, y: 0, duration: 0.2 });
    gsap.to(glitchRef.current, { opacity: 0, duration: 0.2 });
  });

  return (
    <button
      ref={container}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative px-10 py-4 border border-[#CCFF00] bg-transparent transition-all group overflow-hidden ${className}`}
      style={{
        boxShadow: '0 0 15px rgba(204, 255, 0, 0.2)',
      }}
    >
      {/* Main Text */}
      <span 
        ref={textRef}
        className="relative z-10 text-[#CCFF00] font-mono font-bold tracking-[0.3em] uppercase text-sm"
      >
        {text}
      </span>

      {/* Glitch Fragment Layer */}
      <span 
        ref={glitchRef}
        className="absolute inset-0 flex items-center justify-center z-20 text-[#FF003C] font-mono font-bold tracking-[0.3em] uppercase opacity-0 pointer-events-none select-none blur-[1px]"
      >
        {text}
      </span>
      
      {/* Subtle Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(204,255,0,0.05)_50%,transparent_50%)] bg-[length:100%_4px]" />
    </button>
  );
}
