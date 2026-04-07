"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface GlitchButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * GLITCH_BUTTON: Refactored for Dynamic Tactical Theme.
 * High-end button that responds to global accent color changes.
 */
export default function GlitchButton({ text, onClick, className = "", disabled = false }: GlitchButtonProps) {
  const container = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const glitchRef = useRef<HTMLSpanElement>(null);

  const { contextSafe } = useGSAP({ scope: container });

  const handleMouseEnter = contextSafe(() => {
    if (disabled) return;
    const tacticalColor = getComputedStyle(document.documentElement).getPropertyValue('--tactical-color').trim();
    const tl = gsap.timeline({ repeat: -1 });
    
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

    gsap.to(textRef.current, {
      x: () => (Math.random() - 0.5) * 4,
      y: () => (Math.random() - 0.5) * 2,
      duration: 0.04,
      repeat: -1,
      yoyo: true
    });
  });

  const handleMouseLeave = contextSafe(() => {
    if (disabled) return;
    const tacticalColor = getComputedStyle(document.documentElement).getPropertyValue('--tactical-color').trim();
    gsap.killTweensOf([container.current, textRef.current, glitchRef.current]);
    
    gsap.to(container.current, { 
      borderColor: tacticalColor, 
      boxShadow: `0 0 15px ${tacticalColor}33`,
      duration: 0.3 
    });
    gsap.to(textRef.current, { x: 0, y: 0, duration: 0.2 });
    gsap.to(glitchRef.current, { opacity: 0, duration: 0.2 });
  });

  return (
    <button
      ref={container}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative px-10 py-4 border border-tactical bg-transparent transition-all group overflow-hidden ${disabled ? "opacity-50 cursor-not-allowed grayscale" : ""} ${className}`}
      style={{
        boxShadow: disabled ? 'none' : '0 0 15px var(--tactical-color)',
      }}
    >
      {/* Main Text */}
      <span 
        ref={textRef}
        className="relative z-10 text-tactical font-mono font-bold tracking-[0.3em] uppercase text-sm"
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
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(var(--tactical-color)_50%,transparent_50%)] bg-[length:100%_4px] opacity-[0.05]" />
    </button>
  );
}
