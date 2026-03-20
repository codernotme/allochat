'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type User = { id: string; name: string; image?: string };

export function ReadReceipts({ readers }: { readers: User[] }) {
  if (!readers || readers.length === 0) return null;

  return (
    <div className="flex justify-end gap-0.5 px-4 mt-1 mb-2">
      {readers.map((user, i) => (
        <Avatar
          key={user.id}
          className={cn("size-3.5 border border-background shadow-sm hover:scale-125 transition-transform", i > 0 && "-ml-1.5")}
          title={`Read by ${user.name}`}
        >
          <AvatarImage src={user.image} />
          <AvatarFallback className="text-[6px] bg-primary/20 text-primary font-bold">
            {user.name.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}
