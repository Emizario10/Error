"use client";

import React from 'react';
import { Terminal } from 'lucide-react';

type LogRecord = {
  id: string;
  type: string;
  amount: number;
  createdAt: string | Date;
  profile: {
    username: string;
  };
};

type Props = {
  logs: LogRecord[];
};

export default function LogFeed({ logs }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-tactical/20 pb-4">
        <Terminal size={18} className="text-tactical" />
        <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">
          SYSTEM_BOOT_LOG // KERNEL_EVENTS
        </h3>
      </div>

      <div className="bg-black border border-tactical/10 p-6 font-mono text-[10px] leading-relaxed overflow-hidden relative">
        {/* Matrix Scanline */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(204,255,0,0.02)_1px,transparent_1px)] bg-[length:100%_4px]" />
        
        <div className="space-y-2 relative z-10 max-h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-tactical/20">
          {logs.length === 0 ? (
            <div className="text-white/20 italic uppercase tracking-widest py-20 text-center">
              [ NO_SYSTEM_EVENTS_RECORDED ]
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex gap-4 group">
                <span className="text-white/20 whitespace-nowrap">
                  [{new Date(log.createdAt).toISOString().replace('T', ' ').split('.')[0]}]
                </span>
                <span className="text-white/40 whitespace-nowrap">
                  OP_{log.profile.username.toUpperCase()}
                </span>
                <span className="text-white/10">|</span>
                <span className={`font-bold ${
                  log.type === 'PURCHASE' ? 'text-blue-400' : 
                  log.type === 'EASTER_EGG_KROM' ? 'text-purple-400' : 
                  'text-tactical'
                }`}>
                  {log.type}
                </span>
                <span className="text-white/10">|</span>
                <span className={log.amount >= 0 ? 'text-tactical' : 'text-red-500'}>
                  {log.amount >= 0 ? '+' : ''}{log.amount}_XP
                </span>
                
                {/* Visual cursor effect on hover */}
                <div className="hidden group-hover:block w-1 h-3 bg-tactical ml-2 animate-pulse" />
              </div>
            ))
          )}
          
          <div className="pt-4 text-tactical/40 animate-pulse uppercase tracking-[0.5em]">
            {">"} LISTENING_FOR_NEW_INTELLIGENCE...
          </div>
        </div>
      </div>
    </div>
  );
}
