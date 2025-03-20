'use client';

import { FC, ReactNode, createContext, useState } from 'react';

type MenuContextType = {
  showSidebar: boolean;
  setShowSidebar: (showSidebar: boolean) => void;
};

type MenuProviderProps = {
  children: ReactNode;
};

export const MenuContext = createContext<MenuContextType>({
  showSidebar: false,
  setShowSidebar: () => {},
});

export const MenuProvider: FC<MenuProviderProps> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <MenuContext.Provider
      value={{
        showSidebar,
        setShowSidebar,
      }}>
      {children}
    </MenuContext.Provider>
  );
};
