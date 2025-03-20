import { NextResponse } from 'next/server';
import { getProducts, updateProduct } from '@/lib/airtable-client';
import { Product } from '@/types/product';

type PostResponse = NextResponse<{ product?: Product; error?: string }>;
type GetResponse = NextResponse<{
  products?: Product[];
  error?: string;
}>;

export const GET = async (req: Request): Promise<GetResponse> => {
  try {
    const products = await getProducts();

    return NextResponse.json({
      products: [...products],
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

export const PUT = async (req: Request): Promise<PostResponse> => {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');
  const body = (await req.json()) as Product;

  if (!email || email !== body.email) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
      },
      { status: 400 }
    );
  }

  try {
    await updateProduct({
      ...body,
      slug: body.title.toLowerCase().replaceAll(' ', '-'),
    });

    return NextResponse.json({ product: body }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
};
