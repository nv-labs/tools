import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Function to retry fetching session
async function retryGetSession(supabase: any, retries: number = 3): Promise<any> {
  let session;
  let error;
  for (let attempt = 0; attempt < retries; attempt++) {
    const result = await supabase.auth.getSession();
    session = result.data.session;
    error = result.error;
    if (!error) break;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
  }
  return { session, error };
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Attempt to get session with retries
  const { session, error } = await retryGetSession(supabase);

  if (error) {
    console.error('Error fetching session after retries:', error.message);
  } else {
    console.log('Session data:', session);
  }

  return res;
}
