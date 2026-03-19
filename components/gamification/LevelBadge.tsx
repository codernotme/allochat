import { cn } from '@/lib/utils';

interface LevelBadgeProps {
  level: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LevelBadge({ level, className, size = 'sm' }: LevelBadgeProps) {
  const sizeClasses = {
    sm: 'h-4 min-w-[1rem] text-[9px] px-1',
    md: 'h-5 min-w-[1.25rem] text-[10px] px-1.5',
    lg: 'h-6 min-w-[1.5rem] text-[12px] px-2',
  };

  // Harmonious colors based on level tiers
  const getTierColor = (lvl: number) => {
    if (lvl < 10) return 'bg-slate-500 text-white';
    if (lvl < 25) return 'bg-blue-500 text-white shadow-[0_0_8px_rgba(59,130,246,0.5)]';
    if (lvl < 50) return 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]';
    if (lvl < 75) return 'bg-pink-500 text-white shadow-[0_0_12px_rgba(236,72,153,0.5)]';
    if (lvl < 100) return 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.6)]';
    return 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white shadow-[0_0_20px_rgba(234,179,8,0.7)] font-black italic animate-pulse';
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-bold tracking-tighter transition-all',
        getTierColor(level),
        sizeClasses[size],
        className
      )}
    >
      {level}
    </div>
  );
}
