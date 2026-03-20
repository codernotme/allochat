'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

export default function AdminBadgesPage() {
  const badges = useQuery(api.admin.getBadges);
  const createBadge = useMutation(api.admin.createBadge);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [desc, setDesc] = useState('');
  const [icon, setIcon] = useState('solar:medal-star-linear');
  const [rarity, setRarity] = useState<'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'>('common');
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate() {
    if (!name || !slug) return;
    setSubmitting(true);
    try {
      await createBadge({ 
        name, slug, description: desc, icon, rarity, 
        category: 'achievement', condition: 'Manual', xpReward: 50 
      });
      setName('');
      setSlug('');
      setDesc('');
      toast.success('Badge created!');
    } catch {
      toast.error('Failed to create badge');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Badge Management</h1>
        <p className="text-muted-foreground">Create and manage unlockable achievements for users</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Create New Badge</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Friendly User" />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input value={slug} onChange={e => setSlug(e.target.value.toLowerCase())} placeholder="friendly-user" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Given to helpful users" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Icon (Iconify)</Label>
                <Input value={icon} onChange={e => setIcon(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Rarity</Label>
                <select 
                  className="w-full bg-background border rounded-md h-10 px-3 text-sm"
                  value={rarity}
                  onChange={e => setRarity(e.target.value as any)}
                >
                  <option value="common">Common</option>
                  <option value="uncommon">Uncommon</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreate} disabled={submitting} className="w-full">
              {submitting ? 'Creating…' : 'Create Badge'}
            </Button>
          </CardFooter>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {badges?.map((badge) => (
            <Card key={badge._id} className="relative overflow-hidden">
               {/* Rarity Ribbon */}
               <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white transform rotate-45 translate-x-4 -translate-y-1 ${
                badge.rarity === 'legendary' ? 'bg-amber-500' :
                badge.rarity === 'epic' ? 'bg-purple-500' :
                badge.rarity === 'rare' ? 'bg-blue-500' : 'bg-slate-500'
               }`}>
                {badge.rarity}
              </div>
              <CardContent className="p-6 flex flex-col items-center gap-3">
                <div className="size-16 rounded-full bg-muted flex items-center justify-center text-primary relative ring-4 ring-background shadow-inner">
                  <Icon icon={badge.icon} className="size-8" />
                </div>
                <div className="text-center">
                  <p className="font-bold">{badge.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{badge.description}</p>
                </div>
                <Badge variant="secondary" className="mt-2">{badge.xpReward} XP</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
