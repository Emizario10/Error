import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24-preview' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`[SEC_BREACH] WEBHOOK_VERIFICATION_FAILED: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    // USE CLIENT_REFERENCE_ID AS PRIMARY LINK TO OPERATIVE
    const profileId = session.client_reference_id || session.metadata?.userId;

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product'],
      });

      const order = await prisma.order.create({
        data: {
          stripeSessionId: session.id,
          totalAmount: session.amount_total ? session.amount_total / 100 : 0,
          status: 'COMPLETED',
          profileId: profileId || null, // LINK TO OPERATIVE
          items: {
            create: lineItems.data.map((item) => {
              const stripeProduct = item.price?.product as Stripe.Product;
              const productId = stripeProduct?.metadata?.productId || "UNKNOWN_HARDWARE";

              return {
                productId: productId,
                quantity: item.quantity || 1,
                unitPrice: item.amount_total / 100 / (item.quantity || 1),
              };
            }),
          },
        },
      });

      console.log(`--- [ EXTRACTION_LOCKED_TO_PROFILE: ${profileId || 'ANONYMOUS'} ] ---`);
      console.log(`VAULT_ID: ${order.id}`);
      
    } catch (dbErr: any) {
      console.error(`[VAULT_ERR] DATABASE_SYNC_FAILED: ${dbErr.message}`);
      return NextResponse.json({ error: 'VAULT_SYNC_ERROR' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
