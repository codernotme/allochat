import type { Role } from './roles';
import type { SubscriptionTier } from './subscription-plans';

export type Permission =
  // Messaging
  | 'message:send'
  | 'message:edit_own'
  | 'message:delete_own'
  | 'message:delete_any'
  | 'message:pin'
  | 'message:react'
  // Rooms
  | 'room:create'
  | 'room:join'
  | 'room:leave'
  | 'room:settings'
  | 'room:delete'
  | 'room:invite'
  // Members
  | 'member:kick'
  | 'member:ban'
  | 'member:mute'
  | 'member:promote'
  // Calls
  | 'call:start'
  | 'call:join'
  | 'call:record'
  // Moderation
  | 'report:submit'
  | 'report:review'
  | 'content:filter_manage'
  // Admin
  | 'admin:dashboard'
  | 'admin:users'
  | 'admin:analytics'
  | 'admin:settings'
  | 'admin:billing';

// Permissions granted per global role
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  guest: ['room:join', 'call:join'],
  user: [
    'message:send',
    'message:edit_own',
    'message:delete_own',
    'message:react',
    'room:create',
    'room:join',
    'room:leave',
    'room:invite',
    'call:start',
    'call:join',
    'report:submit',
    'member:kick', // only in rooms they own
  ],
  staff: ['report:review', 'member:mute'],
  moderator: ['message:delete_any', 'message:pin', 'member:ban', 'content:filter_manage'],
  admin: [
    'room:settings',
    'room:delete',
    'member:promote',
    'call:record',
    'report:review',
    'admin:dashboard',
    'admin:users',
    'admin:analytics',
  ],
  owner: ['admin:settings', 'admin:billing'],
};

// Additional permissions unlocked per subscription tier
export const TIER_PERMISSIONS: Record<SubscriptionTier, Permission[]> = {
  free: [],
  premium: [],
  pro: ['call:record'],
  elite: ['call:record'],
  vip: ['call:record'],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  const roles: Role[] = ['owner', 'admin', 'moderator', 'staff', 'user', 'guest'];
  const roleIndex = roles.indexOf(role);

  // Check current role and all higher roles
  for (let i = roleIndex; i >= 0; i--) {
    if (ROLE_PERMISSIONS[roles[i]]?.includes(permission)) {
      return true;
    }
  }
  return false;
}
