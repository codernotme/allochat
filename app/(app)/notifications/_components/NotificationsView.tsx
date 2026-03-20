'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function NotificationsView() {
  const notifications = useQuery(api.notifications.getNotifications, { limit: 100 });
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const deleteNotif = useMutation(api.notifications.deleteNotification);

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-muted-foreground text-sm">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAllRead()}>
            Mark all read
          </Button>
        )}
      </div>

      {/* List */}
      <div className="border-border overflow-hidden rounded-xl border">
        {notifications === undefined && (
          <div className="flex flex-col gap-3 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-muted h-16 animate-pulse rounded-lg" />
            ))}
          </div>
        )}

        {notifications?.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Icon icon="solar:bell-linear" className="text-muted-foreground size-12" />
            <p className="font-medium">You&apos;re all caught up!</p>
            <p className="text-muted-foreground text-sm">No notifications yet.</p>
          </div>
        )}

        {notifications && notifications.length > 0 && (
          <div className="divide-border divide-y">
            {notifications.map((notif: any) => (
              <div
                key={notif._id}
                className={`group flex items-start gap-4 p-4 transition-colors hover:bg-muted/30 ${!notif.isRead ? 'bg-primary/5' : ''}`}
              >
                {/* Icon */}
                <div className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${!notif.isRead ? 'bg-primary/15' : 'bg-muted'}`}>
                  <Icon
                    icon={getNotifIcon(notif.type)}
                    className={`size-4 ${!notif.isRead ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${!notif.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notif.title}
                    </p>
                    <span className="text-muted-foreground whitespace-nowrap text-xs">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">{notif.body}</p>
                  {notif.link && (
                    <Link
                      href={notif.link}
                      className="text-primary mt-1 inline-block text-xs font-medium hover:underline"
                      onClick={() => !notif.isRead && markAsRead({ notificationId: notif._id })}
                    >
                      View →
                    </Link>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {!notif.isRead && (
                    <button
                      onClick={() => markAsRead({ notificationId: notif._id })}
                      className="hover:bg-muted rounded-lg p-1.5 text-xs"
                      title="Mark as read"
                    >
                      <Icon icon="solar:check-read-linear" className="size-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotif({ notificationId: notif._id })}
                    className="hover:bg-destructive/10 hover:text-destructive rounded-lg p-1.5 text-xs"
                    title="Delete"
                  >
                    <Icon icon="solar:trash-bin-2-linear" className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getNotifIcon(type: string): string {
  const icons: Record<string, string> = {
    message: 'solar:chat-round-dots-linear',
    mention: 'solar:at-linear',
    friend_request: 'solar:user-plus-linear',
    call: 'solar:phone-calling-rounded-linear',
    badge: 'solar:medal-star-linear',
    gift: 'solar:gift-linear',
    system: 'solar:info-circle-linear',
    room_invite: 'solar:door-linear',
  };
  return icons[type] || 'solar:bell-linear';
}
