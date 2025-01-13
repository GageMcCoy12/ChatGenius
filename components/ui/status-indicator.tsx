"use client"

import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: string;
  isOnline: boolean;
  className?: string;
}

export function StatusIndicator({ status, isOnline, className }: StatusIndicatorProps) {
  const getStatusColor = () => {
    if (status === "DND") return "bg-red-500";
    if (isOnline) return "bg-green-500";
    return "bg-gray-500";
  };

  return (
    <div 
      className={cn(
        "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#1a1d2d]",
        getStatusColor(),
        className
      )}
    />
  );
} 