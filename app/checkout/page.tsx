"use client";

import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import GlitchButton from '@/components/GlitchButton';
import { useRouter } from 'next/navigation';

/**
 * CHECKOUT_PAGE: Pre-extraction Review Portal
 */
export default function CheckoutPage() {
  const { items, totalPrice } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      router.push('/catalog');
    }
  }, [items, isProcessing, router]);

  async function handleExtraction() {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('EXTRACTION_LINK_FAIL');
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  }

  if (items.length === 0 && !isProcessing) return null;

  return (
    <div className="min-h-screen bg-black pt-40 pb-20 px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="border-l-2 border-[#CCFF00] pl-8 mb-16">
          <span className="text-[#CCFF00] font-mono text-[10px] tracking-[0.8em] uppercase opacity-50 block mb-2">
            Order.Validation
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
            CHECKOUT_SUMMARY
          </h1>
        </div>

        {/* List */}
        <div className="space-y-6 mb-16">
          {items.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex justify-between items-center py-4 border-b border-white/5">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">{item.name}</h4>
                <p className="text-[10px] font-mono text-white/30 uppercase mt-1">[ Hardware_Locked ]</p>
              </div>
              <span className="font-mono text-sm text-[#CCFF00]">${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between items-end mb-16 p-8 bg-[#050505] border border-white/5">
          <div>
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em]">Total_Payload_Value</span>
            <div className="text-4xl font-black text-white mt-2 tracking-tighter">
              ${totalPrice().toFixed(2)}
            </div>
          </div>
          <div className="text-right">
             <span className="text-[8px] font-mono text-[#CCFF00] uppercase tracking-widest block mb-1">
                // System_Status
             </span>
             <span className="text-[10px] font-mono text-white/40 uppercase">Ready_For_Extraction</span>
          </div>
        </div>

        {/* Action */}
        <GlitchButton 
          text={isProcessing ? "PROCESSING_SEQUENCE..." : "INITIATE_STRIPE_EXTRACTION"} 
          className="w-full py-6 text-lg"
          onClick={handleExtraction}
        />

        {/* Visual Decoration */}
        <div className="mt-12 flex justify-center opacity-10">
           <span className="font-mono text-[8px] text-white tracking-[1.5em] uppercase">
              Encrypted.Portal // redirecting
           </span>
        </div>
      </div>

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:40px_40px] opacity-40" />
    </div>
  );
}
