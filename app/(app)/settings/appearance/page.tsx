import type { Metadata } from 'next';
import { AppearanceView } from './_components/AppearanceView';

export const metadata: Metadata = { title: 'Appearance' };

export default function AppearancePage() {
  return <AppearanceView />;
}
