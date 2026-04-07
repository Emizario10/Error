"use client";

import React, { useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { Lock } from 'lucide-react';

const TACTICAL_COLORS = [
  { name: 'ACID_GREEN', hex: '#CCFF00', level: 1 },
  { name: 'COBALT_BLUE', hex: '#00F0FF', level: 2 },
  { name: 'INFRARED_RED', hex: '#FF003C', level: 3 },
  { name: 'ARCHITECT_ORANGE', hex: '#FF8A00', level: 4 },
  { name: 'GHOST_WHITE', hex: '#FFFFFF', level: 5 },
];

interface Props {
  currentSelection: string;
  clearanceLevel: number;
}

export default function OpticsCalibration({ currentSelection, clearanceLevel }: Props) {
  const { color, setColor } = useThemeStore();
  const [saving, setSaving] = useState(false);

  const handleCalibration = async (newColor: string, isLocked: boolean) => {
    if (isLocked || saving) return;

    // 1. OPTIMISTIC UPDATE
    setColor(newColor);
    setSaving(true);

    try {
      // 2. VAULT SYNC
      const res = await fetch('/api/profile/color', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color: newColor }),
      });

      if (!res.ok) {
        throw new Error('CLEARANCE_VIOLATION');
      }
    } catch (err) {
      console.error('SYNC_FAIL:', err);
      // Revert on failure
      setColor(currentSelection);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="flex items-baseline gap-4 border-l-2 border-tactical pl-6">
        <h2 className="text-3xl font-bold text-white uppercase tracking-tight">OPTICS_CALIBRATION</h2>
        <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest font-bold">
          {saving ? '// SYNCING_MANIFEST...' : '// ADJUST_VISUAL_INTERFACE'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {TACTICAL_COLORS.map((c: any) => {
          const isLocked = clearanceLevel < c.level;
          const isActive = color === c.hex;

          return (
            <button
              key={c.hex}
              onClick={() => handleCalibration(c.hex, isLocked)}
              disabled={isLocked}
              title={isLocked ? `[ REQUIRES_CLEARANCE_L${c.level} ]` : c.name}
              className={`group relative flex flex-col items-center gap-3 p-6 border transition-all duration-500 ${
                isActive 
                  ? 'border-tactical bg-tactical/5' 
                  : isLocked 
                    ? 'border-white/5 opacity-40 grayscale cursor-not-allowed' 
                    : 'border-white/5 bg-[#050505] hover:border-white/20'
              }`}
            >
              <div className="relative">
                <div 
                  className="w-12 h-12 rounded-full shadow-inner border border-white/10" 
                  style={{ 
                    backgroundColor: c.hex, 
                    boxShadow: isActive ? `0 0 25px ${c.hex}66` : 'none' 
                  }} 
                />
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                    <Lock size={16} className="text-white" />
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className={`text-[8px] font-mono tracking-[0.3em] uppercase ${
                  isActive ? 'text-tactical' : 'text-white/20'
                }`}>
                  {c.name}
                </span>
                {isLocked && (
                  <span className="text-[7px] font-mono text-white/10 uppercase tracking-tighter">
                    L{c.level}_REQUIRED
                  </span>
                )}
              </div>
              
              {isActive && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-tactical rounded-full animate-ping" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
