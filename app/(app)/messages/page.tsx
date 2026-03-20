import type { Metadata } from 'next';
import { MessagesView } from './_components/MessagesView';

export const metadata: Metadata = { title: 'Messages' };

export default function MessagesPage() {
  return <MessagesView />;
}
