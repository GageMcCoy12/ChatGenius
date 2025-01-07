'use client';

import { cn } from "@/lib/utils";

interface PresenceIndicatorProps {
  isActive: boolean;
  className?: string;
}

export function PresenceIndicator({ isActive, className }: PresenceIndicatorProps) {
  return (
    <div
      className={cn(
        "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
        isActive ? "bg-green-500" : "bg-gray-400",
        className
      )}
    />
  );
} 