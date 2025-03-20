import Link from 'next/link';
import Image from 'next/image';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getProductsByUser } from '@/lib/airtable-client';

import UpgradeTool from '@/app/components/upgrade-tool';

const MyTools = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) return null;

  const tools = await getProductsByUser(user?.email);

  return (
    <main className="max-w-lg mx-auto py-5 px-7 flex flex-col gap-8">
      <h1 className="text-3xl font-bold">
        My Tools
      </h1>

      {tools.length > 0 ? (
        <div className="flex flex-col gap-4">
          {tools.map((tool, id) => (
            <div
              className={`flex flex-col justify-center gap-4 p-4 rounded bg-light-100 transition-all ${tool.isPromoted ? 'border border-accent' : ''}`}
              key={id}>
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-black dark:text-white">
                      {tool.title}
                    </h2>
                    {tool.isHidden && (
                      <span className="text-xs border-[1px] border-dark-200 px-1 py-0.25 rounded">
                        Hidden
                      </span>
                    )}
                    {tool.isPromoted && (
                      <span className="badge badge-accent badge-sm">
                        Promoted
                      </span>
                    )}
                  </div>
                  {tool.headline && (
                    <p className="text-sm text-gray-600">
                      {tool.headline}
                    </p>
                  )}

                  <div className="flex flex-row gap-2 items-center mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="0.625rem"
                      height="0.625rem"
                      viewBox="0 0 10 10"
                      fill="none">
                      <circle
                        cx="5"
                        cy="5"
                        r="5"
                        fill={tool.isApproved ? '#2CA56B' : '#e4a00d'}
                      />
                    </svg>
                    <p className="text-sm text-gray-600 font-medium">
                      {tool.isApproved ? 'Approved' : 'In review'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="self-end flex gap-3 items-center">
                {!tool.isHidden && tool.isApproved && (
                  <Link href={`/tool/${tool.slug}`} className="text-sm text-gray-600">
                    View
                  </Link>
                )}
                <Link href={`/edit-tool/${tool.slug}`} className="text-sm text-gray-600">
                  Edit
                </Link>
                {!tool.isPromoted && tool.isApproved && <UpgradeTool tool={tool} user={user} />}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="badge badge-neutral badge-lg px-4 py-3">
          No tools yet
        </div>
      )}

    </main>
  );
};

export default MyTools;
