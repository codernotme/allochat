'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const users = useQuery(api.admin.getAllUsers, { limit: 100 });
  const setUserBanStatus = useMutation(api.admin.setUserBanStatus);
  const updateUserRole = useMutation(api.admin.updateUserRole);

  const filteredUsers = users?.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    u.displayName.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleBan(userId: any, currentBan: boolean) {
    try {
      await setUserBanStatus({ userId, isBanned: !currentBan, reason: 'Admin action' });
      toast.success(currentBan ? 'User unbanned' : 'User banned');
    } catch {
      toast.error('Action failed');
    }
  }

  async function changeRole(userId: any, newRole: string) {
    try {
      await updateUserRole({ userId, role: newRole });
      toast.success('Role updated');
    } catch {
      toast.error('Action failed');
    }
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage accounts, roles, and restrictions</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
        <Input 
          placeholder="Search by name, username or email…" 
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Level/XP</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers?.map((user) => (
                <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={user.avatar?.startsWith('http') ? user.avatar : `/api/storage/${user.avatar}`} />
                        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.displayName}</span>
                        <span className="text-xs text-muted-foreground italic">@{user.username}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select 
                      className="bg-transparent border-none text-xs font-semibold focus:ring-0 cursor-pointer"
                      value={user.role}
                      onChange={(e) => changeRole(user._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="staff">Staff</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                      <option value="owner">Owner</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {user.isBanned ? (
                      <Badge variant="destructive" className="text-[10px]">Banned</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    Lv. {user.level || 1} ({user.xp || 0} XP)
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={user.isBanned ? 'text-green-600' : 'text-destructive'}
                      onClick={() => toggleBan(user._id, !!user.isBanned)}
                    >
                      {user.isBanned ? 'Unban' : 'Ban'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!filteredUsers || filteredUsers.length === 0) && (
            <div className="p-12 text-center text-muted-foreground italic">
              No users found matching your search.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
