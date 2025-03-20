import { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type Props = {
  children: ReactNode;
};

const Sidebar: FC<Props> = ({ children }) => {
  const pathname = usePathname();

  if (
    pathname === '/new-tool' ||
    pathname === '/my-tools' ||
    pathname.includes('/edit-tool/')
  )
    return null;

  return (
    <div
      className={`mb-8 flex gap-1 md:gap-2 flex-wrap w-full md:justify-center`}>
      {children}
    </div>
  );
};

export default Sidebar;
