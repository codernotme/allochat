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

export default function AdminRoomsPage() {
  const [search, setSearch] = useState('');
  const rooms = useQuery(api.admin.getAllRooms);
  const setVerification = useMutation(api.admin.setRoomVerification);
  const deleteRoom = useMutation(api.admin.deleteRoom);

  const filteredRooms = rooms?.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.description?.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleVerify(roomId: any, current: boolean) {
    try {
      await setVerification({ roomId, isVerified: !current });
      toast.success(current ? 'Room unverified' : 'Room verified');
    } catch {
      toast.error('Action failed');
    }
  }

  async function handleDelete(roomId: any) {
    if (!confirm('Are you sure you want to delete this room? This action cannot be undone.')) return;
    try {
      await deleteRoom({ roomId });
      toast.success('Room deleted');
    } catch {
      toast.error('Delete failed');
    }
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Room Management</h1>
        <p className="text-muted-foreground">Audit, verify, and moderate community rooms</p>
      </div>

      <div className="relative max-w-sm">
        <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
        <Input 
          placeholder="Search rooms by name or category…" 
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
                <th className="px-4 py-3 text-left font-medium">Room</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">Members</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRooms?.map((room) => (
                <tr key={room._id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 rounded-lg">
                        <AvatarImage src={room.avatar} />
                        <AvatarFallback className="rounded-lg">{room.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium flex items-center gap-1">
                          {room.name}
                          {room.isVerified && <Icon icon="solar:verified-check-bold" className="size-3 text-primary" />}
                        </span>
                        <span className="text-xs text-muted-foreground italic truncate max-w-[200px]">
                          {room.topic || 'No topic'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="capitalize text-[10px]">{room.category}</Badge>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">
                    {room.onlineCount} / {room.memberCount}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs capitalize">{room.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    {room.isFeatured && (
                      <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Featured</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title={room.isVerified ? 'Unverify' : 'Verify'}
                        onClick={() => toggleVerify(room._id, !!room.isVerified)}
                      >
                        <Icon icon={room.isVerified ? "solar:shield-cross-linear" : "solar:shield-check-linear"} className="size-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive"
                        onClick={() => handleDelete(room._id)}
                      >
                        <Icon icon="solar:trash-bin-trash-linear" className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!filteredRooms || filteredRooms.length === 0) && (
            <div className="p-12 text-center text-muted-foreground italic">
              No rooms found matching your search.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
