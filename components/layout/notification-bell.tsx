'use client';

import { useQuery, useMutation } from 'convex/react';
import type { Doc } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Icon } from '@iconify/react';

type NotificationDoc = Doc<'notifications'>;

export function NotificationBell() {
  const notifications = useQuery(api.notifications.getUnread);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const unreadCount = notifications?.length || 0;

  return (
    <Popover>
      <PopoverTrigger className="hover:bg-muted relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors" aria-label={`Notifications, ${unreadCount} unread`}>
        <Icon icon="solar:bell-linear" className="size-5" />
        {unreadCount > 0 && (
          <span className="bg-destructive absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm ring-2 ring-background ring-offset-0">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 border-border/50 p-0 shadow-2xl backdrop-blur-xl" align="end" sideOffset={8}>
        <div className="bg-card/50 flex items-center justify-between p-4 pb-2">
          <h3 className="text-sm font-bold tracking-tight">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary h-auto p-0 text-xs font-medium hover:bg-transparent"
              onClick={() => markAllRead()}
            >
              Mark all read
            </Button>
          )}
        </div>
        
        <Separator className="bg-border/30 mx-4" />

        <ScrollArea className="h-80">
          {notifications === undefined && (
            <div className="flex flex-col gap-2 p-4">
               {[...Array(3)].map((_, i) => <div key={i} className="bg-muted h-14 animate-pulse rounded-lg" />)}
            </div>
          )}
          
          {notifications?.length === 0 && (
            <div className="flex h-72 flex-col items-center justify-center gap-2 p-6 text-center italic">
              <Icon icon="solar:bell-linear" className="text-muted-foreground/30 size-10" />
              <p className="text-muted-foreground text-xs font-medium">All caught up! No unread notifications.</p>
            </div>
          )}

          <div className="flex flex-col py-2">
            {notifications?.map((notif: NotificationDoc) => (
              <Link 
                key={notif._id} 
                href={notif.link || '#'} 
                className="hover:bg-muted/50 flex flex-col gap-1 px-4 py-3 transition-colors"
                onClick={() => markAsRead({ notificationId: notif._id })}
              >
                <div className="flex items-start justify-between gap-1">
                   <p className="text-sm font-bold tracking-tight leading-none">{notif.title}</p>
                   <span className="text-muted-foreground whitespace-nowrap text-[10px] italic">
                     {new Date(notif._creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>
                <p className="text-muted-foreground line-clamp-2 text-xs leading-normal">
                  {notif.body}
                </p>
              </Link>
            ))}
          </div>
        </ScrollArea>
        
        <Separator className="bg-border/30 mx-4" />
        
        <div className="p-2">
          <Link 
            href="/notifications" 
            className={cn(buttonVariants({ variant: 'ghost' }), "text-muted-foreground w-full py-2 text-xs italic hover:bg-muted/50")}
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
