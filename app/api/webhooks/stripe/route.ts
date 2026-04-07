import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { grantXP } from '@/lib/gamification';
import { logger } from '@/lib/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    logger.error(`[SEC_BREACH] WEBHOOK_VERIFICATION_FAILED: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 1. SPECIFICALLY LISTEN FOR SESSION COMPLETION
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // CLEAR LOGGING FOR DIAGNOSTICS
    logger.info("SESSION COMPLETED:", session.id);
    logger.info("CLIENT REF ID (UserId):", session.client_reference_id);

    // USE CLIENT_REFERENCE_ID AS PRIMARY LINK TO OPERATIVE
    const profileId = session.client_reference_id;

    if (!profileId) {
      logger.warn("[VAULT_WARN] NO_PROFILE_ID_FOUND_IN_SESSION. ANONYMOUS_ORDER_CREATED.");
    }

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product'],
      });

      // DYNAMIC ECONOMY LOGIC
      const orderItemsData = [];
      
      for (const item of lineItems.data) {
        const stripeProduct = item.price?.product as Stripe.Product;
        const productId = stripeProduct?.metadata?.productId;

        if (!productId) {
          logger.error("[ECONOMY_ERR] PRODUCT_ID_MISSING_IN_METADATA");
          continue;
        }

        // 1. Fetch current status
        const product = await prisma.product.findUnique({
          where: { id: productId }
        });

        if (!product) {
          logger.error(`[ECONOMY_ERR] PRODUCT_NOT_FOUND: ${productId}`);
          continue;
        }

        const quantity = item.quantity || 1;
        
        // 2. Increment sales
        const newSalesCount = product.salesCount + quantity;
        
        // 3. Recalculate Heat Level
        const newHeatLevel = Math.floor(newSalesCount / 5);
        
        // 4. Recalculate Current Price
        // Formula: basePrice + (heatLevel * 8% * basePrice)
        const newCurrentPrice = Math.round(product.basePrice + (newHeatLevel * 0.08 * product.basePrice));

        // 5. Update Product in Vault
        await prisma.product.update({
          where: { id: productId },
          data: {
            salesCount: newSalesCount,
            heatLevel: newHeatLevel,
            currentPrice: newCurrentPrice
          }
        });

        orderItemsData.push({
          productId: productId,
          quantity: quantity,
          unitPrice: item.amount_total / 100 / quantity,
          priceAtTime: newCurrentPrice // Tracking the economy shift
        });
      }

      // Finalize Order Record
      const order = await prisma.order.create({
        data: {
          stripeSessionId: session.id,
          totalAmount: session.amount_total ? session.amount_total / 100 : 0,
          status: 'COMPLETED',
          profileId: profileId || null,
          items: {
            create: orderItemsData.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              priceAtTime: item.priceAtTime
            })),
          },
        },
      });

      logger.info(`--- [ EXTRACTION_LOCKED_TO_PROFILE: ${profileId || 'ANONYMOUS'} ] ---`);
      logger.info(`VAULT_ID: ${order.id}`);
      logger.info(`ECONOMY_UPDATED: ${orderItemsData.length} ITEMS PROCESSED`);

      // 6. GRANT_XP: Reward the operative for the extraction
      if (profileId) {
        const updatedProfile = await grantXP(profileId, 50, "PURCHASE");
        logger.info(`[IDENTITY_PROMOTED] XP_GRANTED: 50 | TOTAL_XP: ${updatedProfile.xp} | CLEARANCE: L${updatedProfile.clearanceLevel}`);
      }
      
    } catch (dbErr: any) {
      logger.error("PRISMA ERROR:", dbErr);
      return NextResponse.json({ error: 'VAULT_SYNC_ERROR' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
