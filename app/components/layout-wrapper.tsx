'use client';

import { FC, ReactNode } from 'react';
import Sidebar from './sidebar';
import Header from './header';

type Props = {
  categories: ReactNode;
  children: ReactNode;
};

const LayoutWrapper: FC<Props> = ({ categories, children }) => {

  return (
    <main>
      <div className="container">
        <div className="main pb-24">
          <Header/>
          <Sidebar>{categories}</Sidebar>
          {children}
        </div>
      </div>
    </main>
  );
};

export default LayoutWrapper;
