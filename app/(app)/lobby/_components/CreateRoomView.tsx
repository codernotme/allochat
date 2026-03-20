'use client';

import * as React from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Icon } from '@iconify/react';
import { ROOM_CATEGORIES } from '@/lib/data/room-categories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function CreateRoomView() {
  const router = useRouter();
  const createRoom = useMutation(api.rooms.createRoom);

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [topic, setTopic] = React.useState('');
  const [category, setCategory] = React.useState('general');
  const [type, setType] = React.useState<'public' | 'private' | 'secret' | 'community'>('public');
  const [password, setPassword] = React.useState('');
  const [maxUsers, setMaxUsers] = React.useState('');
  const [allowCalls, setAllowCalls] = React.useState(true);
  const [allowMedia, setAllowMedia] = React.useState(true);
  const [requireVerification, setRequireVerification] = React.useState(false);
  const [creating, setCreating] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Room name is required');
      return;
    }
    setCreating(true);
    try {
      const roomId = await createRoom({
        name: name.trim(),
        description: description.trim() || undefined,
        topic: topic.trim() || undefined,
        category,
        type,
        password: (type === 'private' || type === 'secret') && password ? password : undefined,
        maxUsers: maxUsers ? parseInt(maxUsers) : undefined,
        allowCalls,
        allowMedia,
        requireVerification,
      });
      toast.success('Room created!');
      router.push(`/room/${roomId}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create room');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Create a Room</h1>
        <p className="text-muted-foreground text-sm mt-1">Build your community space</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="room-name">Room Name *</Label>
          <Input
            id="room-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Late Night Vibes"
            maxLength={60}
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="room-desc">Description</Label>
          <Textarea
            id="room-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this room about?"
            rows={2}
          />
        </div>

        {/* Topic */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="room-topic">Current Topic</Label>
          <Input
            id="room-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Discussing AI trends"
            maxLength={100}
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <Label>Category</Label>
          <Select value={category} onValueChange={(v) => v && setCategory(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROOM_CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type */}
        <div className="flex flex-col gap-1.5">
          <Label>Room Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {(['public', 'private', 'secret', 'community'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left text-sm transition-all ${
                  type === t
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <Icon
                  icon={
                    t === 'public' ? 'solar:global-linear' :
                    t === 'private' ? 'solar:lock-keyhole-linear' :
                    t === 'secret' ? 'solar:eye-closed-linear' :
                    'solar:users-group-two-rounded-linear'
                  }
                  className="size-4"
                />
                <span className="font-semibold capitalize">{t}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Password for private/secret */}
        {(type === 'private' || type === 'secret') && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="room-password">Room Password</Label>
            <Input
              id="room-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank for no password"
            />
          </div>
        )}

        {/* Max Users */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="max-users">Max Users (leave blank for unlimited)</Label>
          <Input
            id="max-users"
            type="number"
            value={maxUsers}
            onChange={(e) => setMaxUsers(e.target.value)}
            min={2}
            max={10000}
            placeholder="Unlimited"
          />
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Allow Voice/Video Calls</p>
              <p className="text-xs text-muted-foreground">Users can start calls in this room</p>
            </div>
            <Switch checked={allowCalls} onCheckedChange={setAllowCalls} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Allow Media / File Sharing</p>
              <p className="text-xs text-muted-foreground">Images, voice notes, sketches etc.</p>
            </div>
            <Switch checked={allowMedia} onCheckedChange={setAllowMedia} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Require Email Verification</p>
              <p className="text-xs text-muted-foreground">Only verified accounts can join</p>
            </div>
            <Switch checked={requireVerification} onCheckedChange={setRequireVerification} />
          </div>
        </div>

        <Button type="submit" disabled={creating} className="w-full">
          {creating ? (
            <>
              <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              Creating…
            </>
          ) : (
            <>
              <Icon icon="solar:add-square-linear" className="size-4 mr-2" />
              Create Room
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
