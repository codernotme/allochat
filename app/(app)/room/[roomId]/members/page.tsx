import type { Metadata } from 'next';
import { RoomMembersView } from './_components/RoomMembersView';

type Props = { params: Promise<{ roomId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: 'Room Members' };
}

export default async function RoomMembersPage({ params }: Props) {
  const { roomId } = await params;
  return <RoomMembersView roomId={roomId as any} />;
}
