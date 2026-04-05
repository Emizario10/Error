"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import GlitchButton from '@/components/GlitchButton';

/**
 * NEXUS_LOGIN: The Entry Point.
 * Minimalist, high-security aesthetic for administrative access.
 */
export default function NexusLoginPage() {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await signIn('credentials', {
        password: pass,
        redirect: false,
      });

      if (res?.ok) {
        // Success: Redirect to the command center
        router.push('/nexus-command');
      } else {
        // Access Denied
        setError(true);
        setPass('');
      }
    } catch (err) {
      console.error('AUTH_FAIL:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:40px_40px] opacity-40" />
      
      <div className="relative z-10 w-full max-w-sm flex flex-col gap-12">
        {/* Portal Header */}
        <div className="space-y-2 border-l-2 border-[#CCFF00] pl-6">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            NEXUS_COMMAND
          </h1>
          <p className="font-mono text-[8px] text-[#CCFF00] tracking-[0.4em] uppercase opacity-60">
            [ SECURE_ENTRY_PORTAL // CALIBRATE_KEY ]
          </p>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleAuth} className="flex flex-col gap-8">
          <div className="relative group">
            <input 
              required
              type="password"
              placeholder="ENTER_VAULT_PASS..."
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 p-2 font-mono text-sm text-[#CCFF00] placeholder:text-white/10 focus:outline-none focus:border-[#CCFF00] transition-all tracking-widest uppercase"
            />
            {error && (
              <p className="absolute -bottom-6 left-0 font-mono text-[8px] text-[#FF003C] tracking-widest uppercase animate-pulse">
                ERR: INVALID_KEY_ENTRY. RE-CALIBRATE.
              </p>
            )}
          </div>

          <GlitchButton 
            text={loading ? "VERIFYING..." : "AUTHENTICATE"} 
            className="w-full"
          />
        </form>

        <div className="flex justify-center opacity-10">
           <span className="font-mono text-[6px] text-white tracking-[1em] uppercase">
              Encrypted.Link // established
           </span>
        </div>
      </div>
    </div>
  );
}
