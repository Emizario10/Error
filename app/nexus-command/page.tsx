import { prisma } from '@/lib/prisma';
import OrderFeedClient from './OrderFeedClient';
import { Package, TrendingUp, ShieldCheck, Activity } from 'lucide-react';

/**
 * NEXUS_COMMAND: Central Intelligence Dashboard.
 * Protected administrative vault for real-time extraction monitoring.
 */
export default async function NexusCommandPage() {
  // 1. DATA_EXTRACTION: Fetch latest orders and linked hardware
  const orders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  // 2. METRIC_CALCULATION
  const allOrders = await prisma.order.findMany({ select: { totalAmount: true, status: true } });
  const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const successRate = allOrders.length > 0 
    ? (allOrders.filter(o => o.status === 'COMPLETED').length / allOrders.length) * 100 
    : 100;

  const metrics = [
    { label: 'TOTAL_REVENUE', value: `$${totalRevenue.toFixed(2)}`, icon: TrendingUp, color: 'text-[#CCFF00]' },
    { label: 'TOTAL_EXTRACTIONS', value: allOrders.length.toString(), icon: Package, color: 'text-white' },
    { label: 'VAULT_HEALTH', value: `${successRate.toFixed(1)}%`, icon: ShieldCheck, color: 'text-[#CCFF00]' },
    { label: 'SYSTEM_LOAD', value: 'OPTIMAL', icon: Activity, color: 'text-white/40' },
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-8 lg:px-20 relative overflow-hidden">
      {/* CRT_SCANLINE_EFFECT */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_3px,3px_100%] opacity-20" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* DASHBOARD_HEADER */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-l-4 border-[#CCFF00] pl-8">
          <div>
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
              NEXUS_COMMAND
            </h2>
            <p className="font-mono text-[11px] text-[#CCFF00] tracking-[0.6em] uppercase opacity-80 mt-2">
              [ ADMINISTRATIVE_VAULT // NODE: 0x77AF ]
            </p>
          </div>
          
          <div className="flex gap-4 font-mono text-[9px] text-white/20 uppercase tracking-widest">
            <span>Uptime: 99.99%</span>
            <span className="text-[#CCFF00] animate-pulse">● System_Live</span>
          </div>
        </div>

        {/* GLOBAL_METRICS_GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {metrics.map((m, i) => (
            <div key={i} className="bg-[#050505] border border-white/5 p-8 flex flex-col gap-4 group hover:border-[#CCFF00]/20 transition-all duration-500">
              <div className="flex justify-between items-start text-white/20 group-hover:text-[#CCFF00]/40 transition-colors">
                <m.icon size={20} strokeWidth={1.5} />
                <span className="text-[8px] font-mono tracking-widest uppercase">Metric_{i+1}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1 block">
                  {m.label}
                </span>
                <div className={`text-3xl font-black tracking-tight ${m.color}`}>
                  {m.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LIVE_EXTRACTION_FEED_SECTION */}
        <div className="bg-[#050505] border border-white/5 p-1">
           <div className="border border-white/5 p-8">
              <OrderFeedClient orders={orders} />
           </div>
        </div>
      </div>

      {/* AMBIENT_BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:50px_50px] opacity-30" />
    </div>
  );
}
