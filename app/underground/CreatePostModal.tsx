"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import GlitchButton from '@/components/GlitchButton';
import { useRouter } from 'next/navigation';

export default function CreatePostModal({ onClose, authorId }: { onClose: () => void, authorId: string }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('INTELLIGENCE');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, content, image, authorId }),
      });

      if (res.ok) {
        onClose();
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#050505] border border-[#333] p-10 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-[#CCFF00]">
          <X size={24} />
        </button>

        <div className="border-l-2 border-[#CCFF00] pl-6 mb-10">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">NEW_INTELLIGENCE_ENTRY</h2>
          <p className="text-[8px] font-mono text-[#CCFF00] tracking-[0.4em] uppercase opacity-60 mt-1">
            [ BROADCASTING_TO_UNDERGROUND_GRID ]
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input 
              required type="text" placeholder="REPORT_TITLE..." 
              value={title} onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-b border-white/10 p-2 font-mono text-xs text-[#CCFF00] focus:outline-none focus:border-[#CCFF00] uppercase tracking-widest"
            />
            <select 
              value={category} onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent border-b border-white/10 p-2 font-mono text-xs text-[#FF3131] focus:outline-none focus:border-[#FF3131] uppercase tracking-widest"
            >
              <option value="INTELLIGENCE">INTELLIGENCE</option>
              <option value="HARDWARE">HARDWARE</option>
              <option value="PROTOCOL">PROTOCOL</option>
              <option value="VOID">VOID</option>
            </select>
          </div>

          <input 
            type="text" placeholder="IMAGE_DATA_URL (OPTIONAL)..." 
            value={image} onChange={(e) => setImage(e.target.value)}
            className="w-full bg-transparent border-b border-white/10 p-2 font-mono text-xs text-white/40 focus:outline-none focus:border-white/20 uppercase tracking-widest"
          />

          <textarea 
            required placeholder="ENTRY_CONTENT_ENCRYPTED_TEXT..." 
            rows={6}
            value={content} onChange={(e) => setContent(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/5 p-4 font-mono text-xs text-white/60 focus:outline-none focus:border-[#CCFF00]/20 uppercase tracking-widest leading-relaxed"
          />

          <GlitchButton text={loading ? "TRANSMITTING..." : "PUBLISH_REPORT"} className="w-full" />
        </form>
      </div>
    </div>
  );
}
