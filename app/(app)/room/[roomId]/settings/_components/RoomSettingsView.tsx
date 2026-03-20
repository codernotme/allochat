'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@iconify/react';

type Props = { roomId: Id<'rooms'> };

export function RoomSettingsView({ roomId }: Props) {
  const room = useQuery(api.rooms.getRoom, { roomId });
  const currentUser = useQuery(api.users.getCurrentUser);
  const updateRoom = useMutation(api.rooms.updateRoom);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState<'public' | 'private' | 'secret' | 'community'>('public');
  const [allowCalls, setAllowCalls] = useState(true);
  const [allowMedia, setAllowMedia] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (room) {
      setName(room.name || '');
      setDescription(room.description || '');
      setTopic(room.topic || '');
      setType(room.type || 'public');
      setAllowCalls(room.allowCalls ?? true);
      setAllowMedia(room.allowMedia ?? true);
    }
  }, [room]);

  const isOwnerOrAdmin =
    currentUser?._id === room?.ownerId || currentUser?.role === 'admin' || currentUser?.role === 'owner';

  if (room === undefined) return <div className="p-8 text-center">Loading room…</div>;
  if (!room) return <div className="p-8 text-center">Room not found.</div>;
  if (!isOwnerOrAdmin) return <div className="p-8 text-center">You don&apos;t have permission to edit this room.</div>;

  async function handleSave() {
    setSaving(true);
    try {
      await updateRoom({ roomId, name, description, topic, type, allowCalls, allowMedia });
      toast.success('Room settings saved!');
    } catch {
      toast.error('Failed to save room settings.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/room/${roomId}`} className="hover:bg-muted rounded-lg p-1.5">
          <Icon icon="solar:alt-arrow-left-linear" className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Room Settings</h1>
          <p className="text-muted-foreground text-sm">{room.name}</p>
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Basic room information visible to all members</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="roomName">Room Name</Label>
            <Input id="roomName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Room name" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this room about?"
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="topic">Topic / Pinned Notice</Label>
            <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Today's topic…" />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
          <CardDescription>Control who can join this room</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Room Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">🌐 Public — Anyone can join</SelectItem>
                <SelectItem value="private">🔒 Private — Invite only</SelectItem>
                <SelectItem value="secret">🤫 Secret — Link only, not listed</SelectItem>
                <SelectItem value="community">🏡 Community — Verified community</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>Enable or disable room features</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Allow Voice & Video Calls</p>
              <p className="text-muted-foreground text-xs">Members can start calls in this room</p>
            </div>
            <Switch checked={allowCalls} onCheckedChange={setAllowCalls} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Allow Media Uploads</p>
              <p className="text-muted-foreground text-xs">Members can share images, videos, and files</p>
            </div>
            <Switch checked={allowMedia} onCheckedChange={setAllowMedia} />
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/20 p-4">
          <Button onClick={handleSave} disabled={saving} className="ml-auto">
            {saving ? 'Saving…' : 'Save Settings'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
