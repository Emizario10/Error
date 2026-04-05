"use client";

import React, { useState } from 'react';

// Local product type to avoid depending on generated Prisma types at edit-time.
// Shape matches Prisma `Product` model: id, name, description, price (cents), imageUrl, category, createdAt
type ProductRecord = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  category?: string | null;
  createdAt: string | Date; // ISO string or Date object
};

type Props = {
  products: ProductRecord[];
};

export default function ProductTableClient({ products: initial }: Props) {
  const [products, setProducts] = useState<ProductRecord[]>(initial ?? []);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', imageUrl: '', category: '' });

  async function fetchProducts() {
    const res = await fetch('/api/admin/products');
    if (res.ok) setProducts(await res.json());
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Math.round(parseFloat(form.price) * 100),
        imageUrl: form.imageUrl || null,
        category: form.category || null,
      };
      const res = await fetch('/api/admin/products', { method: 'POST', body: JSON.stringify(payload) });
      if (res.ok) {
        setForm({ name: '', description: '', price: '', imageUrl: '', category: '' });
        setOpen(false);
        await fetchProducts();
      } else {
        console.error('Create failed', await res.text());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold uppercase">Products</h4>
        <button
          className="bg-[#CCFF00] text-black px-3 py-2 uppercase font-bold"
          onClick={() => setOpen(true)}
        >
          Add New Deployment
        </button>
      </div>

      <div className="overflow-x-auto border border-[#2c2c2c]">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-[#cfcfcf]/80">
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-[#222]">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">${(p.price / 100).toFixed(2)}</td>
                <td className="p-3">{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form onSubmit={handleCreate} className="bg-[#0b0b0b] p-6 rounded shadow-lg w-full max-w-md">
            <h5 className="text-lg font-bold mb-4">Add Product</h5>
            <label className="block mb-2">
              <span className="text-sm">Name</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mt-1 p-2 bg-[#0a0a0a] border border-[#222]"
              />
            </label>

            <label className="block mb-2">
              <span className="text-sm">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full mt-1 p-2 bg-[#0a0a0a] border border-[#222]"
              />
            </label>

            <label className="block mb-2">
              <span className="text-sm">Price (USD)</span>
              <input
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                type="number"
                step="0.01"
                className="w-full mt-1 p-2 bg-[#0a0a0a] border border-[#222]"
              />
            </label>

            <label className="block mb-2">
              <span className="text-sm">Image URL</span>
              <input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full mt-1 p-2 bg-[#0a0a0a] border border-[#222]"
              />
            </label>

            <label className="block mb-4">
              <span className="text-sm">Category</span>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full mt-1 p-2 bg-[#0a0a0a] border border-[#222]"
              />
            </label>

            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 border border-[#222]">
                Cancel
              </button>
              <button disabled={saving} className="px-4 py-2 bg-[#CCFF00] text-black font-bold">
                {saving ? 'Saving...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
