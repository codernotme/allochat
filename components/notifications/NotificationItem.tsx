'use client';

import { Icon } from '@iconify/react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export type NotificationType = 
  | 'message' 
  | 'mention' 
  | 'friend_request' 
  | 'call' 
  | 'badge' 
  | 'gift' 
  | 'system' 
  | 'room_invite';

interface NotificationItemProps {
  notification: {
    _id: string;
    type: string;
    title: string;
    body: string;
    createdAt: number;
    isRead: boolean;
    link?: string;
  };
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead, onDelete }: NotificationItemProps) {
  return (
    <div
      className={`group flex items-start gap-4 p-4 transition-colors hover:bg-muted/30 ${
        !notification.isRead ? 'bg-primary/5' : ''
      }`}
    >
      {/* Icon */}
      <div
        className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${
          !notification.isRead ? 'bg-primary/15' : 'bg-muted'
        }`}
      >
        <Icon
          icon={getNotifIcon(notification.type)}
          className={`size-4 ${!notification.isRead ? 'text-primary' : 'text-muted-foreground'}`}
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm font-semibold ${
              !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {notification.title}
          </p>
          <span className="text-muted-foreground whitespace-nowrap text-xs">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
          {notification.body}
        </p>
        {notification.link && (
          <Link
            href={notification.link}
            className="text-primary mt-1 inline-block text-xs font-medium hover:underline"
            onClick={() => !notification.isRead && onMarkRead?.(notification._id)}
          >
            View →
          </Link>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {!notification.isRead && onMarkRead && (
          <button
            onClick={() => onMarkRead(notification._id)}
            className="hover:bg-muted rounded-lg p-1.5 text-xs"
            title="Mark as read"
          >
            <Icon icon="solar:check-read-linear" className="size-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(notification._id)}
            className="hover:bg-destructive/10 hover:text-destructive rounded-lg p-1.5 text-xs"
            title="Delete"
          >
            <Icon icon="solar:trash-bin-2-linear" className="size-4" />
          </button>
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
