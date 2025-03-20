import { getCategories } from '@/lib/airtable-client';
import NewToolPage from '@/app/components/new-tool-page';

const NewTool = async () => {
  const categories = await getCategories();

  return <NewToolPage categories={categories} />;
};

export default NewTool;
