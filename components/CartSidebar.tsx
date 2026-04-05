"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import GlitchButton from './GlitchButton';
import Image from 'next/image';

/**
 * CART_SIDEBAR: Tactical Rig Interface
 * Features backdrop blur, Acid Green accents, and brutalist controls.
 */
export default function CartSidebar() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getCartTotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />

          {/* Sidebar Rig */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-96 bg-[#050505] border-l border-white/10 z-[100] flex flex-col shadow-[20px_0_50px_rgba(0,0,0,1)]"
          >
            {/* Rig Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[#CCFF00] font-mono text-[10px] tracking-[0.4em] uppercase">
                  System.Inventory
                </span>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                  SYS.CART // RIG
                </h2>
              </div>
              <button 
                onClick={toggleCart}
                className="p-2 hover:bg-[#CCFF00] hover:text-black transition-colors rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inventory Map */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-center">
                    // RIG_EMPTY // NO_HARDWARE_DETECTED
                  </span>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="group relative flex gap-4 p-4 border border-white/5 hover:border-[#CCFF00]/20 transition-all bg-black">
                    {/* Item Viz */}
                    <div className="relative w-20 h-20 bg-[#0a0a0a] border border-white/10">
                      {item.imageUrl && (
                        <Image 
                          src={item.imageUrl} 
                          alt={item.name}
                          fill
                          className="object-cover opacity-80"
                        />
                      )}
                    </div>

                    {/* Item Specs */}
                    <div className="flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-wider line-clamp-1">
                          {item.name}
                        </h4>
                        <span className="text-[10px] font-mono text-[#CCFF00]">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between">
                        {/* Qty Controls */}
                        <div className="flex items-center border border-white/10 text-[10px] font-mono">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-2 py-1 hover:bg-white/5"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 border-x border-white/10">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-2 py-1 hover:bg-white/5"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-white/20 hover:text-[#FF003C] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* RIG Checkout Panel */}
            <div className="p-8 bg-[#080808] border-t border-white/10">
              <div className="flex justify-between mb-6">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  Estimated.Load
                </span>
                <span className="text-xl font-black text-[#CCFF00]">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
              
              <GlitchButton 
                text="CHECKOUT_SEQUENCE" 
                className="w-full" 
                onClick={() => console.log('Initiating checkout...')}
              />
              
              <p className="mt-4 text-[8px] text-white/20 font-mono text-center uppercase tracking-widest leading-loose">
                [ AUTH_ENCRYPTED_LINK ] // [ HARDWARE_LOCK_ENABLED ]
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
