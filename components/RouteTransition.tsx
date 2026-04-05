"use client";

import React, { useRef, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

/**
 * ROUTE_TRANSITION: "Fractured Reality"
 * Simulates a hardware glitch/shattering effect during navigation.
 */
export default function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const shardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && displayChildren !== children) {
      const tl = gsap.timeline({
        onComplete: () => {
          setDisplayChildren(children);
          exitAnimation();
        }
      });

      // 1. Enter Animation: Shards fracture inward
      tl.to(overlayRef.current, { opacity: 1, duration: 0.1 })
        .fromTo(".shard", 
          { scale: 0, rotation: 45, opacity: 0 },
          { 
            scale: 1.5, 
            rotation: 0, 
            opacity: 1, 
            duration: 0.4, 
            stagger: { amount: 0.3, from: "random" },
            ease: "expo.out"
          }
        )
        // Neon flash
        .to(".shard", { 
          backgroundColor: (i) => i % 2 === 0 ? "#CCFF00" : "#FF003C",
          duration: 0.05,
          repeat: 3,
          yoyo: true
        });
    }
  }, [children, pathname]);

  const exitAnimation = () => {
    gsap.timeline()
      .to(".shard", {
        x: () => (Math.random() - 0.5) * 1000,
        y: () => (Math.random() - 0.5) * 1000,
        rotation: () => Math.random() * 360,
        opacity: 0,
        duration: 0.6,
        ease: "power4.in",
        stagger: 0.02
      })
      .to(overlayRef.current, { opacity: 0, duration: 0.3 }, "-=0.4");
  };

  // Generate 20 random shards
  const shards = Array.from({ length: 24 }).map((_, i) => (
    <div
      key={i}
      className="shard absolute bg-black border border-[#CCFF00]/30"
      style={{
        width: `${Math.random() * 30 + 10}vw`,
        height: `${Math.random() * 30 + 10}vh`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        clipPath: `polygon(${Math.random()*100}% ${Math.random()*100}%, ${Math.random()*100}% ${Math.random()*100}%, ${Math.random()*100}% ${Math.random()*100}%)`,
        zIndex: 50 + i,
      }}
    />
  ));

  return (
    <>
      <div 
        ref={overlayRef} 
        className="fixed inset-0 z-[100] pointer-events-none opacity-0 bg-black"
      >
        <div ref={shardsRef} className="relative w-full h-full overflow-hidden">
          {mounted && shards}
        </div>
      </div>
      {displayChildren}
    </>
  );
}
