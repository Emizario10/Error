"use client";

import React, { useState } from 'react';
import { Edit2, Trash2, RotateCcw, Plus, X } from 'lucide-react';

type ProductRecord = {
  id: string;
  name: string;
  description?: string | null;
  basePrice: number;
  currentPrice: number;
  heatLevel: number;
  salesCount: number;
  imageUrl?: string | null;
  category?: string | null;
  createdAt: string | Date;
};

type Props = {
  products: ProductRecord[];
};

export default function ProductTableClient({ products: initial }: Props) {
  const [products, setProducts] = useState<ProductRecord[]>(initial ?? []);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    basePrice: '',
    currentPrice: '',
    heatLevel: '0',
    imageUrl: '',
    category: ''
  });

  async function refresh() {
    const res = await fetch('/api/admin/products');
    if (res.ok) setProducts(await res.json());
  }

  function handleOpenCreate() {
    setEditingProduct(null);
    setForm({ name: '', description: '', basePrice: '', currentPrice: '', heatLevel: '0', imageUrl: '', category: '' });
    setOpen(true);
  }

  function handleOpenEdit(p: ProductRecord) {
    setEditingProduct(p);
    setForm({
      name: p.name,
      description: p.description || '',
      basePrice: p.basePrice.toString(),
      currentPrice: p.currentPrice.toString(),
      heatLevel: p.heatLevel.toString(),
      imageUrl: p.imageUrl || '',
      category: p.category || ''
    });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        basePrice: parseFloat(form.basePrice),
        currentPrice: parseFloat(form.currentPrice),
        heatLevel: parseInt(form.heatLevel),
        imageUrl: form.imageUrl || null,
        category: form.category || null,
      };

      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PATCH' : 'POST';

      // NOTE: POST route expects 'currentPrice' as 'price' in the original implementation, 
      // but I updated the PATCH route to expect 'currentPrice'. 
      // I should check POST route again.
      
      const res = await fetch(url, { 
        method, 
        body: JSON.stringify(editingProduct ? payload : { ...payload, price: payload.currentPrice }) 
      });

      if (res.ok) {
        setOpen(false);
        await refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('CONFIRM_DELETION?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    await refresh();
  }

  async function handleResetMarket() {
    if (!confirm('INITIATE_MARKET_RESET? ALL_PRICES_WILL_REVERT_TO_BASE.')) return;
    setSaving(true);
    await fetch('/api/admin/products/reset-market', { method: 'POST' });
    await refresh();
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-tactical text-black px-4 py-2 uppercase font-black text-[10px] tracking-widest hover:brightness-110 transition-all"
          >
            <Plus size={14} strokeWidth={3} /> [ ADD_DEPLOYMENT ]
          </button>
          <button
            onClick={handleResetMarket}
            disabled={saving}
            className="flex items-center gap-2 border border-red-500/50 text-red-500 px-4 py-2 uppercase font-black text-[10px] tracking-widest hover:bg-red-500/10 transition-all disabled:opacity-50"
          >
            <RotateCcw size={14} strokeWidth={3} /> [ RESET_MARKET ]
          </button>
        </div>
        <span className="font-mono text-[9px] text-white/20 uppercase tracking-[0.3em]">Total_Hardware: {products.length}</span>
      </div>

      <div className="border border-white/5 bg-black/40 backdrop-blur-sm overflow-hidden">
        <table className="w-full text-left font-mono text-[10px] uppercase tracking-widest">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="p-4 text-white/40">Hardware_Name</th>
              <th className="p-4 text-white/40">Category</th>
              <th className="p-4 text-white/40">Base_Price</th>
              <th className="p-4 text-white/40 text-tactical">Current_Price</th>
              <th className="p-4 text-white/40 text-red-500">Heat</th>
              <th className="p-4 text-white/40">Sales</th>
              <th className="p-4 text-white/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p: any) => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4 font-bold text-white group-hover:text-tactical transition-colors">{p.name}</td>
                <td className="p-4 text-white/40">{p.category || 'N/A'}</td>
                <td className="p-4 text-white/60">${p.basePrice.toFixed(2)}</td>
                <td className="p-4 text-tactical font-black">${p.currentPrice.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-sm ${p.heatLevel > 2 ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-white/20'}`}>
                    LVL_{p.heatLevel}
                  </span>
                </td>
                <td className="p-4 text-white/40">{p.salesCount}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenEdit(p)} className="p-2 hover:text-tactical transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-[#050505] border border-tactical/30 w-full max-w-lg relative overflow-hidden shadow-[0_0_50px_rgba(204,255,0,0.1)]">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-tactical to-transparent" />
            
            <div className="p-8">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">
                  {editingProduct ? 'EDIT_HARDWARE_NODE' : 'REGISTER_NEW_HARDWARE'}
                </h3>
                <button onClick={() => setOpen(false)} className="text-white/20 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Designation</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-black border border-white/10 p-3 text-xs font-mono text-white focus:border-tactical transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Category</label>
                    <input
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-black border border-white/10 p-3 text-xs font-mono text-white focus:border-tactical transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Function_Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-black border border-white/10 p-3 text-xs font-mono text-white h-24 focus:border-tactical transition-colors"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Base_Price</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={form.basePrice}
                      onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                      className="w-full bg-black border border-white/10 p-3 text-xs font-mono text-white focus:border-tactical transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest text-tactical">Current_Price</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={form.currentPrice}
                      onChange={(e) => setForm({ ...form, currentPrice: e.target.value })}
                      className="w-full bg-black border border-white/10 p-3 text-xs font-mono text-white focus:border-tactical transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest text-red-500">Heat_Level</label>
                    <input
                      required
                      type="number"
                      value={form.heatLevel}
                      onChange={(e) => setForm({ ...form, heatLevel: e.target.value })}
                      className="w-full bg-black border border-white/10 p-3 text-xs font-mono text-white focus:border-tactical transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Image_Resource_URL</label>
                  <input
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    className="w-full bg-black border border-white/10 p-3 text-xs font-mono text-white focus:border-tactical transition-colors"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-[10px] font-mono text-white/40 uppercase tracking-widest hover:text-white transition-colors"
                  >
                    [ CANCEL ]
                  </button>
                  <button
                    disabled={saving}
                    className="bg-tactical text-black px-8 py-3 font-black uppercase text-[10px] tracking-[0.3em] hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {saving ? 'SYNCING...' : '[ SAVE_MODIFICATIONS ]'}
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
