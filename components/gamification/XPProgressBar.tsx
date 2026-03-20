'use client';

import { Progress } from '@/components/ui/progress';
import { getLevelFromXP } from '@/lib/data/xp-actions';

interface XPProgressBarProps {
  xp: number;
  showDetails?: boolean;
}

export function XPProgressBar({ xp, showDetails = true }: XPProgressBarProps) {
  const { xpInCurrentLevel, xpToNextLevel, level } = getLevelFromXP(xp);
  const totalInLevel = xpInCurrentLevel + xpToNextLevel;
  const progressPercent = (xpInCurrentLevel / totalInLevel) * 100;

  return (
    <div className="flex flex-col gap-2 w-full">
      {showDetails && (
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tight">
          <span className="text-muted-foreground">Level {level}</span>
          <span className="text-primary">
            {Math.floor(xpInCurrentLevel)} / {totalInLevel} XP
          </span>
        </div>
      )}
      <Progress
        value={progressPercent}
        className="h-2 overflow-hidden rounded-full transition-all"
      />
      {showDetails && (
        <p className="text-muted-foreground text-[10px] text-center italic">
          {Math.ceil(xpToNextLevel)} XP to next level
        </p>
      )}
    </div>
  );
}
