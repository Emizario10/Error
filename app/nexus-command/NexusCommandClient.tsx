"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Package, TrendingUp, ShieldCheck, Users, 
  ArrowUpRight, ArrowDownRight, RefreshCw 
} from 'lucide-react';
import OrderFeedClient from './OrderFeedClient';
import ProductTableClient from './ProductTableClient';
import OperativeTable from './OperativeTable';
import LogFeed from './LogFeed';
import IntelligenceDashboard from './IntelligenceDashboard';
import NexusTabs from './NexusTabs';
import AdminAlerts from '@/components/AdminAlerts';
import CyberSkeleton from '@/components/ui/CyberSkeleton';

/**
 * NEXUS_COMMAND_CLIENT: Core dashboard engine powered by React Query.
 * Features real-time telemetry, delta analytics, and intelligent alerting.
 */
export default function NexusCommandClient() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['nexus-data'],
    queryFn: async () => {
      const res = await fetch('/api/admin/nexus-data');
      if (!res.ok) throw new Error('VAULT_SYNC_FAILURE');
      return res.json();
    },
    refetchInterval: 30000, // Sync every 30s
  });

  if (isError) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-6">
        <div className="text-red-500 font-mono text-xs uppercase tracking-[0.5em] animate-pulse">
          [!] CRITICAL_VAULT_HANDSHAKE_ERROR
        </div>
        <button 
          onClick={() => refetch()}
          className="border border-white/10 px-8 py-3 font-mono text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
        >
          [ RE-ESTABLISH_CONNECTION ]
        </button>
      </div>
    );
  }

  const metrics = data ? [
    { 
      label: 'TOTAL_REVENUE', 
      value: `$${data.metrics.totalRevenue.toFixed(2)}`, 
      delta: data.metrics.revenueDelta,
      icon: TrendingUp, 
      color: 'text-tactical' 
    },
    { 
      label: 'TOTAL_EXTRACTIONS', 
      value: data.metrics.totalOrders.toString(), 
      delta: data.metrics.ordersDelta,
      icon: Package, 
      color: 'text-white' 
    },
    { 
      label: 'ACTIVE_OPERATIVES', 
      value: data.metrics.totalOperatives.toString(), 
      delta: data.metrics.operativesDelta,
      icon: Users, 
      color: 'text-blue-400' 
    },
    { 
      label: 'VAULT_HEALTH', 
      value: `${data.metrics.vaultHealth.toFixed(1)}%`, 
      delta: null,
      icon: ShieldCheck, 
      color: 'text-tactical' 
    },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in duration-1000">
      {data && <AdminAlerts products={data.products} />}

      {/* DASHBOARD_HEADER */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-l-4 border-tactical pl-8">
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic">
            NEXUS_COMMAND
          </h2>
          <p className="font-mono text-[11px] text-tactical tracking-[0.6em] uppercase opacity-80 mt-2">
            [ ADMINISTRATIVE_VAULT // NODE: 0x77AF ]
          </p>
        </div>
        
        <div className="flex items-center gap-6 font-mono text-[9px] text-white/20 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <RefreshCw size={10} className={isLoading ? 'animate-spin text-tactical' : ''} />
            <span>Last Sync: {new Date().toLocaleTimeString()}</span>
          </div>
          <span className="text-tactical animate-pulse">● System_Live</span>
        </div>
      </div>

      {/* GLOBAL_METRICS_GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {isLoading ? (
          [...Array(4)].map((_, i) => <CyberSkeleton key={i} height={160} />)
        ) : (
          metrics.map((m, i) => (
            <div key={i} className="bg-[#050505] border border-white/5 p-8 flex flex-col gap-4 group hover:border-tactical/20 transition-all duration-500 relative overflow-hidden">
              <div className="flex justify-between items-start text-white/20 group-hover:text-tactical/40 transition-colors">
                <m.icon size={20} strokeWidth={1.5} />
                {m.delta !== null && (
                  <div className={`flex items-center gap-1 text-[10px] font-black ${
                    m.delta >= 0 
                      ? 'text-tactical drop-shadow-[0_0_8px_var(--tactical-color)]' 
                      : 'text-red-500 animate-pulse'
                  }`}>
                    {m.delta >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(m.delta).toFixed(1)}%
                  </div>
                )}
              </div>
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1 block">
                  {m.label}
                </span>
                <div className={`text-3xl font-black tracking-tight ${m.color}`}>
                  {m.value}
                </div>
              </div>
              
              {/* Dynamic Glow for Delta */}
              {m.delta !== null && m.delta >= 0 && (
                <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-tactical/20 blur-sm" />
              )}
              {m.delta !== null && m.delta < 0 && (
                <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-red-500/20 blur-sm animate-pulse" />
              )}
            </div>
          ))
        )}
      </div>

      {/* TABS_SYSTEM */}
      {isLoading ? (
        <CyberSkeleton height={600} />
      ) : (
        <NexusTabs 
          intelligenceTab={<IntelligenceDashboard />}
          ordersTab={<OrderFeedClient orders={data.orders} />}
          productsTab={<ProductTableClient products={data.products} />}
          operativesTab={<OperativeTable profiles={data.profiles} />}
          logsTab={<LogFeed logs={data.xpLogs} />}
        />
      )}
    </div>
  );
}
