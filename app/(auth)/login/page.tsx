"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GlitchButton from '@/components/GlitchButton';
import { createClient } from '@/utils/supabase/client';

/**
 * LOGIN_PORTAL: Operative Entry Point.
 * Split-screen industrial design with Acid Green accents.
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      router.push('/account');
      router.refresh();
    } catch (err: any) {
      console.error('LOGIN_FAIL:', err);
      setError(err.message?.toUpperCase() || 'AUTHENTICATION_FAILED');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row relative overflow-hidden">
      {/* CRT SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_3px,3px_100%] opacity-20" />

      {/* LEFT: SYSTEM STATUS (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-[#050505] border-r border-white/5 flex-col justify-between p-12 relative">
        <div className="space-y-8 relative z-10">
          <div className="border-l-2 border-[#CCFF00] pl-6">
            <h2 className="text-sm font-mono text-[#CCFF00] tracking-[0.5em] uppercase">System.Status</h2>
            <p className="text-[10px] font-mono text-white/30 uppercase mt-2">KROM_OS // NODE_0x77AF</p>
          </div>
          
          <div className="space-y-4 font-mono text-[9px] text-white/20 uppercase leading-loose tracking-widest">
            <p className="text-[#CCFF00]/40">[ 0.0034s ] Establishing handshaking protocol...</p>
            <p>[ 0.0122s ] Bypassing standard firewalls...</p>
            <p>[ 0.0455s ] Syncing vault descriptors...</p>
            <p className="text-[#CCFF00]/40">[ 0.0891s ] Hardware decryption: STANDBY</p>
          </div>
        </div>

        <div className="relative z-10 opacity-10">
           <span className="text-[60px] font-black text-white tracking-tighter leading-none uppercase">KROM<br/>SYS</span>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:30px_30px] opacity-40" />
      </div>

      {/* RIGHT: AUTH FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-sm space-y-12 relative z-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">OPERATIVE_LOGIN</h1>
            <p className="font-mono text-[10px] text-[#CCFF00] tracking-[0.3em] uppercase opacity-60">
              [ SECURE_ACCESS_PORTAL ]
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-10">
            <div className="space-y-6">
              <input 
                required type="email" placeholder="EMAIL_IDENTITY..."
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 p-3 font-mono text-xs text-[#CCFF00] placeholder:text-white/10 focus:outline-none focus:border-[#CCFF00] transition-all uppercase tracking-widest"
              />
              <input 
                required type="password" placeholder="SECURITY_CIPHER..."
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 p-3 font-mono text-xs text-[#CCFF00] placeholder:text-white/10 focus:outline-none focus:border-[#CCFF00] transition-all uppercase tracking-widest"
              />
            </div>

            {error && (
              <div className="p-4 border border-[#FF003C]/30 bg-[#FF003C]/5 font-mono text-[9px] text-[#FF003C] tracking-widest uppercase animate-pulse">
                ERR: {error}
              </div>
            )}

            <div className="space-y-6">
              <GlitchButton text={loading ? "DECRYPTING..." : "AUTHENTICATE"} className="w-full py-4" />
              <div className="flex justify-between items-center px-2">
                <Link href="/register" className="text-[9px] font-mono text-white/30 hover:text-[#CCFF00] uppercase tracking-widest transition-colors">
                  [ New_Operative? ]
                </Link>
                <span className="text-[9px] font-mono text-white/10 uppercase tracking-[0.5em]">KROM.SYS_v2.4</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
