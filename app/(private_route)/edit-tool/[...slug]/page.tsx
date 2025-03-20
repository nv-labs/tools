import { getCategories, getUserProduct } from '@/lib/airtable-client';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import EditToolPage from '@/app/components/edit-tool-page';

interface ToolProps {
  params: {
    slug: string[];
  };
}

async function getToolFromParams(params: ToolProps['params'], email: string) {
  const slug = params?.slug?.join('/');
  const tool = await getUserProduct(slug, email);

  if (!tool) {
    return null;
  }

  return tool;
}

const EditTool = async ({ params }: ToolProps) => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) return null;

  const tool = await getToolFromParams(params, user.email);

  if (!tool || user.email !== tool.email) {
    redirect('/');
  }

  const categories = await getCategories();

  return <EditToolPage categories={categories} tool={tool} />;
};

export default EditTool;
