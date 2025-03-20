import { stripe } from '@/lib/stripe';

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};

export const createOrRetrieveCustomer = async (email: string) => {
  const existing = await stripe.customers.list({ email: email });

  if (existing.data.length > 0) {
    return existing.data[0].id;
  }

  // Create customer if doesn't exist
  const customerData: { email?: string } = {
    email: email,
  };
  const customer = await stripe.customers.create(customerData);

  console.log(`New customer created and inserted for ${customer.email}.`);
  return customer.id;
};
