import { Category } from './category';

export type Product = {
  id?: string;
  title: string;
  slug: string;
  headline: string;
  description: string;
  link: string;
  category?: Category;
  email: string;
  submittedAt?: string;
  updatedAt?: string;
  isApproved: boolean;
  isFeatured: boolean;
  isHidden: boolean;
  isPromoted: boolean;
  discountCode?: string;
  discountAmount?: string;
};
