"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface CyberSkeletonProps {
  className?: string;
  height?: string | number;
}

/**
 * CYBER_SKELETON: Tactical loading placeholder.
 * Features a high-frequency scanline shimmer.
 */
export default function CyberSkeleton({ className = "", height = "100%" }: CyberSkeletonProps) {
  return (
    <div 
      className={`relative bg-white/5 border border-white/5 overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Scanning Shimmer */}
      <motion.div 
        animate={{ 
          top: ['-100%', '200%']
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute left-0 right-0 h-1/2 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"
      />
      
      {/* Scanline pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,2px_100%]" />
    </div>
  );
}
