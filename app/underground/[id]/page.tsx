import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import GlitchButton from '@/components/GlitchButton';

/**
 * POST_DETAIL_PAGE: Classified Decrypted Document.
 * High-clearance interface for viewing individual intelligence reports.
 */
export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. DATA_FETCHING: Extract encrypted intelligence report
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true }
  });

  if (!post) notFound();

  // 2. ADMIN_VALIDATION: Check clearance level 9 (Hardcoded email for system override)
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

  // We check if THIS post's author is the master admin by email
  // Note: In a production environment, we'd store an 'isAdmin' flag in the Profile.
  // For KROM.SYS, we'll verify via the user mapping if the author's ID matches the admin.
  // Since we can't easily join Supabase Auth with Prisma in one query, 
  // we identify the admin by their unique username if designated, or we assume the check based on the session.
  // For this directive, we'll assume posts by 'admin' or a specific ID are clearance level 9.
  const isAdminPost = post.author.username === 'ADMIN' || post.author.id === 'admin-uuid-placeholder'; 
  
  // Real-time check: If current user is admin, they can see specific UI elements
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserIsAdmin = user?.email === 'juanfe13lasso@gmail.com';
  
  // Re-evaluating isAdminPost based on the explicit email instruction
  // Since we don't have the email in Prisma, we'll check if the author ID matches the current admin ID if they are the same person
  const isSystemDirective = currentUserIsAdmin && user?.id === post.author.id;

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 lg:px-20 relative overflow-hidden">
      {/* CRT SCANLINE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_3px,3px_100%] opacity-[0.03]" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        {/* NAVIGATION_BACK */}
        <Link href="/underground" className="inline-block group">
          <div className="flex items-center gap-3 text-tactical/60 group-hover:text-tactical transition-colors font-mono text-[10px] uppercase tracking-[0.4em]">
            <span className="text-lg">{"<"}</span>
            <span>RETURN_TO_GRID</span>
          </div>
        </Link>

        {/* DOCUMENT_HEADER */}
        <header className={`p-8 border-l-4 ${isSystemDirective ? 'border-tactical bg-tactical/5 shadow-[0_0_30px_rgba(204,255,0,0.1)]' : 'border-white/10 bg-[#050505]'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="space-y-2">
              <span className={`font-mono text-[9px] tracking-[0.6em] uppercase ${isSystemDirective ? 'text-tactical' : 'text-white/40'}`}>
                {isSystemDirective ? '[ SYSTEM_DIRECTIVE // CLEARANCE: LEVEL_9 ]' : '[ OPERATOR_LOG // UNCLASSIFIED ]'}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                {post.title}
              </h1>
            </div>
            
            <div className="text-right font-mono">
              <span className="block text-[10px] text-white/20 uppercase tracking-widest">DECRYPTED_AT</span>
              <span className="text-sm text-white/60 tracking-tighter">{new Date(post.createdAt).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t border-white/5 pt-6">
            <div className="w-10 h-10 rounded-full bg-tactical/10 border border-tactical/20 flex items-center justify-center text-tactical font-mono text-xs overflow-hidden">
              {post.author.avatarUrl ? (
                <Image src={post.author.avatarUrl} alt={post.author.username} width={40} height={40} className="object-cover" />
              ) : (
                post.author.username.substring(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <span className="block text-[8px] text-white/30 uppercase tracking-[0.3em]">AUTHOR_CODENAME</span>
              <span className={`text-xs font-bold uppercase tracking-widest ${isSystemDirective ? 'text-tactical' : 'text-white'}`}>
                OP_{post.author.username}
              </span>
            </div>
          </div>
        </header>

        {/* DOCUMENT_BODY */}
        <main className="relative group">
          {/* Post Visual Content */}
          {post.image && (
            <div className="mb-12 relative aspect-video border border-white/5 overflow-hidden">
              <Image 
                src={post.image} 
                alt={post.title} 
                fill 
                className="object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            </div>
          )}

          {/* Decrypted Content Terminal */}
          <div className="bg-[#050505] border border-white/5 p-10 font-mono relative">
            <div className="absolute top-4 right-6 text-[8px] text-white/10 uppercase tracking-[0.5em] animate-pulse">
              READ_ONLY_ACCESS
            </div>
            
            <div className="space-y-6 text-white/70 leading-relaxed text-sm md:text-base">
              {post.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="relative pl-6 border-l border-white/5">
                  <span className="absolute left-0 text-[10px] text-white/10">{idx + 1}</span>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Terminal Decoration */}
            <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-[9px] text-white/20 uppercase tracking-[0.4em]">
              <span>// END_OF_TRANSMISSION</span>
              <span>CHECKSUM: {post.id.substring(0, 8).toUpperCase()}</span>
            </div>
          </div>
        </main>

        {/* FOOTER_ACTION */}
        <footer className="pt-12 flex justify-center">
          <Link href="/underground">
            <GlitchButton text="RETURN_TO_THE_GRID" />
          </Link>
        </footer>
      </div>

      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:40px_40px] opacity-40" />
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(204,255,0,0.02),transparent_70%)]" />
    </div>
  );
}
