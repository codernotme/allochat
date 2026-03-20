import type { Role } from './roles';
import type { SubscriptionTier } from './subscription-plans';
import { hasRoleOrAbove } from './roles';

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  section: 'main' | 'social' | 'discover' | 'admin';
  requiredRole?: Role;
  requiredTier?: SubscriptionTier;
  badge?: 'notifications' | 'friends' | 'messages';
};

export const NAV_ITEMS: NavItem[] = [
  // ─── Main ─────────────────────────────────────
  {
    id: 'lobby',
    label: 'Lobby',
    href: '/lobby',
    icon: 'solar:home-2-linear',
    section: 'main',
  },
  {
    id: 'messages',
    label: 'Messages',
    href: '/messages',
    icon: 'solar:chat-round-dots-linear',
    section: 'main',
    badge: 'messages',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/notifications',
    icon: 'solar:bell-linear',
    section: 'main',
    badge: 'notifications',
  },
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    href: '/leaderboard',
    icon: 'solar:cup-star-linear',
    section: 'main',
  },
  {
    id: 'random-match',
    label: 'Random Match',
    href: '/random',
    icon: 'solar:shuffle-linear',
    section: 'main',
  },
  // ─── Social ────────────────────────────────────
  {
    id: 'friends',
    label: 'Friends',
    href: '/friends',
    icon: 'solar:users-group-rounded-linear',
    section: 'social',
    badge: 'friends',
  },
  // ─── Discover ──────────────────────────────────
  // Discover links are intentionally omitted until corresponding pages exist.
  // ─── Admin ─────────────────────────────────────
  {
    id: 'admin-panel',
    label: 'Admin Panel',
    href: '/admin',
    icon: 'solar:shield-keyhole-linear',
    section: 'admin',
    requiredRole: 'admin',
  },
];

export function getNavItemsForUser(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => {
    if (item.requiredRole && !hasRoleOrAbove(role, item.requiredRole)) return false;
    return true;
  });
}
