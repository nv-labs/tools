/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Product } from "@/types/product";

type Props = {
  item: Product;
};

const FeaturedItem: FC<Props> = ({ item }) => {

  const accessKey = process.env.SCREENSHOTONE_ACCESS_KEY;
  const screenshotUrl: string = `https://api.screenshotone.com/take?cache=true&cache_ttl=2592000&url=${item.link}&access_key=${accessKey}&block_ads=true&block_cookie_banners=true`;

  return (
    <div
      className={`card bg-white bg-opacity-[0.025] shadow-xl overflow-hidden`}
    >
      <div className="relative w-full">
        <Link href={`/tool/${item.slug}`}>
          <Image
            src={screenshotUrl}
            alt={`${item.title} preview`}
            width={800}
            height={480}
          />
        </Link>
      </div>
      <div className="card-body">
        <h2 className="card-title flex gap-2 items-center justify-between">
          {item.title}

          {item.discountCode && (
            <span className="text-xs text-secondary flex gap-1 items-center">
              <svg
                className="w-4 h-4"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="15" cy="9" r="1" fill="currentColor"></circle>
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M12 4.75H19.25V12L12.5535 18.6708C11.7544 19.4668 10.4556 19.445 9.68369 18.6226L5.28993 13.941C4.54041 13.1424 4.57265 11.8895 5.36226 11.1305L12 4.75Z"
                ></path>
              </svg>
              Discount
            </span>
          )}
        </h2>
        <div className="mb-8">{item.headline}</div>
        <div className="card-actions justify-between gap-2">
          <Link href={`/tool/${item.slug}`}>
            <button className="btn btn-primary btn-sm">
              More Info
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width={18}
                height={18}
              >
                <path
                  fillRule="evenodd"
                  d="M8.25 3.75H19.5a.75.75 0 01.75.75v11.25a.75.75 0 01-1.5 0V6.31L5.03 20.03a.75.75 0 01-1.06-1.06L17.69 5.25H8.25a.75.75 0 010-1.5z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedItem;
