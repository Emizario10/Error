"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

/**
 * LOGOUT_BUTTON: Secure session termination.
 */
export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      className="text-[10px] font-mono text-[#FF3131] hover:text-[#FF003C] uppercase tracking-[0.4em] transition-colors border-b border-transparent hover:border-[#FF003C] pb-1"
    >
      [ DISCONNECT_SESSION ]
    </button>
  );
}
