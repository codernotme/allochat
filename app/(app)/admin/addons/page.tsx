'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

const ADDONS = [
  {
    key: 'tenorGifs',
    title: 'Tenor GIFs',
    description: 'Allow users to search and send GIFs via Tenor integration.',
    icon: 'solar:gif-linear',
  },
  {
    key: 'urlPreviews',
    title: 'URL Previews',
    description: 'Automatically generate rich previews for links shared in chat.',
    icon: 'solar:link-linear',
  },
  {
    key: 'voiceMessages',
    title: 'Voice Messages',
    description: 'Enable audio recording and playback in rooms and DMs.',
    icon: 'solar:microphone-2-linear',
  },
  {
    key: 'fileSharing',
    title: 'File Sharing',
    description: 'Allow users to attach images and documents to messages.',
    icon: 'solar:file-send-linear',
  },
];

export default function AdminAddonsPage() {
  const settings = useQuery(api.admin.getSiteSettings);
  const updateSettings = useMutation(api.admin.updateSiteSettings);

  const [addonsState, setAddonsState] = useState<Record<string, boolean>>({
    tenorGifs: true,
    urlPreviews: true,
    voiceMessages: true,
    fileSharing: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings?.addons) {
      setAddonsState(settings.addons);
    }
  }, [settings]);

  const handleToggle = (key: string) => {
    setAddonsState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        addons: {
          tenorGifs: addonsState.tenorGifs,
          urlPreviews: addonsState.urlPreviews,
          voiceMessages: addonsState.voiceMessages,
          fileSharing: addonsState.fileSharing,
        }
      });
      toast.success('Addons configuration updated.');
    } catch {
      toast.error('Failed to update addons.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Addon Management</h1>
        <p className="text-muted-foreground">Enable or disable optional site modules</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Addons</CardTitle>
          <CardDescription>Changes apply immediately across all rooms and direct messages.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {ADDONS.map((addon) => (
            <div key={addon.key} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <Icon icon={addon.icon} className="size-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{addon.title}</h3>
                  <p className="text-sm text-muted-foreground">{addon.description}</p>
                </div>
              </div>
              <Switch 
                checked={addonsState[addon.key]} 
                onCheckedChange={() => handleToggle(addon.key)} 
              />
            </div>
          ))}
        </CardContent>
        <CardFooter className="bg-muted/30 p-6 flex justify-end border-t">
          <Button onClick={handleSave} disabled={isSaving || !settings}>
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
