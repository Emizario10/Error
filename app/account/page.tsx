import { prisma } from '@/lib/prisma';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import { Shield, Package, Clock } from 'lucide-react';

/**
 * ACCOUNT_PAGE: Operator Dashboard.
 * Protected server-side portal for operative status monitoring.
 */
export default async function AccountPage() {
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

  // 1. AUTH_CHECK: Verify operative session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. INTEL_FETCH: Retrieve Profile and Order history
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: true }
      }
    }
  });

  if (!profile) redirect('/register');

  // 3. STATS_CALCULATION
  const totalItems = profile.orders.reduce((acc, order) => acc + order.items.length, 0);
  const accountSeniority = Math.floor((new Date().getTime() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-8 lg:px-20 relative overflow-hidden">
      {/* CRT SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_3px,3px_100%] opacity-20" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-l-4 border-[#CCFF00] pl-8">
          <div>
            <span className="text-[#CCFF00] font-mono text-[10px] tracking-[0.6em] uppercase opacity-50 block mb-2">
              Operator.Status // Established
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
              OPERATOR_DASHBOARD // <span className="text-[#CCFF00]">{profile.username}</span>
            </h1>
          </div>
          <LogoutButton />
        </div>

        {/* STATS_BAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#050505] border border-white/5 p-8 flex items-center gap-6">
            <div className="p-4 bg-[#CCFF00]/5 border border-[#CCFF00]/20 rounded-full text-[#CCFF00]">
              <Package size={24} strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest block mb-1">Total_Items_Extracted</span>
              <div className="text-3xl font-black text-white tracking-tight">{totalItems} UNITS</div>
            </div>
          </div>

          <div className="bg-[#050505] border border-white/5 p-8 flex items-center gap-6">
            <div className="p-4 bg-[#CCFF00]/5 border border-[#CCFF00]/20 rounded-full text-[#CCFF00]">
              <Clock size={24} strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest block mb-1">Account_Seniority</span>
              <div className="text-3xl font-black text-white tracking-tight">{accountSeniority} DAYS_ACTIVE</div>
            </div>
          </div>
        </div>

        {/* EXTRACTION_LOG */}
        <div className="space-y-8">
          <div className="flex items-baseline gap-4">
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">EXTRACTION_LOG</h2>
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest font-bold">// vault_sync_active</span>
          </div>

          <div className="bg-[#050505] border border-white/5 overflow-hidden">
            <table className="w-full text-left font-mono text-[10px] uppercase tracking-widest">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-8 py-4 font-bold text-white/40">Extraction_ID</th>
                  <th className="px-8 py-4 font-bold text-white/40">Timestamp</th>
                  <th className="px-8 py-4 font-bold text-white/40">Payload_Value</th>
                  <th className="px-8 py-4 font-bold text-white/40 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {profile.orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-white/10 italic">
                      // NO_EXTRACTIONS_LOGGED_IN_PROFILE_VAULT
                    </td>
                  </tr>
                ) : (
                  profile.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6 text-white/60 group-hover:text-[#CCFF00] transition-colors">
                        {order.id.split('-')[0]}...{order.id.split('-').pop()}
                      </td>
                      <td className="px-8 py-6 text-white/40">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-white font-bold">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black tracking-[0.2em] ${
                          order.status === 'COMPLETED' 
                            ? 'bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20' 
                            : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                        }`}>
                          {order.status === 'COMPLETED' ? 'SHIPPED' : 'PROCESSING'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AMBIENT DECORATION */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:40px_40px] opacity-40" />
    </div>
  );
}
