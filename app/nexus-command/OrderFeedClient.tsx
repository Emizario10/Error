"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Package, ExternalLink, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GlitchButton from '@/components/GlitchButton';
import Image from 'next/image';

interface OrderFeedClientProps {
  orders: any[];
}

/**
 * ORDER_FEED_CLIENT: Interactive Command Interface.
 * Handles expandable extractions and system re-validation.
 */
export default function OrderFeedClient({ orders }: OrderFeedClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();

  const toggleRow = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-12">
      {/* ACTION_BAR */}
      <div className="flex justify-between items-center border-b border-white/5 pb-8">
        <div className="flex flex-col">
          <span className="text-tactical font-mono text-[10px] tracking-[0.4em] uppercase">
            Live.Data.Stream
          </span>
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">
            EXTRACTION_FEED
          </h3>
        </div>
        
        <GlitchButton 
          text="REFRESH_SYSTEM" 
          className="text-[10px] py-2 px-6"
          onClick={() => router.refresh()}
        />
      </div>

      {/* FEED_LIST */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="py-20 border border-dashed border-[#222] text-center">
            <span className="font-mono text-xs text-white/20 uppercase tracking-widest">
              // NO_EXTRACTIONS_DETECTED_IN_BUFFER
            </span>
          </div>
        ) : (
          orders.map((order: any) => (
            <div 
              key={order.id}
              className={`bg-black border transition-all duration-500 ${
                expandedId === order.id ? 'border-tactical/40' : 'border-white/5 hover:border-white/10'
              }`}
            >
              {/* ORDER_ROW_HEADER */}
              <div 
                onClick={() => toggleRow(order.id)}
                className="p-6 flex items-center justify-between cursor-pointer"
              >
                <div className="grid grid-cols-4 flex-grow items-center gap-8">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">ID_SEGMENT</span>
                    <span className="text-[10px] font-mono text-white/60 truncate max-w-[120px]">
                      {order.id.split('-')[0]}...{order.id.split('-').pop()}
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">PAYLOAD_VALUE</span>
                    <span className="text-xs font-bold text-tactical">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">STATUS_LOG</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'COMPLETED' ? 'text-tactical' : 'text-[#FF3131]'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">TIMESTAMP</span>
                    <span className="text-[10px] font-mono text-white/40 uppercase">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="ml-8 text-white/20">
                  {expandedId === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* EXPANDED_INTEL */}
              {expandedId === order.id && (
                <div className="px-8 pb-8 pt-4 border-t border-white/5 bg-[#050505]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Item List */}
                    <div className="space-y-4">
                      <span className="text-[8px] font-mono text-tactical uppercase tracking-[0.4em] mb-4 block">
                        Hardware_Manifest
                      </span>
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 border border-white/5 bg-black">
                          <div className="relative w-12 h-12 bg-[#0a0a0a] flex-shrink-0">
                            {item.product?.imageUrl && (
                              <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover opacity-60" />
                            )}
                          </div>
                          <div className="flex-grow">
                            <h4 className="text-[10px] font-bold text-white uppercase">{item.product?.name || 'Unknown'}</h4>
                            <div className="flex justify-between mt-1">
                              <span className="text-[9px] font-mono text-white/30 uppercase">QTY: {item.quantity}</span>
                              <span className="text-[9px] font-mono text-tactical">${item.unitPrice.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Metadata Intel */}
                    <div className="flex flex-col justify-between">
                      <div className="space-y-4">
                        <span className="text-[8px] font-mono text-tactical uppercase tracking-[0.4em] mb-4 block">
                          Transaction_Intel
                        </span>
                        <div className="p-4 border border-white/5 font-mono text-[9px] text-white/40 space-y-2 uppercase leading-loose">
                          <div>STRIPE_SESSION: {order.stripeSessionId}</div>
                          <div>VAULT_LOCK: ATOMIC_SECURE</div>
                          <div>ENCRYPTION: 256_AES</div>
                        </div>
                      </div>
                      
                      <button className="mt-8 flex items-center gap-2 text-[9px] font-mono text-white/20 hover:text-tactical transition-colors uppercase tracking-widest">
                        <ExternalLink size={12} />
                        View on Stripe Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
