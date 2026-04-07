"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GlitchButton from '@/components/GlitchButton';
import { createClient } from '@/utils/supabase/client';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<any>(null);
  
  const router = useRouter();
  const supabase = createClient();

  // Detect if user is already authenticated in Supabase
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setActiveUser(user);
        setEmail(user.email || '');
      }
    };
    checkUser();
  }, [supabase]);

  async function handleAction(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let userId = activeUser?.id;

      // 1. If not authenticated, run SIGNUP
      if (!userId) {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } }
        });

        if (authError) {
          if (authError.message.includes('security purposes')) {
            throw new Error("COOLDOWN_ACTIVE: PLEASE WAIT 60s");
          }
          throw authError;
        }
        userId = data.user?.id;
      }

      if (!userId) throw new Error("ENROLLMENT_LINK_FAILED");

      // 2. VAULT_SYNC: Ensure Prisma record exists
      const profileRes = await fetch('/api/profile/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userId,
          username: username || activeUser?.user_metadata?.username || email.split('@')[0],
        }),
      });

      if (!profileRes.ok) {
        const errorData = await profileRes.json();
        // Display the specialized message (e.g., IDENTITY_COLLISION) if available
        throw new Error(errorData.message || `VAULT_SYNC_FAILURE: ${errorData.error || 'CONTACT_NEXUS'}`);
      }

      // 3. COMPLETE OR VERIFY
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        router.push('/account');
      } else {
        // No session means email confirmation is likely required
        router.push('/verify-email');
      }
      router.refresh();
    } catch (err: any) {
      console.error('ACTION_FAIL:', err);
      setError(err.message?.toUpperCase() || 'ENROLLMENT_FAILURE');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_3px,3px_100%] opacity-20" />

      {/* LEFT PANEL: INTEL */}
      <div className="hidden md:flex md:w-1/2 bg-[#050505] border-r border-white/5 flex-col justify-between p-12 relative">
        <div className="space-y-8 relative z-10">
          <div className="border-l-2 border-tactical pl-6">
            <h2 className="text-sm font-mono text-tactical tracking-[0.5em] uppercase">
              {activeUser ? 'Identity.Found' : 'Enrollment.Protocol'}
            </h2>
            <p className="text-[10px] font-mono text-white/30 uppercase mt-2">
              {activeUser ? `SESSION_ID: ${activeUser.id.slice(0,8)}...` : 'SECURE_VAULT_INITIATION'}
            </p>
          </div>
          <div className="space-y-4 font-mono text-[9px] text-white/20 uppercase leading-loose tracking-widest">
            {activeUser ? (
              <p className="text-tactical">[ ALERT ] Supabase identity confirmed. Missing Prisma Profile. Sync required.</p>
            ) : (
              <p>[ DATA_LINK ] Generating unique operative hash...</p>
            )}
            <p className="text-tactical/40">[ ARSENAL ] Linking hardware extraction rights...</p>
            <p>[ AUTH ] Establishing 256-bit encryption tunnel...</p>
          </div>
        </div>
        <div className="relative z-10 opacity-10 font-black text-6xl uppercase tracking-tighter">KROM_SYS</div>
        <div className="absolute inset-0 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:30px_30px] opacity-40" />
      </div>

      {/* RIGHT PANEL: FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-sm space-y-12 relative z-10">
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
            {activeUser ? 'SYNC_PROFILE' : 'OPERATIVE_ENROLL'}
          </h1>

          <form onSubmit={handleAction} className="space-y-10">
            <div className="space-y-6">
              <input 
                required type="text" placeholder="CODENAME_IDENTITY..."
                value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 p-3 font-mono text-xs text-tactical focus:outline-none focus:border-tactical uppercase tracking-widest"
              />
              {!activeUser && (
                <>
                  <input 
                    required type="email" placeholder="EMAIL_IDENTITY..."
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 p-3 font-mono text-xs text-tactical focus:outline-none focus:border-tactical uppercase tracking-widest"
                  />
                  <input 
                    required type="password" placeholder="SECURITY_CIPHER..."
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 p-3 font-mono text-xs text-tactical focus:outline-none focus:border-tactical uppercase tracking-widest"
                  />
                </>
              )}
            </div>

            {error && (
              <div className="p-4 border border-[#FF003C]/30 bg-[#FF003C]/5 font-mono text-[9px] text-[#FF003C] tracking-widest uppercase animate-pulse">
                ERR: {error}
              </div>
            )}

            <GlitchButton 
              text={loading ? "SYNCING..." : (activeUser ? "FINALIZE_SYNC" : "INITIALIZE_LINK")} 
              className="w-full py-4" 
            />
          </form>
        </div>
      </div>
    </div>
  );
}
