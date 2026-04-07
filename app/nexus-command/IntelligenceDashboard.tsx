"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, 
  BarChart, Bar, ResponsiveContainer, Cell 
} from 'recharts';
import { Calendar, RefreshCw, TrendingUp, Package, CreditCard, Activity } from 'lucide-react';

type DayStat = {
  date: string;
  orders: number;
  revenue: number;
};

type Stats = {
  salesByDay: DayStat[];
  kpis: {
    totalRevenue: number;
    totalOrders: number;
    avgTicket: number;
  };
};

/**
 * INTELLIGENCE_DASHBOARD: Real-time visual activity monitor.
 * Provides deep-dive metrics for Nexus Command operatives.
 */
export default function IntelligenceDashboard() {
  const [data, setData] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Default range: last 7 days
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const [dateRange, setDateRange] = useState({
    from: sevenDaysAgo.toISOString().split('T')[0],
    to: today.toISOString().split('T')[0]
  });

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/stats?from=${dateRange.from}&to=${dateRange.to}`);
      if (res.ok) {
        setData(await res.json());
      }
    } catch (err) {
      console.error('FETCH_STATS_FAIL:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (!data && loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-4">
        <RefreshCw className="text-tactical animate-spin" size={32} />
        <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.5em]">Gathering_Intelligence...</span>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* 1. DATE_FILTERS */}
      <div className="flex flex-wrap items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest block">Start_Node</label>
          <div className="relative">
            <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-tactical/40" />
            <input 
              type="date" 
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="bg-black border border-white/10 p-2 pl-9 text-[10px] font-mono text-white focus:border-tactical transition-colors outline-none"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest block">End_Node</label>
          <div className="relative">
            <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-tactical/40" />
            <input 
              type="date" 
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="bg-black border border-white/10 p-2 pl-9 text-[10px] font-mono text-white focus:border-tactical transition-colors outline-none"
            />
          </div>
        </div>
        <button 
          onClick={fetchStats}
          disabled={loading}
          className="bg-tactical/10 border border-tactical/30 text-tactical px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-tactical/20 transition-all flex items-center gap-2"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          {loading ? 'RE-SCANNING...' : 'UPDATE_VIEW'}
        </button>
      </div>

      {/* 2. KPI_GRID */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard 
            label="Total_Extraction_Revenue" 
            value={`$${data.kpis.totalRevenue.toFixed(2)}`} 
            icon={CreditCard}
            color="text-tactical" 
          />
          <KpiCard 
            label="Verified_Extractions" 
            value={data.kpis.totalOrders} 
            icon={Package}
            color="text-white" 
          />
          <KpiCard 
            label="Average_Payload_Value" 
            value={`$${data.kpis.avgTicket.toFixed(2)}`} 
            icon={TrendingUp}
            color="text-blue-400" 
          />
        </div>
      )}

      {/* 3. CHART_ARRAY */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard title="Revenue_Timeline // Daily_Flow">
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

          <ChartCard title="Extraction_Volume // Node_Activity">
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
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-black border border-white/5 p-8 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl -mr-12 -mt-12 rounded-full group-hover:bg-tactical/5 transition-colors" />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">{label}</span>
          <Icon size={16} className="text-white/10 group-hover:text-tactical transition-colors" />
        </div>
        <div className={`text-4xl font-black tracking-tighter ${color}`}>{value}</div>
        <div className="h-[1px] w-full bg-white/5 overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="h-full w-1/3 bg-tactical opacity-20"
          />
        </div>
      </div>
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

import { motion } from 'framer-motion';
