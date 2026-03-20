'use client';

export function TypingIndicator({ users }: { users: string[] }) {
  if (!users || users.length === 0) return null;

  const text =
    users.length === 1
      ? `${users[0]} is typing...`
      : users.length === 2
        ? `${users[0]} and ${users[1]} are typing...`
        : 'Several people are typing...';

  return (
    <div className="flex items-center gap-2 text-muted-foreground text-xs italic px-10 py-1 mb-1">
      <div className="flex items-center space-x-0.5">
        <div className="size-1.5 animate-bounce rounded-full bg-current" style={{ animationDelay: '0ms' }} />
        <div className="size-1.5 animate-bounce rounded-full bg-current" style={{ animationDelay: '150ms' }} />
        <div className="size-1.5 animate-bounce rounded-full bg-current" style={{ animationDelay: '300ms' }} />
      </div>
      <span>{text}</span>
    </div>
  );
}
