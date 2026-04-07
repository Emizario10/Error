"use client";

import React from 'react';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    basePrice: number;
    currentPrice: number;
    imageUrl: string | null;
    category: string | null;
    heatLevel: number;
  };
  clearanceLevel: number;
}

/**
 * PRODUCT_CARD: Tactical hardware display unit.
 * Features heat-responsive micro-interactions and conditional pricing.
 */
export default function ProductCard({ product: p, clearanceLevel }: ProductCardProps) {
  const isHighHeat = p.heatLevel > 2;
  const isSurplus = p.heatLevel === 0;
  const hasPriceHike = p.currentPrice > p.basePrice;

  // Calculate red glow intensity based on heatLevel (max 10px blur)
  const glowIntensity = Math.min(p.heatLevel * 2, 10);

  return (
    <div className="group relative flex flex-col bg-black border border-white/5 transition-all duration-700 hover:border-tactical/40">
      {/* Product Frame: 4:5 Aspect Ratio */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#050505]">
        {p.imageUrl ? (
          <Image 
            src={p.imageUrl} 
            alt={p.name}
            fill
            className="object-cover opacity-70 grayscale-[30%] group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white/5 uppercase tracking-[1em] font-mono">
            VOID_DATA
          </div>
        )}
        
        {/* Visual Glitch & Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(204,255,0,0.03)_1.5px,transparent_1.5px)] bg-[length:100%_6px] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        
        {/* SCANLINE_ANIMATION (Heat Response) */}
        {p.heatLevel > 0 && (
          <motion.div 
            animate={{ top: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-tactical/5 to-transparent pointer-events-none z-10"
          />
        )}

        {/* Tactical Category Tag */}
        <div className="absolute top-6 left-6 px-3 py-1 border border-tactical/40 bg-black/80 backdrop-blur-md z-20">
           <span className="text-[9px] font-mono text-tactical tracking-[0.3em] uppercase font-bold">
            {p.category || 'GENERIC'}
           </span>
        </div>

        {/* Heat Badges */}
        <div className="absolute top-6 right-6 z-20">
          {isHighHeat && (
            <span className="text-[7px] font-mono text-[#FF3131] border border-[#FF3131]/30 bg-black/80 px-2 py-0.5 tracking-tighter font-bold">
              [ ▲ HIGH_HEAT ]
            </span>
          )}
          {isSurplus && (
            <span className="text-[7px] font-mono text-[#CCFF00] border border-[#CCFF00]/30 bg-black/80 px-2 py-0.5 tracking-tighter font-bold">
              [ ▼ SURPLUS ]
            </span>
          )}
        </div>
      </div>

      {/* Hardware Specifications Panel */}
      <div className="p-8 flex flex-col flex-grow border-t border-white/5">
        <div className="flex justify-between items-baseline mb-6">
          <h3 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-tactical transition-colors duration-500">
            {p.name}
          </h3>
          
          {/* CONDITIONAL PRICING (OPERATOR_BYPASS) */}
          <div className="flex flex-col items-end">
            {clearanceLevel < 3 && (
              <span 
                className="font-mono text-sm text-[#F3F4F6] font-black tracking-tight"
                style={{ 
                  textShadow: hasPriceHike ? `0 0 ${glowIntensity}px rgba(255, 49, 49, 0.8)` : 'none',
                  color: hasPriceHike ? '#FF3131' : '#F3F4F6'
                }}
              >
                ${p.currentPrice.toFixed(2)}
              </span>
            )}

            {clearanceLevel >= 3 && clearanceLevel < 5 && (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-white/50 line-through">
                    ${p.basePrice.toFixed(2)}
                  </span>
                  <span className="font-mono text-sm text-[#CCFF00] font-black tracking-tight">
                    ${p.currentPrice.toFixed(2)}
                  </span>
                </div>
                <span className="text-[7px] font-mono text-[#CCFF00] tracking-widest mt-1">[ L3_DISCOUNT ]</span>
              </>
            )}

            {clearanceLevel >= 5 && (
              <>
                <span className="font-mono text-sm text-[#00F0FF] font-black tracking-tight">
                  ${p.basePrice.toFixed(2)}
                </span>
                <span className="text-[7px] font-mono text-[#00F0FF] tracking-widest mt-1 animate-pulse">[ L5_OVERRIDE ]</span>
              </>
            )}
          </div>
        </div>
        
        <p className="text-[11px] text-white/40 font-mono uppercase tracking-[0.2em] leading-relaxed line-clamp-2 mb-8 h-10">
          {p.description || '// HARDWARE_DESCRIPTION_MISSING'}
        </p>

        <div className="mt-auto">
          <AddToCartButton 
            product={{
              ...p,
              currentPrice: clearanceLevel >= 5 ? p.basePrice : p.currentPrice
            }} 
            className="w-full text-[10px] py-3 tracking-[0.4em]" 
          />
        </div>
      </div>

      {/* Tech Corner Accent */}
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-tactical opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100" />
    </div>
  );
}
