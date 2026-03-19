import type { Role } from './roles';
import type { SubscriptionTier } from './subscription-plans';

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
    id: 'events',
    label: 'Events',
    href: '/events',
    icon: 'solar:calendar-linear',
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
  {
    id: 'shop',
    label: 'Shop',
    href: '/shop',
    icon: 'solar:bag-4-linear',
    section: 'discover',
  },
  {
    id: 'plugins',
    label: 'Plugins',
    href: '/plugins/marketplace',
    icon: 'solar:widget-6-linear',
    section: 'discover',
  },
  {
    id: 'subscription',
    label: 'Go Pro',
    href: '/subscription',
    icon: 'solar:bolt-linear',
    section: 'discover',
  },
  // ─── Admin ─────────────────────────────────────
  {
    id: 'admin-dashboard',
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'solar:chart-square-linear',
    section: 'admin',
    requiredRole: 'staff',
  },
  {
    id: 'admin-users',
    label: 'Users',
    href: '/admin/users',
    icon: 'solar:user-linear',
    section: 'admin',
    requiredRole: 'moderator',
  },
  {
    id: 'admin-moderation',
    label: 'Moderation',
    href: '/admin/moderation',
    icon: 'solar:shield-check-linear',
    section: 'admin',
    requiredRole: 'moderator',
  },
  {
    id: 'admin-analytics',
    label: 'Analytics',
    href: '/admin/analytics',
    icon: 'solar:graph-up-linear',
    section: 'admin',
    requiredRole: 'admin',
  },
  {
    id: 'admin-settings',
    label: 'Site Settings',
    href: '/admin/settings',
    icon: 'solar:settings-linear',
    section: 'admin',
    requiredRole: 'owner',
  },
];

export function getNavItemsForUser(role: Role, tier: SubscriptionTier): NavItem[] {
  const { hasRoleOrAbove } = require('./roles');
  return NAV_ITEMS.filter((item) => {
    if (item.requiredRole && !hasRoleOrAbove(role, item.requiredRole)) return false;
    return true;
  });
}
