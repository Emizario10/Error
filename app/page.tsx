"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import React from 'react';
import { useCartStore } from '../store/useCartStore';

type MockProduct = {
  id: string;
  name: string;
  description?: string;
  price: number; // cents
  imageUrl?: string;
  category?: string;
};

const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'prod_1',
    name: 'Casing: CHROME-01',
    description: 'Reinforced chassis for urban operations',
    price: 12900,
    imageUrl: '/placeholder-1.png',
    category: 'hardware',
  },
  {
    id: 'prod_2',
    name: 'Wraparound Optic X9',
    description: 'Night-vision compatible optic, anti-glare',
    price: 24900,
    imageUrl: '/placeholder-2.png',
    category: 'optics',
  },
  {
    id: 'prod_3',
    name: 'Tactical Harness',
    description: 'Heavy-duty modular harness',
    price: 9900,
    imageUrl: '/placeholder-3.png',
    category: 'wear',
  },
];

export default function HomePage() {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const onAdd = (p: MockProduct) => {
    addItem({ productId: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl ?? null }, 1);
  };

  return (
    <main className="min-h-screen bg-[#000000] text-[#F3F4F6]">
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-start p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('/noise.png')] pointer-events-none" />

        <aside className="absolute left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-12 font-mono text-[12px] text-[#F3F4F6]/40 tracking-[0.3em]">
          <span>01 [HEAVY HW]</span>
          <span className="text-[#CCFF00]/60">02 [TACTICAL]</span>
          <span>03 [NIGHT OPTICS]</span>
        </aside>

        <div className="z-10 max-w-6xl">
          <div className="relative">
            <h2 className="absolute -top-8 left-0 text-[6rem] md:text-[8rem] font-sans font-black uppercase text-[#CCFF00] opacity-8 tracking-tighter select-none -z-10 pointer-events-none">
              INDUSTRIAL SUPERVIVENCIA
            </h2>

            <h1 className="text-[4.5rem] md:text-[6.5rem] lg:text-[8rem] font-sans font-black uppercase leading-none">
              HEAVY
              <br />
              HARDWARE
            </h1>

            <p className="mt-6 font-mono text-sm text-[#F3F4F6]/80 max-w-2xl uppercase tracking-wider">
              SYS.REQ: URBAN SURVIVAL GEAR — Premium streetwear & utility gear built for the
              underground.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/shop')}
              className="mt-8 inline-flex items-center gap-4 bg-[#CCFF00] text-black px-8 py-4 font-sans font-bold uppercase tracking-widest shadow-[0_12px_40px_rgba(204,255,0,0.12)]"
            >
              <span>INICIAR EXTRACCIÓN</span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-16 px-12">
        <h3 className="text-xl font-sans font-bold uppercase mb-6">Featured</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PRODUCTS.map((p) => (
            <article key={p.id} className="bg-[#0A0A0C] border border-[#333] p-4 rounded-sm">
              <div className="h-40 bg-[#0f0f0f] flex items-center justify-center mb-4">
                <img src={p.imageUrl} alt={p.name} className="max-h-36 object-contain" />
              </div>
              <h4 className="font-sans font-bold text-lg">{p.name}</h4>
              <p className="text-sm text-[#F3F4F6]/70 my-2 font-mono">{p.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="font-mono">${(p.price / 100).toFixed(2)}</span>
                <button
                  onClick={() => onAdd(p)}
                  className="bg-[#CCFF00] text-black px-3 py-2 text-sm font-bold uppercase"
                >
                  Add
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
