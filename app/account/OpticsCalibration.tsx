"use client";

import React, { useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

const COLORS = [
  { name: 'ACID_GREEN', hex: '#CCFF00' },
  { name: 'INFRARED_RED', hex: '#FF003C' },
  { name: 'COBALT_BLUE', hex: '#00F0FF' },
];

export default function OpticsCalibration({ currentSelection }: { currentSelection: string }) {
  const { color, setColor } = useThemeStore();
  const [saving, setSaving] = useState(false);

  const handleCalibration = async (newColor: string) => {
    // 1. Instant UI Feedback
    setColor(newColor);
    setSaving(true);

    try {
      // 2. Background Sync
      await fetch('/api/profile/color', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color: newColor }),
      });
    } catch (err) {
      console.error('SYNC_FAIL:', err);
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

      <div className="flex flex-wrap gap-6">
        {COLORS.map((c) => (
          <button
            key={c.hex}
            onClick={() => handleCalibration(c.hex)}
            className={`group relative flex flex-col items-center gap-3 p-4 border transition-all duration-500 ${
              color === c.hex ? 'border-tactical bg-tactical/5' : 'border-white/5 bg-[#050505] hover:border-white/20'
            }`}
          >
            <div 
              className="w-12 h-12 rounded-full shadow-inner" 
              style={{ backgroundColor: c.hex, boxShadow: color === c.hex ? `0 0 20px ${c.hex}66` : 'none' }} 
            />
            <span className={`text-[8px] font-mono tracking-[0.3em] uppercase ${
              color === c.hex ? 'text-tactical' : 'text-white/20 group-hover:text-white/40'
            }`}>
              {c.name}
            </span>
            
            {color === c.hex && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-tactical rounded-full animate-ping" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
