import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { UserData } from '@/types/user-data';

type GetResponse = NextResponse<{
  user?: UserData | null;
  error?: string;
}>;

export const GET = async (req: Request): Promise<GetResponse> => {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        user: null,
      });
    }

    // const profiles = await supabase
    //   .from('profiles')
    //   .select('*')
    //   .eq('id', user.id);

    return NextResponse.json({
      user: { ...user },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
};
