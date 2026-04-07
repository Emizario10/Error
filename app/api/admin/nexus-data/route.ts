import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * ADMIN_NEXUS_DATA_API: Master telemetry aggregator.
 * Fetches products, profiles, orders, and logs in a single handshake.
 * Calculates tactical deltas for dashboard analytics.
 */
export async function GET() {
  try {
    const [orders, products, profiles, xpLogs] = await Promise.all([
      prisma.order.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      }),
      prisma.product.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.profile.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.xPLog.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: { profile: { select: { username: true } } }
      })
    ]);

    // METRIC_CALCULATION
    const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
    const completedOrders = orders.filter((o: any) => o.status === 'COMPLETED');
    const successRate = orders.length > 0 ? (completedOrders.length / orders.length) * 100 : 100;

    // DELTA_LOGIC (Comparison vs Baseline/Mock)
    // In a real scenario, we'd compare against previous period data.
    // For this build, we use tactical baselines.
    const baselineRevenue = 5000; // Mock last month
    const baselineOrders = 40;
    const baselineOperatives = 10;

    const revenueDelta = ((totalRevenue - baselineRevenue) / baselineRevenue) * 100;
    const ordersDelta = ((orders.length - baselineOrders) / baselineOrders) * 100;
    const operativesDelta = ((profiles.length - baselineOperatives) / baselineOperatives) * 100;

    return NextResponse.json({
      orders,
      products,
      profiles,
      xpLogs,
      metrics: {
        totalRevenue,
        revenueDelta,
        totalOrders: orders.length,
        ordersDelta,
        totalOperatives: profiles.length,
        operativesDelta,
        vaultHealth: successRate,
      }
    });

  } catch (err: any) {
    logger.error('NEXUS_DATA_API_ERR:', err);
    return NextResponse.json({ error: 'VAULT_HANDSHAKE_FAILURE' }, { status: 500 });
  }
}
