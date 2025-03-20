import { getCategories } from '@/lib/airtable-client';
import CategoryItem from './category-item';

const Categories = async () => {
  const categories = await getCategories();

  return (
    <>
      <CategoryItem category={null} />
      {categories.map((category, index) => (
        <CategoryItem key={index} category={category} />
      ))}
    </>
  );
};

export default Categories;
