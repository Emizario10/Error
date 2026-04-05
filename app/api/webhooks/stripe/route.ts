import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * STRIPE_WEBHOOK_HANDLER: Secure Extraction Logic
 * Finalizes the lifecycle of a tactical hardware deployment.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    // 1. SIGNATURE_VERIFICATION: Ensure request originates from Stripe HQ.
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`[SEC_BREACH] WEBHOOK_VERIFICATION_FAILED: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 2. EXTRACTION_PROTOCOL: Listen only for completed sessions.
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // 3. RETRIEVE_PAYLOAD: Get the specific line items from the session.
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product'],
      });

      // 4. VAULT_STORAGE: Atomic creation of Order and linked OrderItems.
      const order = await prisma.order.create({
        data: {
          stripeSessionId: session.id,
          totalAmount: session.amount_total ? session.amount_total / 100 : 0,
          status: 'COMPLETED',
          items: {
            create: lineItems.data.map((item) => {
              // Retrieve the productId from the metadata we injected during session creation.
              // Note: item.price.product might be an object due to the expand option.
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

      console.log("--- EXTRACTION_LOGGED_SUCCESSFULLY ---");
      console.log(`VAULT_ID: ${order.id}`);
      console.log(`STATUS: ${order.status}`);
      
    } catch (dbErr: any) {
      console.error(`[VAULT_ERR] DATABASE_SYNC_FAILED: ${dbErr.message}`);
      // Returning 500 signals Stripe to retry the delivery later.
      return NextResponse.json({ error: 'VAULT_SYNC_ERROR' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
