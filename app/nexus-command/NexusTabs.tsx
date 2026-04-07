"use client";

import React, { useState } from 'react';
import { Package, Users, ScrollText, Activity } from 'lucide-react';

interface Props {
  ordersTab: React.ReactNode;
  productsTab: React.ReactNode;
  operativesTab: React.ReactNode;
  logsTab: React.ReactNode;
}

export default function NexusTabs({ ordersTab, productsTab, operativesTab, logsTab }: Props) {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'operatives' | 'logs'>('orders');

  const tabs = [
    { id: 'orders', label: 'EXTRACTION_FEED', icon: Activity },
    { id: 'products', label: 'ARSENAL_MGMT', icon: Package },
    { id: 'operatives', label: 'OPERATIVE_FILES', icon: Users },
    { id: 'logs', label: 'SYSTEM_LOGS', icon: ScrollText },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-px">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 font-mono text-[10px] font-black tracking-[0.2em] transition-all relative group ${
                isActive 
                  ? 'text-tactical border-b-2 border-tactical bg-tactical/5' 
                  : 'text-white/20 hover:text-white/40 hover:bg-white/5'
              }`}
            >
              <tab.icon size={14} strokeWidth={isActive ? 3 : 2} />
              <span>[ {tab.label} ]</span>
              
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-tactical rounded-full animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-[#050505] border border-white/5 p-8 relative overflow-hidden">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]" />
          
          <div className="relative z-10">
            {activeTab === 'orders' && ordersTab}
            {activeTab === 'products' && productsTab}
            {activeTab === 'operatives' && operativesTab}
            {activeTab === 'logs' && logsTab}
          </div>
        </div>
      </div>
    </div>
  );
}
