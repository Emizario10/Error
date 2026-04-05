"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn('credentials', {
      password,
      redirect: false,
    } as any);

    setLoading(false);
    if (res && (res as any).error) {
      setError('Invalid password');
      return;
    }

    // success
    router.push('/admin');
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#000000] text-[#E8E8E8] p-8">
      <div className="w-full max-w-md bg-[#070707] border border-[#222] p-8">
        <h1 className="font-sans font-black text-3xl mb-4">ADMIN LOGIN</h1>
        <p className="font-mono text-sm text-[#cfcfcf]/70 mb-6">Initiate secure admin session</p>

        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-sm font-mono">SECRET PASSWORD</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 bg-[#0a0a0a] border border-[#222] font-mono"
              placeholder="••••••••"
            />
          </label>

          {error && <div className="text-red-400 mb-4">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-3 bg-[#CCFF00] text-black px-6 py-3 font-sans font-bold uppercase tracking-widest"
          >
            {loading ? 'INITIATING...' : 'INITIATE_SESSION'}
          </button>
        </form>
      </div>
    </main>
  );
}
