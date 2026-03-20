'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const users = useQuery(api.admin.getAllUsers, { limit: 100 });
  const setUserBanStatus = useMutation(api.admin.setUserBanStatus);
  const updateUserRole = useMutation(api.admin.updateUserRole);
  const muteUser = useMutation(api.admin.muteUser);
  const adjustWallet = useMutation(api.admin.adjustWallet);
  const setSubscriptionTier = useMutation(api.admin.setSubscriptionTier);

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

  async function toggleVIP(userId: any, tier: 'free' | 'premium' | 'pro' | 'elite' | 'vip') {
    try {
      await setSubscriptionTier({ userId, tier });
      toast.success(tier === 'vip' ? 'VIP granted' : 'VIP revoked');
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
          placeholder="Search items…" 
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
                        <AvatarImage src={(user as any).avatarUrl || user.avatar} />
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
                    <div className="flex flex-col gap-1">
                      {user.isBanned ? (
                        <Badge variant="destructive" className="text-[10px] w-fit">Banned</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 w-fit">Active</Badge>
                      )}
                      {user.isMuted && (
                        <Badge variant="outline" className="text-[10px] border-amber-500 text-amber-500 w-fit">Muted</Badge>
                      )}
                      {user.subscriptionTier === 'vip' && (
                        <Badge variant="outline" className="text-[10px] border-yellow-500 text-yellow-500 bg-yellow-500/10 w-fit">VIP</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    Lv. {user.level || 1} ({user.xp || 0} XP)
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Wallet Dialog */}
                      <WalletDialog 
                        userId={user._id} 
                        username={user.username} 
                        onAdjust={(amt: number, desc: string) => adjustWallet({ userId: user._id, amount: amt, description: desc })} 
                      />
                      
                      {/* Mute Dialog */}
                      <MuteDialog 
                        userId={user._id} 
                        isMuted={user.isMuted}
                        onMute={(mins: number, reason: string) => muteUser({ userId: user._id, durationMinutes: mins, reason })} 
                      />

                      <Button 
                        variant="ghost" 
                        size={null} 
                        className={`h-8 w-8 ${user.subscriptionTier === 'vip' ? 'text-yellow-500' : 'text-muted-foreground'}`}
                        title={user.subscriptionTier === 'vip' ? 'Revoke VIP' : 'Grant VIP'}
                        onClick={() => toggleVIP(user._id, user.subscriptionTier === 'vip' ? 'free' : 'vip')}
                      >
                        <Icon icon="solar:star-bold" className="size-4" />
                      </Button>

                      <Button 
                        variant="ghost" 
                        size={null} 
                        className={`h-8 w-8 ${user.isBanned ? 'text-green-600' : 'text-destructive'}`}
                        title={user.isBanned ? 'Unban' : 'Ban'}
                        onClick={() => toggleBan(user._id, !!user.isBanned)}
                      >
                        <Icon icon={user.isBanned ? "solar:user-check-linear" : "solar:user-block-linear"} className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function MuteDialog({ isMuted, onMute }: { userId: any; isMuted?: boolean; onMute: (mins: number, reason: string) => Promise<any> }) {
  const [duration, setDuration] = useState(60);
  const [reason, setReason] = useState('Violation of rules');
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button variant="ghost" size={null} title="Mute User" className={`h-8 w-8 ${isMuted ? 'text-amber-500' : ''}`} />
        }
      >
        <Icon icon="solar:muted-linear" className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mute User</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Duration (Minutes)</Label>
            <Input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} />
            <div className="flex gap-2">
              {[60, 1440, 10080].map(d => (
                <Button key={d} variant="outline" size="xs" onClick={() => setDuration(d)}>
                  {d === 60 ? '1h' : d === 1440 ? '1d' : '1w'}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Reason</Label>
            <Input value={reason} onChange={e => setReason(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={async () => {
            await onMute(duration, reason);
            setOpen(false);
            toast.success('User muted');
          }}>Apply Mute</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function WalletDialog({ username, onAdjust }: { userId: any; username: string; onAdjust: (amt: number, desc: string) => Promise<any> }) {
  const [amount, setAmount] = useState(100);
  const [reason, setReason] = useState('Admin bonus');
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size={null} title="Adjust Wallet" className="h-8 w-8" />
        }
      >
        <Icon icon="solar:wallet-money-linear" className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Wallet: @{username}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Amount (AlloCoins)</Label>
            <Input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
            <p className="text-[10px] text-muted-foreground italic">Use negative value to remove coins</p>
          </div>
          <div className="space-y-2">
            <Label>Reason / Description</Label>
            <Input value={reason} onChange={e => setReason(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={async () => {
            await onAdjust(amount, reason);
            setOpen(false);
            toast.success('Wallet adjusted');
          }}>Execute Transaction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
