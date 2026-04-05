import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CartItem } from '@/store/useCartStore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia' as any,
});

/**
 * CHECKOUT_ENDPOINT: Secure payment session generation.
 */
export async function POST(req: Request) {
  try {
    const { items }: { items: CartItem[] } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: 'RIG_EMPTY' }, { status: 400 });
    }

    // Map hardware to Stripe format
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.imageUrl ? [item.imageUrl] : [],
          metadata: {
            productId: item.id,
          },
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/catalog`,
      metadata: {
        hardware_keys: items.map(i => i.id).join(','),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('STRIPE_SESSION_ERR:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
