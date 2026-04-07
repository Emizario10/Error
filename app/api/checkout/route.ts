import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CartItem } from '@/store/useCartStore';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { logger } from '@/lib/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
});

export async function POST(req: Request) {
  try {
    const { items }: { items: CartItem[] } = await req.json();
    const cookieStore = await cookies();
    
    // 1. IDENTIFY OPERATIVE
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

    if (!items?.length) return NextResponse.json({ error: 'RIG_EMPTY' }, { status: 400 });

    // 2. CONSTRUCT LINE ITEMS
    const lineItems = items.map((item: CartItem) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.imageUrl ? [item.imageUrl] : [],
          metadata: { productId: item.id },
        },
        unit_amount: Math.round(item.currentPrice * 100),
      },
      quantity: 1,
    }));

    // 3. GENERATE SESSION WITH OPERATIVE LINK
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      client_reference_id: user?.id || undefined, // OFFICIAL LINK TO OPERATIVE
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cancel`,
      metadata: {
        userId: user?.id || null, // Redundant but safe for metadata filtering
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    logger.error('STRIPE_SESSION_ERR:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
