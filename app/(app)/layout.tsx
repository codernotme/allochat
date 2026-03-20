import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { ClientLayout } from './ClientLayout';

export const metadata: Metadata = {
  title: {
    default: 'AlloChat',
    template: '%s | AlloChat',
  },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
