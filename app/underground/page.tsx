import { prisma } from '@/lib/prisma';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Image from 'next/image';
import GlitchButton from '@/components/GlitchButton';
import UndergroundClient from './UndergroundClient';

export default async function UndergroundPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user?.email === 'juanfe13lasso@gmail.com';

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  });

  return (
    <div className="min-h-screen bg-[#000000] pt-32 pb-20 px-6 lg:px-20 relative overflow-hidden">
      {/* HEADER */}
      <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-l-4 border-[#CCFF00] pl-8">
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
            UNDERGROUND_FEED
          </h2>
          <p className="font-mono text-[11px] text-[#CCFF00] tracking-[0.6em] uppercase opacity-90">
            [ INTELLIGENCE_REPORTS // GRID_STATUS: LIVE ]
          </p>
        </div>
        
        {/* Pass admin status and user id to client component */}
        <UndergroundClient isAdmin={isAdmin} userId={user?.id || ''} />
      </div>

      {/* FEED GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto">
        {posts.length === 0 ? (
          <div className="col-span-full py-40 border border-dashed border-[#222] text-center">
            <span className="font-mono text-xs text-white/20 uppercase tracking-[0.8em] animate-pulse">
              // NO_INTELLIGENCE_REPORTS_IN_BUFFER
            </span>
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="group flex flex-col bg-black border border-white/5 hover:border-[#CCFF00]/30 transition-all duration-700">
              {/* Report Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#050505]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-[#FF3131] uppercase tracking-[0.4em] mb-1">
                    [{post.category}]
                  </span>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                    {new Date(post.createdAt).toLocaleTimeString()} // {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
                  OP_{post.author.username}
                </span>
              </div>

              {/* Report Image */}
              <div className="relative aspect-video w-full overflow-hidden bg-[#0a0a0a]">
                {post.image ? (
                  <Image src={post.image} alt={post.title} fill className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white/5 uppercase tracking-[1em] font-mono">
                    NO_VISUAL_DATA
                  </div>
                )}
                {/* CRT Effect Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(204,255,0,0.02)_1px,transparent_1px)] bg-[length:100%_4px] opacity-40" />
              </div>

              {/* Report Content */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-6 group-hover:text-[#CCFF00] transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-[11px] font-mono text-white/40 uppercase tracking-wider leading-relaxed line-clamp-4 mb-8">
                  {post.content}
                </p>
                <button className="mt-auto text-[10px] font-mono text-[#CCFF00] uppercase tracking-[0.5em] text-left hover:brightness-125 transition-all flex items-center gap-2">
                  <span>{">"} READ_FULL_REPORT</span>
                  <div className="w-8 h-[1px] bg-[#CCFF00]/30 group-hover:w-16 transition-all" />
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Ambient Grid */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:60px_60px] opacity-40" />
    </div>
  );
}
