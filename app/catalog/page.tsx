import { prisma } from '@/lib/prisma';
import AddToCartButton from '@/components/AddToCartButton';
import Image from 'next/image';

/**
 * CATALOG_PAGE: Server-side ARSENAL Deployment
 */
export default async function CatalogPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#000000] pt-32 pb-20 px-6 lg:px-20 relative overflow-hidden">
      {/* Header Panel */}
      <div className="mb-20 border-l-4 border-[#CCFF00] pl-8">
        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4">
          ARSENAL_STOCK
        </h2>
        <p className="font-mono text-[11px] text-[#CCFF00] tracking-[0.6em] uppercase opacity-90">
          [ DEPLOYABLE_HARDWARE // PROTOCOL: ONLINE ]
        </p>
      </div>

      {/* Deployment Grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-48 border border-dashed border-[#222]">
          <span className="text-[#CCFF00] font-mono text-sm tracking-[0.8em] uppercase animate-pulse">
            SYS.WARN: NO DEPLOYMENTS FOUND IN ARSENAL.
          </span>
          <p className="text-white/20 text-[10px] mt-6 font-mono tracking-widest uppercase">
            // CHECK BACK AFTER_RELOAD_CYCLE
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {products.map((p) => (
            <div 
              key={p.id} 
              className="group relative flex flex-col bg-black border border-white/5 transition-all duration-700 hover:border-[#CCFF00]/40"
            >
              {/* Product Frame: 4:5 Aspect Ratio */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#050505]">
                {p.imageUrl ? (
                  <Image 
                    src={p.imageUrl} 
                    alt={p.name}
                    fill
                    className="object-cover opacity-70 grayscale-[30%] group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white/5 uppercase tracking-[1em] font-mono">
                    VOID_DATA
                  </div>
                )}
                
                {/* Visual Glitch & Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(204,255,0,0.03)_1.5px,transparent_1.5px)] bg-[length:100%_6px] opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                
                {/* Tactical Category Tag */}
                <div className="absolute top-6 left-6 px-3 py-1 border border-[#CCFF00]/40 bg-black/80 backdrop-blur-md">
                   <span className="text-[9px] font-mono text-[#CCFF00] tracking-[0.3em] uppercase font-bold">
                    {p.category || 'GENERIC'}
                   </span>
                </div>
              </div>

              {/* Hardware Specifications Panel */}
              <div className="p-8 flex flex-col flex-grow border-t border-white/5">
                <div className="flex justify-between items-baseline mb-6">
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-[#CCFF00] transition-colors duration-500">
                    {p.name}
                  </h3>
                  <span className="font-mono text-sm text-[#F3F4F6] font-black tracking-tight">
                    ${p.price.toFixed(2)}
                  </span>
                </div>
                
                <p className="text-[11px] text-white/40 font-mono uppercase tracking-[0.2em] leading-relaxed line-clamp-2 mb-8 h-10">
                  {p.description || '// HARDWARE_DESCRIPTION_MISSING'}
                </p>

                <div className="mt-auto">
                  <AddToCartButton product={p} className="w-full text-[10px] py-3 tracking-[0.4em]" />
                </div>
              </div>

              {/* Tech Corner Accent */}
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#CCFF00] opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100" />
            </div>
          ))}
        </div>
      )}

      {/* Ambient Grid Background */}
      <div className="fixed inset-0 pointer-events-none -z-20 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:60px_60px] opacity-40" />
    </div>
  );
}

