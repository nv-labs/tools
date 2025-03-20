'use client';

import { FC, ReactNode, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

type Props = {
  children: ReactNode;
};

const Homepage: FC<Props> = ({ children }) => {
  const searchParams = useSearchParams();
  const created = searchParams.get('c_id');
  const upgraded = searchParams.get('upg_id');

  useEffect(() => {
    if (created) {
      toast.success('Your tool will be reviewed soon', {
        duration: 7000,
        position: 'top-center',
      });
    } else if (upgraded) {
      toast.success('Your tool has been upgraded', {
        duration: 7000,
        position: 'top-center',
      });
    }
  }, [created, upgraded]);

  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default Homepage;
