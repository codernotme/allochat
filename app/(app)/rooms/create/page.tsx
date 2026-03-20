import type { Metadata } from 'next';
import { CreateRoomView } from './_components/CreateRoomView';

export const metadata: Metadata = { title: 'Create Room' };

export default function CreateRoomPage() {
  return <CreateRoomView />;
}
