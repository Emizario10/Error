import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * ADMIN_STATS_API: Gathers telemetry on extractions and revenue.
 * Supports date range filtering for tactical analysis.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
      return NextResponse.json({ error: 'DATE_RANGE_REQUIRED' }, { status: 400 });
    }

    // 1. Fetch Extractions in range
    const extractions = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(from),
          lte: new Date(to),
        },
        status: 'COMPLETED',
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // 2. Group by Day (JavaScript grouping for flexibility)
    const statsMap: Record<string, { date: string; orders: number; revenue: number }> = {};
    
    // Initialize map with all dates in range to avoid gaps
    let current = new Date(from);
    const end = new Date(to);
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      statsMap[dateStr] = { date: dateStr, orders: 0, revenue: 0 };
      current.setDate(current.getDate() + 1);
    }

    // Populate with actual data
    extractions.forEach((ex) => {
      const dateStr = ex.createdAt.toISOString().split('T')[0];
      if (statsMap[dateStr]) {
        statsMap[dateStr].orders += 1;
        statsMap[dateStr].revenue += ex.totalAmount;
      }
    });

    const salesByDay = Object.values(statsMap).sort((a, b) => a.date.localeCompare(b.date));

    // 3. Calculate KPIs
    const totalRevenue = salesByDay.reduce((acc, d) => acc + d.revenue, 0);
    const totalOrders = salesByDay.reduce((acc, d) => acc + d.orders, 0);
    const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return NextResponse.json({
      salesByDay,
      kpis: {
        totalRevenue,
        totalOrders,
        avgTicket,
      },
    });

  } catch (err: any) {
    logger.error('ADMIN_STATS_ERR:', err);
    return NextResponse.json({ error: 'TELEMETRY_FAILURE' }, { status: 500 });
  }
}
