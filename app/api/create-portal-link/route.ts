import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { stripe } from '@/lib/stripe';
import { createOrRetrieveCustomer } from '@/utils/helpers';
import { getURL } from '@/utils/helpers';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const supabase = createRouteHandlerClient({ cookies });
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw Error('Could not get user');
      const customer = await createOrRetrieveCustomer(user.email || '');

      if (!customer) throw Error('Could not get customer');
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        //return_url: `${getURL()}/`,
        return_url: `https://foundertools.co`,
      });
      return new Response(JSON.stringify({ url }), {
        status: 200,
      });
    } catch (err: any) {
      console.log(err);
      return new Response(
        JSON.stringify({ error: { statusCode: 500, message: err.message } }),
        {
          status: 500,
        }
      );
    }
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405,
    });
  }
}
