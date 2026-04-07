import { prisma } from '@/lib/prisma';
import OrderFeedClient from './OrderFeedClient';
import ProductTableClient from './ProductTableClient';
import OperativeTable from './OperativeTable';
import LogFeed from './LogFeed';
import { Package, TrendingUp, ShieldCheck, Activity, Users, Database, Terminal as TerminalIcon } from 'lucide-react';
import NexusTabs from './NexusTabs';

/**
 * NEXUS_COMMAND: Central Intelligence Dashboard.
 * Protected administrative vault for real-time extraction monitoring.
 */
export default async function NexusCommandPage() {
  // 1. DATA_EXTRACTION: Fetch all core metrics and entities
  const [orders, allOrders, products, profiles, xpLogs] = await Promise.all([
    prisma.order.findMany({
      take: 15,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    }),
    prisma.order.findMany({ select: { totalAmount: true, status: true } }),
    prisma.product.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.profile.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.xPLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { profile: { select: { username: true } } }
    })
  ]);

  // 2. METRIC_CALCULATION
  const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const successRate = allOrders.length > 0 
    ? (allOrders.filter(o => o.status === 'COMPLETED').length / allOrders.length) * 100 
    : 100;

  const metrics = [
    { label: 'TOTAL_REVENUE', value: `$${totalRevenue.toFixed(2)}`, icon: TrendingUp, color: 'text-tactical' },
    { label: 'TOTAL_EXTRACTIONS', value: allOrders.length.toString(), icon: Package, color: 'text-white' },
    { label: 'ACTIVE_OPERATIVES', value: profiles.length.toString(), icon: Users, color: 'text-blue-400' },
    { label: 'VAULT_HEALTH', value: `${successRate.toFixed(1)}%`, icon: ShieldCheck, color: 'text-tactical' },
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-8 lg:px-20 relative overflow-hidden">
      {/* CRT_SCANLINE_EFFECT */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_3px,3px_100%] opacity-20" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* DASHBOARD_HEADER */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-l-4 border-tactical pl-8">
          <div>
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
              NEXUS_COMMAND
            </h2>
            <p className="font-mono text-[11px] text-tactical tracking-[0.6em] uppercase opacity-80 mt-2">
              [ ADMINISTRATIVE_VAULT // NODE: 0x77AF ]
            </p>
          </div>
          
          <div className="flex gap-4 font-mono text-[9px] text-white/20 uppercase tracking-widest">
            <span>Uptime: 99.99%</span>
            <span className="text-tactical animate-pulse">● System_Live</span>
          </div>
        </div>

        {/* GLOBAL_METRICS_GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((m, i) => (
            <div key={i} className="bg-[#050505] border border-white/5 p-8 flex flex-col gap-4 group hover:border-tactical/20 transition-all duration-500">
              <div className="flex justify-between items-start text-white/20 group-hover:text-tactical/40 transition-colors">
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

        {/* TABS_SYSTEM */}
        <NexusTabs 
          ordersTab={<OrderFeedClient orders={orders} />}
          productsTab={<ProductTableClient products={products} />}
          operativesTab={<OperativeTable profiles={profiles} />}
          logsTab={<LogFeed logs={xpLogs} />}
        />
      </div>

      {/* AMBIENT_BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:50px_50px] opacity-30" />
    </div>
  );
}
