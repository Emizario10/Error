"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GlitchButton from '@/components/GlitchButton';
import { createClient } from '@/utils/supabase/client';

/**
 * LOGIN_PORTAL: Operative Access Point.
 * High-fidelity split-screen design synchronized with the KROM.SYS aesthetic.
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

      if (authError) {
        if (authError.message.includes('Email not confirmed')) {
          setError("IDENTITY_NOT_VERIFIED: PLEASE CHECK YOUR HUB.");
          return;
        }
        throw authError;
      }

      // SUCCESS: Established link to personal vault
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

      {/* LEFT: SYSTEM STATUS DATA-STREAM */}
      <div className="hidden md:flex md:w-1/2 bg-[#050505] border-r border-white/5 flex-col justify-between p-12 relative">
        <div className="space-y-8 relative z-10">
          <div className="border-l-2 border-tactical pl-6">
            <h2 className="text-sm font-mono text-tactical tracking-[0.5em] uppercase">Auth.Link</h2>
            <p className="text-[10px] font-mono text-white/30 uppercase mt-2">KROM_OS // NODE_0x77AF</p>
          </div>
          
          <div className="space-y-4 font-mono text-[9px] text-white/20 uppercase leading-loose tracking-widest">
            <p className="text-tactical/40">[ AUTH_LINK ] Establishing secure connection...</p>
            <p>[ 0.0122s ] Bypassing standard firewalls...</p>
            <p>[ 0.0455s ] Validating operative credentials...</p>
            <p className="text-tactical/40">[ 0.0891s ] Decrypting personal vault: STANDBY</p>
          </div>
        </div>

        <div className="relative z-10 opacity-10">
           <span className="text-[60px] font-black text-white tracking-tighter leading-none uppercase italic">KROM<br/>SYS</span>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:30px_30px] opacity-40" />
      </div>

      {/* RIGHT: SECURE LOGIN FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-sm space-y-12 relative z-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">OPERATIVE_LOGIN</h1>
            <p className="font-mono text-[10px] text-tactical tracking-[0.3em] uppercase opacity-60">
              [ ENTER_VAULT_IDENTIFIER ]
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-10">
            <div className="space-y-6">
              <input 
                required type="email" placeholder="EMAIL_IDENTITY..."
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 p-3 font-mono text-xs text-tactical placeholder:text-white/10 focus:outline-none focus:border-tactical transition-all uppercase tracking-widest"
              />
              <input 
                required type="password" placeholder="SECURITY_CIPHER..."
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 p-3 font-mono text-xs text-tactical placeholder:text-white/10 focus:outline-none focus:border-tactical transition-all uppercase tracking-widest"
              />
            </div>

            {error && (
              <div className="p-4 border border-[#FF003C]/30 bg-[#FF003C]/5 flex flex-col gap-2">
                <span className="font-mono text-[9px] text-[#FF003C] tracking-widest uppercase animate-pulse">
                  ERR: {error}
                </span>
                {error.includes('NOT_VERIFIED') && (
                  <Link href="/verify-email" className="text-[8px] font-mono text-white/40 hover:text-tactical uppercase underline tracking-widest transition-colors">
                    [ ACCESS_VERIFICATION_PORTAL ]
                  </Link>
                )}
              </div>
            )}

            <div className="space-y-6">
              <GlitchButton text={loading ? "DECRYPTING..." : "AUTHENTICATE"} className="w-full py-4" />
              <div className="flex justify-between items-center px-2">
                <Link href="/register" className="text-[9px] font-mono text-white/30 hover:text-tactical uppercase tracking-widest transition-colors">
                  [ NEW_OPERATIVE? ENROLL_HERE ]
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
