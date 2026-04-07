"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, 
  BarChart, Bar, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Calendar, RefreshCw, TrendingUp, Package, 
  CreditCard, Activity, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberSkeleton from '@/components/ui/CyberSkeleton';

type DayStat = {
  date: string;
  orders: number;
  revenue: number;
};

type Stats = {
  salesByDay: DayStat[];
  kpis: {
    totalRevenue: number;
    revenueDelta: number;
    totalOrders: number;
    ordersDelta: number;
    avgTicket: number;
  };
};

/**
 * INTELLIGENCE_DASHBOARD: Upgraded with React Query and Delta logic.
 * Tactical market visualization for high-clearance operatives.
 */
export default function IntelligenceDashboard() {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const [dateRange, setDateRange] = useState({
    from: sevenDaysAgo.toISOString().split('T')[0],
    to: today.toISOString().split('T')[0]
  });

  const { data, isLoading, isError, refetch } = useQuery<Stats>({
    queryKey: ['admin-stats', dateRange.from, dateRange.to],
    queryFn: async () => {
      const res = await fetch(`/api/admin/stats?from=${dateRange.from}&to=${dateRange.to}`);
      if (!res.ok) throw new Error('TELEMETRY_LINK_FAILURE');
      return res.json();
    },
    refetchInterval: 60000, // Background sync every 60s
  });

  if (isError) {
    return (
      <div className="py-20 text-center border border-red-500/20 bg-red-500/5">
        <span className="font-mono text-xs text-red-500 uppercase tracking-[0.5em] animate-pulse">
          [!] CRITICAL_DATA_LINK_FAILURE
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 1. DATE_FILTERS */}
      <div className="flex flex-wrap items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest block">Period_Start</label>
          <div className="relative">
            <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-tactical/40" />
            <input 
              type="date" 
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="bg-black border border-white/10 p-2 pl-9 text-[10px] font-mono text-white focus:border-tactical outline-none"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest block">Period_End</label>
          <div className="relative">
            <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-tactical/40" />
            <input 
              type="date" 
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="bg-black border border-white/10 p-2 pl-9 text-[10px] font-mono text-white focus:border-tactical outline-none"
            />
          </div>
        </div>
        <button 
          onClick={() => refetch()}
          className="bg-tactical/10 border border-tactical/30 text-tactical px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-tactical/20 transition-all flex items-center gap-2"
        >
          <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? 'SYNCING...' : 'RE-SCAN_RANGE'}
        </button>
      </div>

      {/* 2. KPI_GRID WITH DELTAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading && !data ? (
          [...Array(3)].map((_, i) => <CyberSkeleton key={i} height={160} />)
        ) : data && (
          <>
            <KpiDeltaCard 
              label="Period_Revenue" 
              value={`$${data.kpis.totalRevenue.toFixed(2)}`} 
              delta={data.kpis.revenueDelta}
              icon={CreditCard}
            />
            <KpiDeltaCard 
              label="Extraction_Volume" 
              value={data.kpis.totalOrders} 
              delta={data.kpis.ordersDelta}
              icon={Package}
            />
            <KpiDeltaCard 
              label="Avg_Payload" 
              value={`$${data.kpis.avgTicket.toFixed(2)}`} 
              delta={null}
              icon={TrendingUp}
            />
          </>
        )}
      </div>

      {/* 3. CHART_ARRAY */}
      <AnimatePresence mode="wait">
        {isLoading && !data ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <CyberSkeleton height={380} />
            <CyberSkeleton height={380} />
          </motion.div>
        ) : data && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <ChartCard title="Revenue_Timeline // Market_Flow">
              <div className="h-[300px] w-full mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.salesByDay}>
                    <CartesianGrid stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#ffffff20" 
                      fontSize={8} 
                      tickFormatter={(val) => val.split('-').slice(1).join('/')}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#ffffff20" 
                      fontSize={8} 
                      axisLine={false} 
                      tickLine={false}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', fontSize: '10px', fontFamily: 'monospace' }}
                      itemStyle={{ color: '#CCFF00' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="var(--tactical-color)" 
                      strokeWidth={3}
                      dot={{ r: 2, fill: 'var(--tactical-color)', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#fff', stroke: 'var(--tactical-color)', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Extraction_Density // Activity_Map">
              <div className="h-[300px] w-full mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.salesByDay}>
                    <CartesianGrid stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#ffffff20" 
                      fontSize={8} 
                      tickFormatter={(val) => val.split('-').slice(1).join('/')}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#ffffff20" 
                      fontSize={8} 
                      axisLine={false} 
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', fontSize: '10px', fontFamily: 'monospace' }}
                      cursor={{ fill: '#ffffff05' }}
                    />
                    <Bar dataKey="orders" fill="#333" radius={[2, 2, 0, 0]}>
                      {data.salesByDay.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.orders > 0 ? 'var(--tactical-color)' : '#111'} opacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KpiDeltaCard({ label, value, delta, icon: Icon }: any) {
  const isPositive = delta >= 0;
  
  return (
    <div className="bg-black border border-white/5 p-8 relative overflow-hidden group">
      <div className="relative z-10 space-y-4">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">{label}</span>
          <Icon size={16} className="text-white/10 group-hover:text-tactical transition-colors" />
        </div>
        
        <div className="text-4xl font-black tracking-tighter text-white">{value}</div>
        
        {delta !== null && (
          <div className={`flex items-center gap-2 text-[11px] font-black ${
            isPositive ? 'text-tactical drop-shadow-[0_0_8px_var(--tactical-color)]' : 'text-red-500 animate-pulse'
          }`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span className="font-mono">
              {isPositive ? '+' : ''}{delta.toFixed(1)}%
            </span>
            <span className="text-white/10 font-mono font-normal tracking-widest text-[8px] uppercase ml-2">vs_Prev_Period</span>
          </div>
        )}

        <div className={`h-[1px] w-full bg-white/5 overflow-hidden`}>
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className={`h-full w-1/3 ${isPositive ? 'bg-tactical' : 'bg-red-500'} opacity-20`}
          />
        </div>
      </div>
      
      {/* Decorative Glow */}
      {delta !== null && (
        <div className={`absolute -bottom-1 left-0 right-0 h-[2px] blur-sm transition-all duration-1000 ${
          isPositive ? 'bg-tactical/20' : 'bg-red-500/40'
        }`} />
      )}
    </div>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <div className="bg-black border border-white/5 p-8 relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest">{title}</h3>
        <Activity size={14} className="text-tactical opacity-40 animate-pulse" />
      </div>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {children}
    </div>
  );
}
