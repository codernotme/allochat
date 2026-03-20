import type { Metadata } from 'next';
import { LeaderboardView } from './_components/LeaderboardView';

export const metadata: Metadata = { title: 'Leaderboard' };

export default function LeaderboardPage() {
  return <LeaderboardView />;
}
