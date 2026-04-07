import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * ADMIN_STATS_API: Gathers telemetry with Comparison Logic.
 * Calculates Current Period vs Previous Period for Delta analytics.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
      return NextResponse.json({ error: 'DATE_RANGE_REQUIRED' }, { status: 400 });
    }

    const startDate = new Date(from);
    const endDate = new Date(to);
    
    // Calculate duration to fetch previous period
    const durationMs = endDate.getTime() - startDate.getTime();
    const prevStartDate = new Date(startDate.getTime() - durationMs - 86400000); // Shift back + 1 day
    const prevEndDate = new Date(startDate.getTime() - 86400000);

    // 1. Fetch Current Extractions
    const currentExtractions = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: 'COMPLETED',
      },
      select: { totalAmount: true, createdAt: true },
    });

    // 2. Fetch Previous Extractions (for Delta)
    const prevExtractions = await prisma.order.findMany({
      where: {
        createdAt: { gte: prevStartDate, lte: prevEndDate },
        status: 'COMPLETED',
      },
      select: { totalAmount: true },
    });

    // 3. Process Current Data by Day
    const statsMap: Record<string, { date: string; orders: number; revenue: number }> = {};
    let current = new Date(startDate);
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      statsMap[dateStr] = { date: dateStr, orders: 0, revenue: 0 };
      current.setDate(current.getDate() + 1);
    }

    currentExtractions.forEach((ex) => {
      const dateStr = ex.createdAt.toISOString().split('T')[0];
      if (statsMap[dateStr]) {
        statsMap[dateStr].orders += 1;
        statsMap[dateStr].revenue += ex.totalAmount;
      }
    });

    // 4. Calculate KPIs & Deltas
    const currentRevenue = currentExtractions.reduce((acc, ex) => acc + ex.totalAmount, 0);
    const prevRevenue = prevExtractions.reduce((acc, ex) => acc + ex.totalAmount, 0);
    const revenueDelta = prevRevenue === 0 ? 100 : ((currentRevenue - prevRevenue) / prevRevenue) * 100;

    const currentOrders = currentExtractions.length;
    const prevOrders = prevExtractions.length;
    const ordersDelta = prevOrders === 0 ? 100 : ((currentOrders - prevOrders) / prevOrders) * 100;

    return NextResponse.json({
      salesByDay: Object.values(statsMap).sort((a, b) => a.date.localeCompare(b.date)),
      kpis: {
        totalRevenue: currentRevenue,
        revenueDelta,
        totalOrders: currentOrders,
        ordersDelta,
        avgTicket: currentOrders > 0 ? currentRevenue / currentOrders : 0,
      },
    });

  } catch (err: any) {
    logger.error('ADMIN_STATS_ERR:', err);
    return NextResponse.json({ error: 'TELEMETRY_FAILURE' }, { status: 500 });
  }
}
