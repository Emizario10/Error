import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * ADMIN_NEXUS_DATA_API: Master telemetry aggregator.
 * Fetches products, profiles, orders, and logs in a single handshake.
 * Calculates tactical deltas for dashboard analytics.
 */
export async function GET() {
  try {
    // 1. AUTHORIZATION_CHECK: Verify identity inside the vault
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

    const { data: { user } } = await supabase.auth.getUser();
    const ADMIN_EMAIL = "juanfe13lasso@gmail.com";

    if (!user || user.email !== ADMIN_EMAIL) {
      logger.sec(`UNAUTHORIZED_VAULT_ACCESS_ATTEMPT: ${user?.email || 'ANONYMOUS'}`);
      return NextResponse.json({ error: 'ACCESS_DENIED' }, { status: 403 });
    }

    // 2. DATA_EXTRACTION: Parallel handshake with the database
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

    // 3. METRIC_CALCULATION
    const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
    const completedOrders = orders.filter((o: any) => o.status === 'COMPLETED');
    const successRate = orders.length > 0 ? (completedOrders.length / orders.length) * 100 : 100;

    // 4. DELTA_LOGIC (Comparison vs Baseline)
    const baselineRevenue = 5000; 
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
    // 5. DIAGNOSTIC_LOGGING: Surface the actual failure cause
    logger.error('CRITICAL_VAULT_HANDSHAKE_FAILURE:', {
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    return NextResponse.json({ 
      error: 'VAULT_HANDSHAKE_FAILURE',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined 
    }, { status: 500 });
  }
}
