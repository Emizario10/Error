import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ProductCard from '@/components/ProductCard';
import CatalogLoreTrigger from './CatalogLoreTrigger';

/**
 * CATALOG_PAGE: Server-side ARSENAL Deployment
 * Integrated with Operator Bypass (XP & Clearance System).
 */
export default async function CatalogPage() {
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

  // 1. FETCH OPERATOR CLEARANCE (SSR)
  const { data: { user } } = await supabase.auth.getUser();
  let clearanceLevel = 1;

  if (user) {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { clearanceLevel: true }
    });
    if (profile) clearanceLevel = profile.clearanceLevel;
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#000000] pt-32 pb-20 px-6 lg:px-20 relative overflow-hidden">
      <CatalogLoreTrigger />

      {/* Header Panel */}
      <div className="mb-20 border-l-4 border-tactical pl-8">
        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4">
          ARSENAL_STOCK
        </h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <p className="font-mono text-[11px] text-tactical tracking-[0.6em] uppercase opacity-90">
            [ DEPLOYABLE_HARDWARE // PROTOCOL: ONLINE ]
          </p>
          {user && (
            <span className="font-mono text-[9px] px-2 py-0.5 border border-tactical/30 text-tactical bg-tactical/5 uppercase">
              // Operator_Rank: L{clearanceLevel}
            </span>
          )}
        </div>
      </div>

      {/* Deployment Grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-48 border border-dashed border-[#222]">
          <span className="text-tactical font-mono text-sm tracking-[0.8em] uppercase animate-pulse">
            SYS.WARN: NO DEPLOYMENTS FOUND IN ARSENAL.
          </span>
          <p className="text-white/20 text-[10px] mt-6 font-mono tracking-widest uppercase">
            // CHECK BACK AFTER_RELOAD_CYCLE
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} clearanceLevel={clearanceLevel} />
          ))}
        </div>
      )}

      {/* Ambient Grid Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:60px_60px] opacity-40" />
    </div>
  );
}
