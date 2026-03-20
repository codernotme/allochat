'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

export default function AdminGiftsPage() {
  const gifts = useQuery(api.admin.getGifts);
  const createGift = useMutation(api.admin.createGift);
  const updateGift = useMutation(api.admin.updateGift);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('solar:gift-linear');
  const [price, setPrice] = useState(50);
  const [category, setCategory] = useState('Classic');
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate() {
    if (!name || !slug) return;
    setSubmitting(true);
    try {
      await createGift({ name, slug, icon, coinPrice: price, category, isActive: true });
      setName('');
      setSlug('');
      toast.success('Gift created!');
    } catch {
      toast.error('Failed to create gift');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Virtual Gift Store</h1>
        <p className="text-muted-foreground">Manage animated gifts and digital assets</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <Card className="h-fit lg:col-span-1">
          <CardHeader>
            <CardTitle>Create New Gift</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Rose, Rocket, etc." />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input value={slug} onChange={e => setSlug(e.target.value.toLowerCase())} placeholder="rose-gif" />
            </div>
            <div className="space-y-1.5">
              <Label>Icon (Iconify)</Label>
              <Input value={icon} onChange={e => setIcon(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Coin Price</Label>
                <Input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Input value={category} onChange={e => setCategory(e.target.value)} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreate} disabled={submitting} className="w-full">
              {submitting ? 'Creating…' : 'Create Gift'}
            </Button>
          </CardFooter>
        </Card>

        {/* Gift List */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {gifts?.map((gift) => (
            <Card key={gift._id} className={!gift.isActive ? 'opacity-50 grayscale' : ''}>
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <div className="size-16 rounded-2xl bg-muted flex items-center justify-center text-primary">
                  <Icon icon={gift.icon} className="size-10" />
                </div>
                <div className="text-center">
                  <p className="font-bold">{gift.name}</p>
                  <p className="text-xs text-muted-foreground italic capitalize">{gift.category}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-sm font-bold">
                  <Icon icon="solar:stars-linear" className="size-4" />
                  {gift.coinPrice}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => updateGift({ id: gift._id, isActive: !gift.isActive })}
                >
                  {gift.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
