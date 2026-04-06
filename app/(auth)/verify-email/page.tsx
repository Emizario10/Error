"use client";

import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * VERIFY_EMAIL: Awaiting operative confirmation.
 */
export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Visual Glitch Background */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:40px_40px] opacity-40" />
      
      <div className="relative z-10 w-full max-w-lg bg-[#050505] border border-white/5 p-12 text-center space-y-10">
        <div className="w-20 h-20 border-2 border-[#CCFF00] rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_#CCFF0033]">
           <Mail className="text-[#CCFF00] w-10 h-10" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">IDENTITY_VERIFICATION_PENDING</h1>
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest leading-relaxed">
            [ ENROLLMENT_LINK_SENT ] <br />
            We have transmitted a secure verification cipher to your email address. 
            Access the link within the transmission to finalize your identity link.
          </p>
        </div>

        <div className="p-6 bg-black border border-white/5 space-y-2 text-left">
           <span className="text-[8px] font-mono text-[#CCFF00] uppercase tracking-[0.4em]">Next_Protocol:</span>
           <p className="text-[10px] font-mono text-white/60 uppercase leading-loose">
             1. Access your communications hub. <br />
             2. Locate the KROM.SYS handshake email. <br />
             3. Execute the verification link.
           </p>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4">
          <Link 
            href="/login" 
            className="flex items-center gap-3 text-[10px] font-mono text-white/30 hover:text-[#CCFF00] transition-all uppercase tracking-[0.3em]"
          >
            Return to login portal <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Cinematic CRT Line */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(204,255,0,0.01)_1px,transparent_1px)] bg-[length:100%_8px] opacity-30" />
    </div>
  );
}
