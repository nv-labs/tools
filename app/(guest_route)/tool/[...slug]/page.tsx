/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/airtable-client";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import Script from "next/script";

import RevealDiscount from "@/app/components/reveal-discount";

interface ToolProps {
  params: {
    slug: string[];
  };
}

async function getToolFromParams(params: ToolProps["params"]) {
  const slug = params?.slug?.join("/");
  const tool = await getProduct(slug);

  if (!tool) {
    return null;
  }

  return tool;
}

export async function generateMetadata({
  params,
}: ToolProps): Promise<Metadata> {
  const tool = await getToolFromParams(params);

  if (!tool) {
    return {};
  }

  return {
    title: tool.title,
    description: tool.headline,
    openGraph: {
      images: [{ url: "https://foundertools.co/img/og.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} - founder tools directory`,
      description: tool.headline,
      images: ["https://foundertools.co/img/og.jpg"],
    },
  };
}

export async function generateStaticParams(): Promise<ToolProps["params"][]> {
  const tools = await getProducts();

  return tools.map((tool) => ({
    slug: tool.title.split("/"),
  }));
}

export default async function ToolPage({ params }: ToolProps) {
  const tool = await getToolFromParams(params);

  if (!tool) {
    notFound();
  }

  const accessKey = process.env.SCREENSHOTONE_ACCESS_KEY;
  const screenshotUrl: string = `https://api.screenshotone.com/take?cache=true&cache_ttl=2592000&url=${tool.link}&access_key=${accessKey}&viewport_height=1480&block_ads=true&block_cookie_banners=true`;

  return (
    <>
          <Script
        src="https://cdn.usefathom.com/script.js"
        data-site="EFLXCRKN"
        strategy={"lazyOnload"}
      ></Script>
      <div className="main w-full max-h-[100vh] scrollbar-hide overflow-y-auto">
        <div className="lg:flex gap-8 mx-auto mb-24 lg:px-4">
          <div className="lg:w-2/3 mb-8 lg:mb-0">
            <div className="w-full">
              <img
                className="w-full rounded border"
                height={1920}
                width={1480}
                src={screenshotUrl}
                alt={tool.title}
              />
            </div>
          </div>

          <div className="lg:w-1/3 px-0 sm:px-2 md:px-10 lg:pt-2">
            <h1 className="text-2xl lg:text-3xl font-bold my-2">
              {tool.title}
            </h1>
            <p className="mb-5">{tool.headline}</p>
            {tool.description &&
              tool.description.split("\n\n").map((item, i) => {
                return (
                  <>
                    <div className="mb-5">{item}</div>
                  </>
                );
              })}

            {tool.discountCode && (
              <RevealDiscount
                discountCode={tool.discountCode || ""}
                discountAmount={tool.discountAmount || ""}
              />
            )}

            <Link
              href={tool.link}
              target="_blank"
              className="mt-4 btn btn-accent"
            >
              Visit {tool.title}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M8.25 3.75H19.5a.75.75 0 01.75.75v11.25a.75.75 0 01-1.5 0V6.31L5.03 20.03a.75.75 0 01-1.06-1.06L17.69 5.25H8.25a.75.75 0 010-1.5z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
