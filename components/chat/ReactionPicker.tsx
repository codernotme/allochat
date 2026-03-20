'use client';

import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';

const EMOJIS = [
  "👍","👎","❤️","🔥","😂","😮","😢","😡","💯","✨",
  "😀","🥰","😍","🤣","😊","😒","😭","😩","🥺","😤",
  "🤯","😳","🥶","😱","👏","🙌","🫶","🤝","🙏","👀",
  "💀","👽","🚀","🎉","🥳","🤔","🤫","🙄","😎","🤓"
];

type Props = {
  onSelect: (emoji: string) => void;
};

export function ReactionPicker({ onSelect }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex size-7 items-center justify-center rounded hover:bg-accent text-muted-foreground transition-colors" aria-label="Add reaction">
        <Icon icon="solar:smile-circle-linear" className="size-4" />
      </PopoverTrigger>
      <PopoverContent side="top" align="center" className="w-64 p-2 shadow-xl">
        <div className="grid grid-cols-8 gap-1">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onSelect(emoji);
                setOpen(false);
              }}
              className="hover:bg-accent flex size-7 items-center justify-center rounded transition-colors text-base"
              aria-label={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
