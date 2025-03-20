'use client';

import { FC } from 'react';
import Link from 'next/link';
import SVG from 'react-inlinesvg';
import { Category } from '@/types/category';

type Props = {
  category: Category | null;
};

const CategoryItem: FC<Props> = ({ category }) => {

  return category ? (
    <Link
      href={'/category/' + category.slug}
      className="btn btn-ghost btn-sm flex items-center">
      <div className="grid place-items-center">
        <SVG src={category.icon} className="w-4 h-4 lg:w-5 lg:h-5" />
      </div>
      <div className="text-xs md:text-[14px] font-medium">{category.name}</div>
      {category.count > 0 && (
        <span className="md:ml-1 badge badge-sm badge-accent">
          {category.count}
        </span>
      )}
    </Link>
  ) : (
    <Link
      href="/"
      className="btn btn-ghost btn-sm flex items-center">
      <div className="grid place-items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 lg:w-5 lg:h-5">
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        </svg>
      </div>
      <div className="text-xs md:text-[14px] font-medium">All</div>
    </Link>
  );
};

export default CategoryItem;
