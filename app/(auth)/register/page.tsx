"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GlitchButton from '@/components/GlitchButton';
import { createClient } from '@/utils/supabase/client';

/**
 * REGISTER_PORTAL: Operative Enrollment.
 * Split-screen design with automatic Prisma profile synchronization.
 */
export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. SUPABASE_SIGNUP
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });

      if (authError) {
        if (authError.message.includes('security purposes')) {
          throw new Error("COOLDOWN_ACTIVE: RETRY_AFTER_DELAY");
        }
        throw authError;
      }

      const user = data.user;
      if (!user) throw new Error("ENROLLMENT_LINK_FAILED");

      // 2. VAULT_SYNC: Create operative record in Prisma
      const profileRes = await fetch('/api/profile/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          username: username,
        }),
      });

      if (!profileRes.ok) {
        const errorData = await profileRes.json();
        throw new Error(`VAULT_SYNC_FAILURE: ${errorData.error || 'CONTACT_NEXUS'}`);
      }

      router.push('/account');
      router.refresh();
    } catch (err: any) {
      console.error('REG_FAIL:', err);
      setError(err.message?.toUpperCase() || 'ENROLLMENT_FAILURE');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row relative overflow-hidden">
      {/* CRT SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_3px,3px_100%] opacity-20" />

      {/* LEFT: ENROLLMENT INTEL */}
      <div className="hidden md:flex md:w-1/2 bg-[#050505] border-r border-white/5 flex-col justify-between p-12 relative">
        <div className="space-y-8 relative z-10">
          <div className="border-l-2 border-[#CCFF00] pl-6">
            <h2 className="text-sm font-mono text-[#CCFF00] tracking-[0.5em] uppercase">Enrollment.Protocol</h2>
            <p className="text-[10px] font-mono text-white/30 uppercase mt-2">SECURE_VAULT_INITIATION</p>
          </div>
          
          <div className="space-y-4 font-mono text-[9px] text-white/20 uppercase leading-loose tracking-widest">
            <p>[ DATA_LINK ] Generating unique operative hash...</p>
            <p className="text-[#CCFF00]/40">[ ARSENAL ] Linking hardware extraction rights...</p>
            <p>[ AUTH ] Establishing 256-bit encryption tunnel...</p>
            <p className="text-[#CCFF00]/40">[ STATUS ] Preparing operative personal vault...</p>
          </div>
        </div>

        <div className="relative z-10 opacity-10">
           <span className="text-[60px] font-black text-white tracking-tighter leading-none uppercase">ARSENAL<br/>CORE</span>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:30px_30px] opacity-40" />
      </div>

      {/* RIGHT: REG FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-sm space-y-12 relative z-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">OPERATIVE_ENROLL</h1>
            <p className="font-mono text-[10px] text-[#CCFF00] tracking-[0.3em] uppercase opacity-60">
              [ ESTABLISHING_NEW_IDENTITY ]
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-10">
            <div className="space-y-6">
              <input 
                required type="text" placeholder="CODENAME_IDENTITY..."
                value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 p-3 font-mono text-xs text-[#CCFF00] placeholder:text-white/10 focus:outline-none focus:border-[#CCFF00] transition-all uppercase tracking-widest"
              />
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
              <GlitchButton text={loading ? "ENROLLING..." : "INITIALIZE_LINK"} className="w-full py-4" />
              <div className="flex justify-between items-center px-2">
                <Link href="/login" className="text-[9px] font-mono text-white/30 hover:text-[#CCFF00] uppercase tracking-widest transition-colors">
                  [ Already_Linked? ]
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
