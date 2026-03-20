'use client';

import { useTheme } from 'next-themes';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import { useState } from 'react';

const THEMES = [
  { value: 'light', label: 'Light', icon: 'solar:sun-2-linear', desc: 'Clean white interface' },
  { value: 'dark', label: 'Dark', icon: 'solar:moon-stars-linear', desc: 'Easy on the eyes' },
  { value: 'system', label: 'System', icon: 'solar:monitor-linear', desc: 'Follows your device' },
] as const;

const LANGUAGES = [
  { value: 'en', label: '🇺🇸 English' },
  { value: 'ar', label: '🇸🇦 Arabic' },
  { value: 'es', label: '🇪🇸 Spanish' },
  { value: 'fr', label: '🇫🇷 French' },
  { value: 'de', label: '🇩🇪 German' },
  { value: 'pt', label: '🇧🇷 Portuguese' },
  { value: 'tr', label: '🇹🇷 Turkish' },
  { value: 'ru', label: '🇷🇺 Russian' },
  { value: 'zh', label: '🇨🇳 Chinese' },
  { value: 'hi', label: '🇮🇳 Hindi' },
];

export function AppearanceView() {
  const { theme, setTheme } = useTheme();
  const user = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);
  const [selectedLang, setSelectedLang] = useState(user?.language || 'en');
  const [saving, setSaving] = useState(false);

  async function handleSaveLanguage() {
    setSaving(true);
    try {
      await updateProfile({ language: selectedLang });
      toast.success('Language preference saved!');
    } catch {
      toast.error('Failed to save preference.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Appearance</h1>
        <p className="text-muted-foreground text-sm">Customize how AlloChat looks and feels</p>
      </div>

      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose your preferred color scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
                  theme === t.value
                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <Icon icon={t.icon} className={`size-6 ${theme === t.value ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-muted-foreground text-xs">{t.desc}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
          <CardDescription>Choose your preferred display language</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                onClick={() => setSelectedLang(lang.value)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                  selectedLang === lang.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/20 p-4">
          <Button onClick={handleSaveLanguage} disabled={saving} className="ml-auto">
            {saving ? 'Saving…' : 'Save Language'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
