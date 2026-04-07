"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import GlitchButton from './GlitchButton';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

/**
 * CART_SIDEBAR: Tactical Rig Interface (Refactored)
 */
export default function CartSidebar() {
  const { items, isOpen, toggleCart, removeItem, totalPrice } = useCartStore();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  const handleInitiateCheckout = async () => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('EXTRACTION_ERR:', data.error);
        setIsRedirecting(false);
      }
    } catch (err) {
      console.error('CHECKOUT_CRITICAL_FAIL:', err);
      setIsRedirecting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-black/95 border-l border-[#333] z-[100] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-[#222] flex items-center justify-between">
              <div>
                <span className="text-tactical font-mono text-[10px] tracking-[0.5em] uppercase opacity-50">
                  Nexus.Inventory
                </span>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  CART_COMMAND
                </h2>
              </div>
              <button onClick={toggleCart} className="text-white/40 hover:text-tactical transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto p-8 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-20">
                  <span className="font-mono text-xs uppercase tracking-widest text-center">
                    // VOID_DETECTED // NO_HARDWARE_LOCKED
                  </span>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex gap-6 group">
                    <div className="relative w-24 h-24 bg-[#0a0a0a] border border-[#222] flex-shrink-0">
                      {item.imageUrl && (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover opacity-80" />
                      )}
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{item.name}</h4>
                        <span className="text-xs font-mono text-tactical">${item.currentPrice.toFixed(2)}</span>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-[9px] font-mono text-[#FF3131] uppercase tracking-widest text-left hover:brightness-125 transition-all"
                      >
                        [ _REMOVE_ITEM ]
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-10 border-t border-[#222] bg-black">
              <div className="flex justify-between items-end mb-8">
                <span className="text-xs font-mono text-white/30 uppercase tracking-[0.3em]">Total_Payload</span>
                <span className="text-3xl font-black text-tactical tracking-tighter">
                  ${totalPrice().toFixed(2)}
                </span>
              </div>
              
              <GlitchButton 
                text={isRedirecting ? "ENCRYPTING_PAYMENT..." : "INITIATE_CHECKOUT"} 
                className="w-full"
                onClick={handleInitiateCheckout}
                disabled={isRedirecting || items.length === 0}
              />
              
              <p className="mt-6 text-[8px] text-white/10 font-mono text-center uppercase tracking-[0.5em]">
                Secure Encryption Active // KROM.SYS
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
