import type { Metadata } from 'next';
import { RoomSettingsView } from './_components/RoomSettingsView';

type Props = { params: Promise<{ roomId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: 'Room Settings' };
}

export default async function RoomSettingsPage({ params }: Props) {
  const { roomId } = await params;
  return <RoomSettingsView roomId={roomId as any} />;
}
