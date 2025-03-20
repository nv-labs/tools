'use server';

import type { Stripe } from 'stripe';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

import { createOrRetrieveCustomer } from '@/utils/helpers';

export async function createCheckoutSession(
  email: string,
  name: string,
  url: string,
  headline: string,
  description: string,
  category: string,
  discountCode: string,
  discountAmount: string
): Promise<void> {
  const customer = await createOrRetrieveCustomer(email);

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      mode: 'payment',
      submit_type: 'pay',
      payment_method_types: ['card'],
      customer,
      client_reference_id: email,
      line_items: [
        {
          price: `${process.env.STRIPE_PRICE_ID}`,
          quantity: 1,
        },
      ],
      metadata: {
        email,
        name,
        url,
        headline,
        description,
        category,
        discountCode,
        discountAmount,
      },
      success_url: `${headers().get('origin')}/?c_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${headers().get('origin')}/`,
      allow_promotion_codes: true,
    });

  redirect(checkoutSession.url as string);
}

export async function createUpgradeSession(
  email: string,
  toolId: string
): Promise<void> {
  const customer = await createOrRetrieveCustomer(email);

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer,
      client_reference_id: email,
      line_items: [
        {
          price: `${process.env.STRIPE_UPGRADE_PRICE_ID}`,
          quantity: 1,
        },
      ],
      metadata: {
        toolId,
      },
      subscription_data: {
        metadata: {
          toolId,
        },
      },
      success_url: `${headers().get('origin')}/?upg_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${headers().get('origin')}/`,
      allow_promotion_codes: true,
    });

  redirect(checkoutSession.url as string);
}
