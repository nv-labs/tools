import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: any) {
  const { searchParams } = new URL(req.url);
  const token_hash = searchParams.get('token_hash');
  const type: any = searchParams.get('type');
  const next = searchParams.get('next') ?? '/';

  if (token_hash && type) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      return NextResponse.redirect(new URL(`/${next.slice(1)}`, req.url));
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', req.url));
}
