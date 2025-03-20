import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default async function GuestLayout({ children }: Props) {
  return <>{children}</>;
}
