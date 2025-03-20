import 'server-only';

import Airtable from 'airtable';
import { Category } from '@/types/category';
import { Product } from '@/types/product';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT as string }).base(
  'appSLyUWzJurNmPlk'
);

export async function getCategories(): Promise<Category[]> {
  let categories: Category[] | null = null;

  try {
    const records = await base('Categories')
      .select({
        view: 'Grid view',
      })
      .all();

    categories = records.map((record) => {
      return {
        id: record.id,
        name: record.fields.name as string,
        icon: record.fields.icon as string,
        slug: record.fields.slug as string,
        count: record.fields.count as number,
      };
    });
  } catch (error) {
    return Promise.reject(error);
  }

  return categories as Category[];
}

export async function getProducts(): Promise<Product[]> {
  let products: Product[] | null = null;

  try {
    const records = await base('Products')
      .select({
        view: 'Grid view',
        // get only approved and public tools
        filterByFormula: 'AND(isApproved = 1, isHidden = 0, isFeatured = 0)',
      })
      .all();

    const categories = await getCategories();

    products = records.map((record) => {
      const categoryId = record.fields.category as string[];

      const matchedCategory: Category = categories?.find(
        (category: Category) => category.id === categoryId[0]
      ) as Category;

      return {
        id: record.id,
        title: record.fields.title as string,
        slug: record.fields.slug as string,
        headline: record.fields.headline as string,
        description: record.fields.description as string,
        link: record.fields.link as string,
        category: matchedCategory,
        email: record.fields.email as string,
        submittedAt: record.fields.submittedAt as string,
        updatedAt: record.fields.updatedAt as string,
        isApproved: !record.fields.isApproved ? false : true,
        isHidden: !record.fields.isHidden ? false : true,
        isPromoted: !record.fields.isPromoted ? false : true,
        isFeatured: !record.fields.isFeatured ? false : true,
        discountCode: record.fields.discountCode as string,
        discountAmount: record.fields.discountAmount as string,
      };
    });
  } catch (error) {
    return Promise.reject(error);
  }

  return products as Product[];
}

export async function getProduct(slug: string) {
  // get only one product instead of all products

  const records = await base('Products')
    .select({
      view: 'Grid view',
      filterByFormula: `AND(slug = '${slug}', isApproved = 1, isHidden = 0)`,
    })
    .all();

  if (records.length === 0) return null;

  return {
    id: records[0].id,
    title: records[0].fields.title as string,
    slug: records[0].fields.slug as string,
    headline: records[0].fields.headline as string,
    description: records[0].fields.description as string,
    link: records[0].fields.link as string,
    email: records[0].fields.email as string,
    submittedAt: records[0].fields.submittedAt as string,
    updatedAt: records[0].fields.updatedAt as string,
    isApproved: !records[0].fields.isApproved ? false : true,
    isHidden: !records[0].fields.isHidden ? false : true,
    isPromoted: !records[0].fields.isPromoted ? false : true,
    isFeatured: !records[0].fields.isFeatured ? false : true,
    discountCode: records[0].fields.discountCode as string,
    discountAmount: records[0].fields.discountAmount as string,
  } as Product;
}

export async function getCategory(slug: string) {
  const records = await base('Categories')
    .select({
      view: 'Grid view',
      filterByFormula: `slug = '${slug}'`,
    })
    .all();

  if (records.length === 0) return null;

  return {
    id: records[0].id,
    name: records[0].fields.name as string,
    icon: records[0].fields.icon as string,
    slug: records[0].fields.slug as string,
    count: records[0].fields.count as number,
  } as Category;
}

export async function getProductsByCategory(category: Category) {
  const records = await base('Products')
    .select({
      view: 'Grid view',
      filterByFormula: `AND(category = '${category.name}', isApproved = 1, isHidden = 0)`,
    })
    .all();

  const products = records.map((record) => {
    return {
      id: record.id,
      title: record.fields.title as string,
      slug: record.fields.slug as string,
      headline: record.fields.headline as string,
      description: record.fields.description as string,
      link: record.fields.link as string,
      email: record.fields.email as string,
      submittedAt: record.fields.submittedAt as string,
      updatedAt: record.fields.updatedAt as string,
      isApproved: !record.fields.isApproved ? false : true,
      isHidden: !record.fields.isHidden ? false : true,
      isPromoted: !record.fields.isPromoted ? false : true,
      isFeatured: !record.fields.isFeatured ? false : true,
      discountCode: record.fields.discountCode as string,
      discountAmount: record.fields.discountAmount as string,
    };
  });

  return products;
}

export async function getUserProduct(slug: string, email: string) {
  const records = await base('Products')
    .select({
      view: 'Grid view',
      filterByFormula: `AND(slug = '${slug}', email = '${email}')`,
    })
    .all();

  if (!records[0].fields.category) return null;

  const categories = await getCategories();

  const category = records[0].fields.category as string[];

  const matchedCategory = categories?.find(
    (cat: Category) => cat.id === category[0]
  ) as Category;

  return {
    id: records[0].id,
    title: records[0].fields.title as string,
    slug: records[0].fields.slug as string,
    headline: records[0].fields.headline as string,
    description: records[0].fields.description as string,
    category: matchedCategory,
    link: records[0].fields.link as string,
    email: records[0].fields.email as string,
    submittedAt: records[0].fields.submittedAt as string,
    updatedAt: records[0].fields.updatedAt as string,
    isApproved: !records[0].fields.isApproved ? false : true,
    isHidden: !records[0].fields.isHidden ? false : true,
    isPromoted: !records[0].fields.isPromoted ? false : true,
    isFeatured: !records[0].fields.isFeatured ? false : true,
    discountCode: records[0].fields.discountCode as string,
    discountAmount: records[0].fields.discountAmount as string,
  } as Product;
}

export async function getProductsByUser(email: string) {
  const records = await base('Products')
    .select({
      view: 'Grid view',
      filterByFormula: `email = '${email}'`,
    })
    .all();

  const products = records.map((record) => {
    return {
      id: record.id,
      title: record.fields.title as string,
      slug: record.fields.slug as string,
      headline: record.fields.headline as string,
      description: record.fields.description as string,
      link: record.fields.link as string,
      email: record.fields.email as string,
      submittedAt: record.fields.submittedAt as string,
      updatedAt: record.fields.updatedAt as string,
      isApproved: !record.fields.isApproved ? false : true,
      isHidden: !record.fields.isHidden ? false : true,
      isPromoted: !record.fields.isPromoted ? false : true,
      isFeatured: !record.fields.isFeatured ? false : true,
      discountCode: record.fields.discountCode as string,
      discountAmount: record.fields.discountAmount as string,
    };
  });

  return products;
}

export async function getUserProductById(link: string, email: string) {
  const records = await base('Products')
    .select({
      view: 'Grid view',
      filterByFormula: `AND(link = '${link}', email = '${email}')`,
    })
    .all();

  return {
    id: records[0].id,
    title: records[0].fields.title as string,
    slug: records[0].fields.slug as string,
    headline: records[0].fields.headline as string,
    description: records[0].fields.description as string,
    link: records[0].fields.link as string,
    email: records[0].fields.email as string,
    submittedAt: records[0].fields.submittedAt as string,
    updatedAt: records[0].fields.updatedAt as string,
    isApproved: !records[0].fields.isApproved ? false : true,
    isHidden: !records[0].fields.isHidden ? false : true,
    isPromoted: !records[0].fields.isPromoted ? false : true,
    isFeatured: !records[0].fields.isFeatured ? false : true,
    discountCode: records[0].fields.discountCode as string,
    discountAmount: records[0].fields.discountAmount as string,
  } as Product;
}

export async function createProduct(product: Product, categoryId: string) {
  try {
    const record = await base('Products').create({
      title: product.title,
      slug: product.slug,
      headline: product.headline,
      description: product.description,
      link: product.link,
      email: product.email,
      category: [categoryId],
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      discountCode: product.discountCode,
      discountAmount: product.discountAmount,
    });

    return record;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function updateProduct(product: Product) {
  try {
    const productToUpdate = await getUserProductById(
      product.link,
      product.email
    );

    if (!productToUpdate) {
      return Promise.reject('Product not found');
    }

    if (productToUpdate.email !== product.email) {
      return Promise.reject('Unauthorized');
    }

    const record = await base('Products').update([
      {
        id: product.id as string,
        fields: {
          title: product.title,
          slug: product.slug,
          headline: product.headline,
          description: product.description,
          isApproved: product.isApproved,
          isHidden: product.isHidden,
          isPromoted: product.isPromoted,
          isFeatured: product.isFeatured,
          category: product.category ? [product.category.id] : [],
          updatedAt: new Date().toISOString(),
          discountCode: product.discountCode,
          discountAmount: product.discountAmount,
        },
      },
    ]);

    return record;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

export const upgradeProduct = async (productId: string) => {
  try {
    const record = await base('Products').update([
      {
        id: productId as string,
        fields: {
          isPromoted: true,
          updatedAt: new Date().toISOString(),
        },
      },
    ]);

    return record;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const downgradeProduct = async (productId: string) => {
  try {
    const record = await base('Products').update([
      {
        id: productId as string,
        fields: {
          isPromoted: false,
          updatedAt: new Date().toISOString(),
        },
      },
    ]);

    return record;
  } catch (error) {
    return Promise.reject(error);
  }
};
