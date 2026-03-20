import type { Metadata } from 'next';
import { DMConversationView } from './_components/DMConversationView';

type Props = { params: Promise<{ userId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  return { title: `Chat with user` };
}

export default async function DMConversationPage({ params }: Props) {
  const { userId } = await params;
  return <DMConversationView userId={userId as any} />;
}
