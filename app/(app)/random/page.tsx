import type { Metadata } from 'next';
import { RandomMatchView } from './_components/RandomMatchView';

export const metadata: Metadata = { title: 'Random Match' };

export default function RandomMatchPage() {
  return <RandomMatchView />;
}
