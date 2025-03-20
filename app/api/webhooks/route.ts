import type { Stripe } from 'stripe';
import { NextResponse } from 'next/server';
import {
  createProduct,
  upgradeProduct,
  downgradeProduct,
} from '@/lib/airtable-client';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get('stripe-signature') as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    // On error, log and return the error message.
    if (err! instanceof Error) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Successfully constructed event.
  console.log('✅ Success:', event.id);

  const permittedEvents: string[] = [
    'checkout.session.completed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'customer.subscription.deleted',
  ];

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          data = event.data.object as Stripe.Checkout.Session;
          console.log(`💰 CheckoutSession status: ${data.payment_status}`);
          if (data.payment_status === 'paid') {
            if (!data.metadata) {
              throw new Error('Missing tool metadata');
            }

            if (!data.customer) {
              throw new Error('Missing customer email');
            }

            if (data.mode === 'subscription') {
              // upgrade listing
              const { toolId } = data.metadata;

              const upgradedProduct = await upgradeProduct(toolId);
            } else {
              // create product
              const {
                email,
                category,
                description,
                headline,
                url,
                name,
                discountCode,
                discountAmount
              } = data.metadata;

              const createdProduct = await createProduct(
                {
                  title: name,
                  slug: name.toLowerCase().replaceAll(' ', '-'),
                  link: url,
                  headline,
                  description,
                  email,
                  isApproved: false,
                  isFeatured: false,
                  isHidden: false,
                  isPromoted: false,
                  discountCode,
                  discountAmount,
                },
                category
              );
            }
          }
          break;
        case 'payment_intent.payment_failed':
          data = event.data.object as Stripe.PaymentIntent;
          // remove logo and image from Supabase?
          console.log(`❌ Payment failed: ${data.last_payment_error?.message}`);
          break;
        case 'payment_intent.succeeded':
          data = event.data.object as Stripe.PaymentIntent;
          console.log(`💰 PaymentIntent status: ${data.status}`);
          break;
        case 'customer.subscription.deleted':
          data = event.data.object as Stripe.Subscription;
          const { toolId } = data.metadata;

          // downgrade listing
          const product = await downgradeProduct(toolId);
          console.log(`🚫 Subscription status: ${data.status}`);
          break;
        default:
          throw new Error(`Unhhandled event: ${event.type}`);
      }
    } catch (error) {
      return NextResponse.json(
        { message: 'Webhook handler failed' },
        { status: 500 }
      );
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: 'Received' }, { status: 200 });
}
