'use client';

import { FC, ReactNode, createContext, useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { UserData } from '@/types/user-data';

type UserContextType = {
  user: UserData | null;
  setUser: (user: UserData) => void;
  signOut: () => Promise<void>;
};

type UserProviderProps = {
  children: ReactNode;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  signOut: () => Promise.resolve(),
});

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { user: fetchedUser } = await fetch('/api/get-user').then((res) =>
        res.json()
      );

      if (fetchedUser) {
        setUser(fetchedUser);
      }
    }

    fetchData();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        signOut,
      }}>
      {children}
    </UserContext.Provider>
  );
};
