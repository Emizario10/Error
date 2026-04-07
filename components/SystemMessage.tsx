"use client";

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystemStore } from '@/store/useSystemStore';
import { Terminal } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';

/**
 * SYSTEM_MESSAGE: Global tactical notification interface.
 * Features AI Overseer boot sequence on initial session.
 */
export default function SystemMessage() {
  const { messages, addMessage, removeMessage } = useSystemStore();
  const hasBooted = useRef(false);
  const supabase = createClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    const alert = searchParams.get('system_alert');
    if (alert) {
      addMessage(`[!] ${alert.replace(/_/g, ' ')}`, "SECURITY");
      // Remove param from URL to avoid repeating on refresh
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams, addMessage]);

  useEffect(() => {
    if (hasBooted.current) return;
    hasBooted.current = true;

    // AI OVERSEER: Boot Sequence
    const triggerBoot = async () => {
      // Step 1: Init
      setTimeout(() => addMessage("> INITIALIZING_KROM_OS... [OK]", "INFO"), 1000);
      
      // Step 2: Encrypt
      setTimeout(() => addMessage("> ENCRYPTING_CONNECTION... [OK]", "SECURITY"), 2500);
      
      // Step 3: Identity
      const { data: { user } } = await supabase.auth.getUser();
      const username = user?.user_metadata?.username || user?.email?.split('@')[0] || "GUEST";
      
      setTimeout(() => {
        addMessage(`> WELCOME_BACK_OPERATIVE_${username.toUpperCase()}.`, "INFO");
      }, 4000);
    };

    triggerBoot();
  }, [addMessage, supabase.auth]);

  return (
    <div className="fixed top-24 right-8 z-[9999] flex flex-col gap-4 pointer-events-none w-full max-w-[320px]">
      <AnimatePresence>
        {messages.map((m: any) => (
          <motion.div
            key={m.id}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            className="bg-black border border-tactical/30 p-4 shadow-[0_0_20px_rgba(0,0,0,0.8)] relative overflow-hidden pointer-events-auto cursor-pointer group"
            onClick={() => removeMessage(m.id)}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
              <Terminal size={12} className="text-tactical" />
              <span className="text-[8px] font-mono text-tactical/60 uppercase tracking-[0.3em]">
                System_Node // {m.type}
              </span>
            </div>

            {/* Content */}
            <div className="text-[10px] font-mono text-white/80 leading-relaxed uppercase tracking-widest">
              {m.text}
              <span className="inline-block w-1.5 h-3 bg-tactical ml-1 animate-pulse align-middle" />
            </div>

            {/* Progress bar timer */}
            <motion.div 
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 6, ease: "linear" }}
              className="absolute bottom-0 left-0 right-0 h-[1px] bg-tactical/20 origin-left"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
