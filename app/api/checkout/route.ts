import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: { productId: string; quantity: number; name?: string; price?: number }[] = body.items;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Map incoming items to line_items expected by Stripe
    const line_items = items.map((it) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: it.name || `Product ${it.productId}` },
        unit_amount: it.price ?? 1000,
      },
      quantity: it.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe checkout error', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
