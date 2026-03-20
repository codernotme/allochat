'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@iconify/react';

export default function ProfileSettingsPage() {
  const user = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const siteSettings = useQuery(api.admin.getSiteSettings);
  
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setBio(user.bio || '');
      setUsername(user.username || '');
    }
  }, [user]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile({ displayName, bio, username });
      toast.success('Profile updated successfully.');
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = siteSettings?.maxFileUploadSize || 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File too large. Max size is ${Math.round(maxSize / (1024 * 1024))}MB.`);
      return;
    }

    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!result.ok) throw new Error('Upload failed');
      
      const { storageId } = await result.json();
      await updateProfile({ avatar: storageId });
      toast.success('Avatar updated!');
    } catch (err) {
      toast.error('Failed to upload avatar.');
    } finally {
      setUploading(false);
    }
  }

  if (user === undefined) return <div className="p-8 text-center">Loading settings…</div>;
  if (user === null) return <div className="p-8 text-center">Please sign in to manage settings.</div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground italic">Manage your profile and account preferences</p>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col gap-6 md:flex-row">
        <TabsList className="bg-muted/50 flex h-auto flex-col justify-start rounded-xl p-1 md:w-48">
          <TabsTrigger value="profile" className="justify-start gap-2 px-4 py-2 text-left">
            <Icon icon="solar:user-linear" className="size-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="justify-start gap-2 px-4 py-2 text-left">
            <Icon icon="solar:pallete-2-linear" className="size-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="account" className="justify-start gap-2 px-4 py-2 text-left">
            <Icon icon="solar:shield-user-linear" className="size-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="justify-start gap-2 px-4 py-2 text-left">
            <Icon icon="solar:bell-linear" className="size-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <div className="flex-1">
          <TabsContent value="profile" className="mt-0">
            <Card className="border-border/50 shadow-sm transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your public profile details</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-4">
                  <Avatar className="size-20 border-2 border-primary/20">
                    <AvatarImage src={(user as any).avatarUrl || user.avatar} />
                    <AvatarFallback>
                      <Icon icon="solar:user-circle-linear" className="size-8 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={uploading}
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      {uploading ? 'Uploading…' : 'Change Avatar'}
                    </Button>
                    <p className="text-muted-foreground text-xs italic">
                      Max {Math.round((siteSettings?.maxFileUploadSize || 0) / (1024 * 1024)) || 2}MB
                    </p>
                  </div>
                </div>

                <Separator className="bg-border/30" />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm italic">@</span>
                      <Input
                        id="username"
                        className="pl-7"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell the world about yourself…"
                    className="min-h-[100px] resize-none"
                    maxLength={200}
                  />
                  <p className="text-muted-foreground text-right text-xs italic">
                    {bio.length}/200 characters
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 border-t p-4">
                <Button onClick={handleSave} disabled={saving} className="ml-auto min-w-[100px]">
                  {saving ? 'Saving…' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how AlloChat looks for you</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">Dark Mode</p>
                    <p className="text-muted-foreground text-xs italic">Switch between light and dark themes</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {/* Toggle theme logic */}}>
                    <Icon icon="solar:moon-stars-linear" className="size-4" />
                    Dark
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
