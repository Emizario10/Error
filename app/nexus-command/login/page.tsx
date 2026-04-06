"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import GlitchButton from '@/components/GlitchButton';
import { createClient } from '@/utils/supabase/client';

/**
 * NEXUS_LOGIN: Supabase Auth Terminal.
 * High-fidelity "Cyber-Noir" interface for administrative access.
 */
export default function NexusLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message.toUpperCase());
        setPassword('');
      } else {
        // Success: Redirect to the command center
        router.push('/nexus-command');
        router.refresh(); // Force refresh to update middleware state
      }
    } catch (err) {
      console.error('AUTH_FAIL:', err);
      setError('SYSTEM_ERROR: UNKNOWN_FAILURE');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* CRT SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_3px,3px_100%] opacity-20" />
      
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:40px_40px] opacity-40" />
      
      <div className="relative z-10 w-full max-w-sm flex flex-col gap-12">
        {/* PORTAL HEADER */}
        <div className="space-y-2 border-l-2 border-[#CCFF00] pl-6 text-left">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            NEXUS_ACCESS
          </h1>
          <p className="font-mono text-[8px] text-[#CCFF00] tracking-[0.4em] uppercase opacity-60">
            [ ESTABLISHING_ENCRYPTED_SESSION // NODE: 0x77AF ]
          </p>
        </div>

        {/* AUTHENTICATION FORM */}
        <form onSubmit={handleAuth} className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="relative group">
              <input 
                required
                type="email"
                placeholder="ADMIN_IDENTITY..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 p-2 font-mono text-xs text-[#CCFF00] placeholder:text-white/10 focus:outline-none focus:border-[#CCFF00] transition-all tracking-widest uppercase"
              />
            </div>
            
            <div className="relative group">
              <input 
                required
                type="password"
                placeholder="ENTER_VAULT_PASS..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 p-2 font-mono text-xs text-[#CCFF00] placeholder:text-white/10 focus:outline-none focus:border-[#CCFF00] transition-all tracking-widest uppercase"
              />
              {error && (
                <p className="absolute -bottom-6 left-0 font-mono text-[8px] text-[#FF003C] tracking-widest uppercase animate-pulse">
                  ERR: {error}
                </p>
              )}
            </div>
          </div>

          <GlitchButton 
            text={loading ? "DECRYPTING_ACCESS..." : "AUTHENTICATE"} 
            className="w-full"
          />
        </form>

        {/* TERMINAL FOOTER */}
        <div className="flex justify-between items-center opacity-20">
           <span className="font-mono text-[6px] text-white tracking-[1em] uppercase">
              Encrypted.Link // established
           </span>
           <span className="font-mono text-[6px] text-[#CCFF00] animate-pulse">
              [ STATUS: READY ]
           </span>
        </div>
      </div>
    </div>
  );
}
