'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { EmoticonPicker } from './EmoticonPicker';

type Props = {
  value: string;
  onChange: (val: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function RichTextEditor({ value, onChange, onKeyDown, placeholder, className, disabled }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function insertFormatting(prefix: string, suffix: string = prefix) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.substring(start, end);
    const newVal = value.substring(0, start) + prefix + selected + suffix + value.substring(end);
    onChange(newVal);
    
    // reset cursor
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  }

  return (
    <div className={cn("flex flex-col border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all bg-transparent", className)}>
      <div className="flex items-center gap-1 p-1 border-b border-border/50 bg-muted/10 rounded-t-xl">
        <Button type="button" variant="ghost" size="icon" className="size-6 text-muted-foreground hover:text-foreground rounded" onClick={() => insertFormatting('**')} disabled={disabled} title="Bold">
          <Icon icon="solar:text-bold-linear" className="size-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="size-6 text-muted-foreground hover:text-foreground rounded" onClick={() => insertFormatting('*')} disabled={disabled} title="Italic">
          <Icon icon="mdi:format-italic" className="size-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="size-6 text-muted-foreground hover:text-foreground rounded" onClick={() => insertFormatting('~~')} disabled={disabled} title="Strikethrough">
          <Icon icon="solar:text-strikethrough-linear" className="size-3.5" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button type="button" variant="ghost" size="icon" className="size-6 text-muted-foreground hover:text-foreground rounded" onClick={() => insertFormatting('`')} disabled={disabled} title="Inline Code">
          <Icon icon="solar:code-square-linear" className="size-3.5" />
        </Button>
      </div>
      
      <div className="flex items-end px-2 py-1 gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          className="scrollbar-none text-foreground placeholder:text-muted-foreground max-h-48 min-h-6 flex-1 resize-none bg-transparent text-sm outline-none py-1.5"
        />
        <div className="pb-1">
          <EmoticonPicker onPick={(t) => insertFormatting(t, '')} />
        </div>
      </div>
    </div>
  );
}
