"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * EASTER_EGG_LISTENER: Global "KROM" sequence detector.
 * Rewards users with XP and a heavy visual glitch on successful breach.
 */
export default function EasterEggListener() {
  const [sequence, setSequence] = useState<string>('');
  const [isGlitching, setIsGlitching] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // SILENT_STABILITY_FIX
      const key = e.key?.toLowerCase();
      if (!key) return;
      
      // We only care about letters
      if (!/^[a-z]$/.test(key)) return;

      setSequence(prev => {
        const newSeq = (prev + key).slice(-4);
        
        if (newSeq === 'krom') {
          triggerBreach();
          return '';
        }
        return newSeq;
      });

      // Clear sequence if user stops typing for 2 seconds
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setSequence(''), 2000);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const triggerBreach = async () => {
    try {
      // 1. TRIGGER VISUAL GLITCH & SHAKE
      setIsGlitching(true);
      setIsShaking(true);
      setTimeout(() => setIsGlitching(false), 800);
      setTimeout(() => setIsShaking(false), 200); // 200ms shake as requested

      // 2. CALL VAULT API
      const response = await fetch('/api/easter-egg/krom', {
        method: 'POST',
      });
      
      const data = await response.json();

      if (data.success) {
        setMessage(`[!] KROM_PROTOCOL_ACTIVATED: +100 XP`);
      } else if (data.message === 'BREACH_ALREADY_LOGGED') {
        setMessage('[ ERROR: NODE_ALREADY_BREACHED ]');
      } else {
        setMessage('[ ERROR: BREACH_UNAUTHORIZED ]');
      }
      
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.error('BREACH_FAIL:', err);
      setIsGlitching(false);
      setIsShaking(false);
    }
  };

  return (
    <>
      {/* SHAKE_EFFECT_OVERLAY */}
      <style jsx global>{`
        @keyframes shake {
          0% { transform: translate(0, 0); }
          25% { transform: translate(5px, -5px); }
          50% { transform: translate(-5px, 5px); }
          75% { transform: translate(5px, 5px); }
          100% { transform: translate(0, 0); }
        }
        .system-shake {
          animation: shake 0.1s infinite;
        }
      `}</style>

      {isShaking && (
        <div className="fixed inset-0 z-[-1] pointer-events-none system-shake" />
      )}

      <AnimatePresence>
        {isGlitching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0.8, 1, 0.5, 1, 0],
              x: [0, -10, 10, -5, 5, 0],
              filter: [
                'invert(0) contrast(100%)',
                'invert(1) contrast(300%) hue-rotate(90deg)',
                'invert(0) contrast(100%)',
                'invert(1) contrast(500%) sepia(1)',
                'invert(0) contrast(100%)'
              ]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "linear" }}
            className="fixed inset-0 z-[9999] pointer-events-none bg-white mix-blend-difference flex items-center justify-center"
          >
            {/* OVERRIDE MESSAGE */}
            <div className="bg-black text-tactical font-mono text-xl md:text-3xl font-black px-12 py-6 border-4 border-tactical shadow-[0_0_100px_var(--tactical-color)] uppercase tracking-tighter italic">
              {">>"} KROM_PROTOCOL: OVERRIDING_VAULT_PERMISSIONS_100%
            </div>

            {/* Overlay Noise */}
            <div className="absolute inset-0 opacity-30 bg-[url('https://media.giphy.com/media/oEI9uWUicGLeE/giphy.gif')] bg-repeat -z-10" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] pointer-events-none"
          >
            <div className="bg-black border-2 border-tactical px-10 py-5 shadow-[0_0_50px_var(--tactical-color)] flex flex-col items-center gap-3 backdrop-blur-xl bg-opacity-90">
              <span className="text-tactical font-mono text-sm font-black tracking-[0.3em] uppercase animate-pulse">
                {message}
              </span>
              <div className="w-full h-[2px] bg-tactical" />
              <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">
                // SYSTEM_INTEGRITY_COMPROMISED //
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
