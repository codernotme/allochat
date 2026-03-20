'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Icon } from '@iconify/react';

export default function AdminSettingsPage() {
  const settings = useQuery(api.admin.getSiteSettings);
  const updateSettings = useMutation(api.admin.updateSiteSettings);

  const [maxFileSizeMB, setMaxFileSizeMB] = useState(5);
  const [maintenance, setMaintenance] = useState(false);
  const [registration, setRegistration] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setMaxFileSizeMB(Math.round(settings.maxFileUploadSize / (1024 * 1024)));
      setMaintenance(!!settings.maintenanceMode);
      setRegistration(!!settings.registrationEnabled);
    }
  }, [settings]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateSettings({
        maxFileUploadSize: maxFileSizeMB * 1024 * 1024,
        maintenanceMode: maintenance,
        registrationEnabled: registration,
      });
      toast.success('Settings updated successfully');
    } catch {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 flex flex-col gap-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground">Configure global application parameters</p>
      </div>

      <div className="grid gap-6">
        {/* Upload Limits */}
        <Card>
          <CardHeader>
            <CardTitle>Storage & Uploads</CardTitle>
            <CardDescription>Control file upload limits across the site</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <div className="flex items-center gap-3">
                <Input 
                  id="maxFileSize" 
                  type="number" 
                  className="w-32" 
                  value={maxFileSizeMB}
                  onChange={(e) => setMaxFileSizeMB(Number(e.target.value))}
                />
                <span className="text-sm text-muted-foreground italic">Current: {maxFileSizeMB}MB per file</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System State */}
        <Card>
          <CardHeader>
            <CardTitle>System Control</CardTitle>
            <CardDescription>Global toggle for maintenance and access</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-xs text-muted-foreground">Disable all app activity for non-admin users</p>
              </div>
              <Switch checked={maintenance} onCheckedChange={setMaintenance} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>Allow New Registrations</Label>
                <p className="text-xs text-muted-foreground">Toggle public signups on or off</p>
              </div>
              <Switch checked={registration} onCheckedChange={setRegistration} />
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/20 p-4">
            <Button onClick={handleSave} disabled={saving} className="ml-auto">
              {saving ? 'Saving…' : 'Save Configuration'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
