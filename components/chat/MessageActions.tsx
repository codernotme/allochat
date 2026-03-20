'use client';

import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { ReactionPicker } from './ReactionPicker';

type Props = {
  isOwn: boolean;
  canDelete: boolean;
  onReact: (emoji: string) => void;
  onReply: () => void;
  onEdit?: () => void;
  onDelete: () => void;
};

export function MessageActions({ isOwn, canDelete, onReact, onReply, onEdit, onDelete }: Props) {
  return (
    <div className="border-border bg-background absolute -top-3 right-2 flex items-center gap-1 rounded-lg border p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
      <ReactionPicker onSelect={onReact} />
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="size-7 rounded hover:bg-accent text-muted-foreground"
        onClick={onReply}
        title="Reply"
      >
        <Icon icon="solar:reply-linear" className="size-4" />
      </Button>

      {isOwn && onEdit && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-7 rounded hover:bg-accent text-muted-foreground"
          onClick={onEdit}
          title="Edit message"
        >
          <Icon icon="solar:pen-linear" className="size-4" />
        </Button>
      )}

      {canDelete && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-7 rounded hover:bg-accent text-destructive hover:bg-destructive/10"
          onClick={onDelete}
          title="Delete message"
        >
          <Icon icon="solar:trash-bin-trash-linear" className="size-4" />
        </Button>
      )}
    </div>
  );
}
