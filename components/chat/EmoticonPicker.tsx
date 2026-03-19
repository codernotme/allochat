'use client';

import { useMemo, useState } from 'react';
import {
  EMOTICON_CATEGORIES,
  EMOTICON_MAP,
  type EmoticonCategory,
} from '@/lib/data/emoticons';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Icon } from '@iconify/react';

type Props = {
  onPick: (token: string) => void;
};

const TABS: Array<{ id: EmoticonCategory; label: string }> = [
  { id: 'classic', label: 'Classic' },
  { id: 'food', label: 'Food' },
  { id: 'sticker_animals', label: 'Animals' },
];

export function EmoticonPicker({ onPick }: Props) {
  const [activeTab, setActiveTab] = useState<EmoticonCategory>('classic');
  const tokens = useMemo(() => EMOTICON_CATEGORIES[activeTab] ?? [], [activeTab]);

  return (
    <Popover>
      <PopoverTrigger className="bg-transparent hover:bg-muted inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors" aria-label="Open emoticon picker">
        <Icon icon="solar:sticker-smile-circle-2-linear" className="size-5" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-2">
        <div className="mb-2 flex gap-1">
          {TABS.map((tab) => (
            <Button
              key={tab.id}
              type="button"
              size="sm"
              variant={activeTab === tab.id ? 'default' : 'secondary'}
              className="h-7 px-2 text-xs"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="grid max-h-56 grid-cols-8 gap-1 overflow-y-auto pr-1">
          {tokens.map((token) => {
            const src = EMOTICON_MAP[token];
            if (!src) return null;

            return (
              <button
                key={token}
                type="button"
                className="hover:bg-muted rounded-md p-1 transition-colors"
                title={token}
                onClick={() => onPick(token)}
              >
                <img src={src} alt={token} className="mx-auto size-7" loading="lazy" />
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
