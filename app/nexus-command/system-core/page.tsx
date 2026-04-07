"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ShieldAlert, Cpu, HardDrive, Zap } from 'lucide-react';

/**
 * SYSTEM_CORE: Tactical Infrastructure Visualizer.
 * Replaces legacy login with real-time hardware telemetry (Aesthetic).
 */
export default function SystemCorePage() {
  const [load, setLoad] = useState(42);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setLoad(Math.floor(Math.random() * (65 - 30) + 30));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const coreMetrics = [
    { label: 'CPU_ARRAY_LOAD', value: `${load}%`, icon: Cpu, color: 'text-tactical' },
    { label: 'MEMORY_ENCRYPTION', value: '99.2%', icon: Activity, color: 'text-white' },
    { label: 'VAULT_INTEGRITY', value: 'STABLE', icon: ShieldAlert, color: 'text-blue-400' },
    { label: 'NEURAL_LINK_NODE', value: '0x77AF', icon: Zap, color: 'text-tactical' },
  ];

  return (
    <main className="min-h-screen bg-black text-[#E8E8E8] p-8 lg:p-24 relative overflow-hidden">
      {/* CRT SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_3px,3px_100%] opacity-20" />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white">
              SYSTEM_CORE // <span className="text-tactical">HARDWARE_HEALTH</span>
            </h1>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] mt-2">
              Monitoring node: decentralized_vault_alpha
            </p>
          </div>
          <button 
            onClick={() => router.push('/nexus-command')}
            className="text-[10px] font-mono text-tactical border border-tactical/30 px-4 py-2 hover:bg-tactical/5 transition-all"
          >
            [ RETURN_TO_NEXUS ]
          </button>
        </div>

        {/* Real-time Telemetry */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreMetrics.map((m: any, i: number) => (
            <div key={i} className="bg-[#050505] border border-white/5 p-6 space-y-4">
              <m.icon size={18} className={m.color} />
              <div>
                <span className="text-[9px] font-mono text-white/40 uppercase block mb-1">{m.label}</span>
                <span className="text-2xl font-black text-white">{m.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Matrix/Grid Terminal */}
        <div className="bg-[#050505] border border-white/5 p-10 font-mono text-[10px] space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-4 text-tactical mb-6">
            <HardDrive size={16} />
            <span className="font-black uppercase tracking-widest">ENCRYPTED_DATA_STREAM</span>
          </div>
          
          <div className="grid grid-cols-8 gap-2 opacity-20">
            {[...Array(64)].map((_: any, i: number) => (
              <div key={i} className="h-1 bg-tactical animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>

          <div className="text-white/40 leading-loose uppercase">
            {`> INITIALIZING KERNEL... SUCCESS`} <br />
            {`> VERIFYING VAULT PERMISSIONS... GRANTED`} <br />
            {`> SCANNING ARSENAL_STOCK... 100%`} <br />
            {`> SHIELD_PROTOCOL: ACTIVE`} <br />
            <span className="text-tactical">{`> SYSTEM_CONSCIOUSNESS: ONLINE`}</span>
          </div>
        </div>
      </div>

      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:40px_40px] opacity-40" />
    </main>
  );
}
