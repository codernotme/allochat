import type { Metadata } from 'next';
import { PeerVideoCall } from '@/components/call/PeerVideoCall';
import type { Id } from '@/convex/_generated/dataModel';

type Props = { params: Promise<{ userId: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Random Match Call' };
}

export default async function RandomCallPage({ params }: Props) {
  const { userId } = await params;
  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
      <PeerVideoCall peerId={userId as Id<'users'>} />
    </div>
  );
}
