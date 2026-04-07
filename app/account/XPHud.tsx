"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';
import { useSystemStore } from '@/store/useSystemStore';

interface XPHudProps {
  xp: number;
  clearanceLevel: number;
}

/**
 * XP_HUD: Visual Progression Interface.
 * Displays rank, total XP, and a tactical progress bar.
 */
export default function XPHud({ xp, clearanceLevel }: XPHudProps) {
  const { addMessage } = useSystemStore();
  const prevLevel = React.useRef(clearanceLevel);

  React.useEffect(() => {
    if (clearanceLevel > prevLevel.current) {
      addMessage("[!] CLEARANCE_LEVEL_INCREASED. New tactical optics unlocked in your profile.", "SECURITY");
      prevLevel.current = clearanceLevel;
    }
  }, [clearanceLevel, addMessage]);

  // Logic: 200 XP per level
  const xpIntoCurrentLevel = xp % 200;
  const progressPercentage = (xpIntoCurrentLevel / 200) * 100;
  const nextLevelXP = 200 - xpIntoCurrentLevel;

  return (
    <div className="bg-[#050505] border border-white/5 p-8 relative overflow-hidden group">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-tactical/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-tactical/10 transition-colors duration-700" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        {/* Rank & Stats */}
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 border-2 border-tactical rounded-full flex items-center justify-center shadow-[0_0_20px_var(--tactical-color)] bg-black/50">
            <Shield className="text-tactical w-8 h-8" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-white uppercase tracking-tighter">
                [ L{clearanceLevel} OPERATOR ]
              </span>
              <span className="text-[10px] font-mono text-tactical bg-tactical/10 border border-tactical/20 px-2 py-0.5 uppercase font-bold tracking-widest">
                VERIFIED
              </span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
              <span className="flex items-center gap-1.5 text-white/60">
                <Zap size={10} className="text-tactical" />
                TOTAL_XP: {xp}
              </span>
              <span>// NEXT_LEVEL_IN: {nextLevelXP} XP</span>
            </div>
          </div>
        </div>

        {/* Progress System */}
        <div className="flex-grow max-w-md space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">Clearance_Progression</span>
            <span className="text-[10px] font-mono text-tactical font-black">{progressPercentage.toFixed(0)}%</span>
          </div>
          
          <div className="h-2 w-full bg-white/5 border border-white/5 relative overflow-hidden">
            {/* Background segments */}
            <div className="absolute inset-0 flex">
              {[...Array(10)].map((_: any, i: number) => (
                <div key={i} className="flex-grow border-r border-white/5 last:border-0" />
              ))}
            </div>
            
            {/* The actual progress bar */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 bg-tactical shadow-[0_0_15px_var(--tactical-color)]"
            />
            
            {/* Scanning light effect */}
            <motion.div 
              animate={{ 
                left: ['-100%', '100%']
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
          </div>
        </div>
      </div>

      {/* Tech Corner Accent */}
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white/20" />
    </div>
  );
}
