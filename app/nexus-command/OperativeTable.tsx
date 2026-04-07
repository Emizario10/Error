"use client";

import React, { useState } from 'react';
import { Shield, Zap, Edit3, X } from 'lucide-react';

type ProfileRecord = {
  id: string;
  username: string;
  xp: number;
  clearanceLevel: number;
  customColor: string;
  createdAt: string | Date;
};

type Props = {
  profiles: ProfileRecord[];
};

export default function OperativeTable({ profiles: initial }: Props) {
  const [profiles, setProfiles] = useState<ProfileRecord[]>(initial ?? []);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ProfileRecord | null>(null);
  const [xpAmount, setXpAmount] = useState('0');
  const [saving, setSaving] = useState(false);

  async function refresh() {
    // In a real scenario, we might have a dedicated fetch profiles API
    // For now, we'll assume the page will refresh or we can add one
    window.location.reload();
  }

  function handleOpenAdjust(p: ProfileRecord) {
    setSelectedUser(p);
    setXpAmount('0');
    setOpen(true);
  }

  async function handleAdjustXP(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/profiles/adjust-xp', {
        method: 'POST',
        body: JSON.stringify({
          userId: selectedUser.id,
          amount: parseInt(xpAmount),
          type: 'ADMIN_MANUAL_ADJUST'
        })
      });

      if (res.ok) {
        setOpen(false);
        refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="border border-white/5 bg-black/40 backdrop-blur-sm overflow-hidden">
        <table className="w-full text-left font-mono text-[10px] uppercase tracking-widest">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="p-4 text-white/40">Operative_ID</th>
              <th className="p-4 text-white/40">Username</th>
              <th className="p-4 text-white/40 text-tactical">XP_Total</th>
              <th className="p-4 text-white/40 text-blue-400">Clearance</th>
              <th className="p-4 text-white/40">Enrolled</th>
              <th className="p-4 text-white/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {profiles.map((p: any) => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4 text-white/20 text-[8px]">{p.id}</td>
                <td className="p-4 font-bold text-white group-hover:text-tactical transition-colors flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.customColor }} />
                  {p.username}
                </td>
                <td className="p-4 text-tactical font-black">{p.xp} XP</td>
                <td className="p-4">
                  <span className="flex items-center gap-2 text-blue-400">
                    <Shield size={10} /> L{p.clearanceLevel}
                  </span>
                </td>
                <td className="p-4 text-white/40">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleOpenAdjust(p)}
                    className="flex items-center gap-2 ml-auto border border-tactical/30 text-tactical px-3 py-1 text-[8px] font-black hover:bg-tactical/10 transition-all"
                  >
                    <Zap size={10} /> [ ADJUST_XP ]
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && selectedUser && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-[#050505] border border-tactical/30 w-full max-w-sm relative overflow-hidden shadow-[0_0_50px_rgba(204,255,0,0.1)]">
            <div className="p-8 text-center">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter italic mb-2">
                IDENTITY_MODIFICATION
              </h3>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-8">
                OPERATIVE: {selectedUser.username}
              </p>

              <form onSubmit={handleAdjustXP} className="space-y-6">
                <div className="space-y-2 text-left">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">XP_Adjustment_Value</label>
                  <input
                    required
                    type="number"
                    value={xpAmount}
                    onChange={(e) => setXpAmount(e.target.value)}
                    className="w-full bg-black border border-white/10 p-4 text-center text-2xl font-black text-tactical focus:border-tactical transition-colors"
                  />
                  <p className="text-[8px] font-mono text-white/20 text-center italic">
                    Use negative values to decrement.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    disabled={saving}
                    className="w-full bg-tactical text-black py-4 font-black uppercase text-[10px] tracking-[0.4em] hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {saving ? 'EXECUTING...' : '[ COMMIT_CHANGES ]'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-[10px] font-mono text-white/20 uppercase tracking-widest hover:text-white transition-colors"
                  >
                    [ ABORT_OPERATION ]
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
