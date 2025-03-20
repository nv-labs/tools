import { notFound } from "next/navigation";
import {
  getCategories,
  getCategory,
  getProductsByCategory,
} from "@/lib/airtable-client";
import ListItem from "@/app/components/list-item";
import { Metadata } from "next";
import Script from "next/script";

interface Props {
  params: {
    slug: string[];
  };
}

async function getCategoryFromParams(params: Props["params"]) {
  const slug = params?.slug?.join("/");
  const category = await getCategory(slug);

  if (!category) {
    return null;
  }

  return category;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryFromParams(params);

  if (!category) {
    return {};
  }

  return {
    title: `${category.name} - founder tools directory`,
    description: "A list of useful tools and resources for startups and growth.",
    openGraph: {
      images: [{ url: "https://foundertools.co/img/og.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} - founder tools directory`,
      description: "A list of useful tools and resources for startups and growth.",
      images: ["https://foundertools.co/img/og.jpg"],
    },
  };
}

export async function generateStaticParams(): Promise<Props["params"][]> {
  const categories = await getCategories();

  return categories.map((category) => ({
    slug: category.name.split("/"),
  }));
}

export default async function CategoryPage({ params }: Props) {
  const category = await getCategoryFromParams(params);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(category);

  return (
    <>
          <Script
        src="https://cdn.usefathom.com/script.js"
        data-site="EFLXCRKN"
        strategy={"lazyOnload"}
      ></Script>
      <div className="main w-full min-h-[200px] scrollbar-hide overflow-y-auto">
        <div className="max-w-[600px] text-center mx-auto mb-6">
          <h1 className="text-4xl font-bold">{category.name}</h1>
        </div>
        <div className="container">
          <div role="list" className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => (
              <ListItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
