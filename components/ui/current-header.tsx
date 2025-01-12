"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { Search, User } from "lucide-react"
import { CurrentProfileCard } from "./current-profile-card"
import { useUser, SignInButton } from "@clerk/nextjs"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

interface CurrentHeaderProps {
  sidebarCollapsed: boolean
}

/**
 * CurrentHeader Component
 * 
 * A responsive header that adapts to sidebar state. Contains:
 * - Profile picture icon (right): Will integrate with Clerk for auth/profile functionality
 * - Search bar (center-right): Placeholder for future search implementation
 * - Channel name (left): Dynamic channel name display
 * 
 * @component
 * @param {boolean} sidebarCollapsed - Whether the sidebar is collapsed, affects layout positioning
 */
export function CurrentHeader({ sidebarCollapsed }: CurrentHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)
  const { user, isLoaded } = useUser();
  const params = useParams();
  const channelId = params?.channelId as string;

  const { data: channel } = useQuery({
    queryKey: ['channel', channelId],
    queryFn: async () => {
      if (!channelId) return null;
      const response = await fetch(`/api/channels/resolve?channelId=${channelId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch channel');
      }
      return response.json();
    },
    enabled: !!channelId,
  });

  if (!isLoaded) return null;

  return (
    <>
      <header className={cn(
        "fixed top-0 right-0 h-16 bg-[#1a1f2e] border-b border-[#2a3142] flex items-center justify-between px-4 transition-all duration-300",
        sidebarCollapsed ? "left-2" : "left-[20%]"
      )}>
        {/* Channel Name - Left */}
        <div className="flex items-center pl-4">
          <h1 className="text-[#8ba3d4] text-lg font-semibold">
            {channel ? `#${channel.name}` : 'Select a channel'}
          </h1>
        </div>

        {/* Search Bar - Center-Right */}
        <div className="flex-1 max-w-xl px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8ba3d4]" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#242b3d] text-[#8ba3d4] rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#3d4663] placeholder-[#566388]"
            />
          </div>
        </div>

        {/* Profile Icon or Login Button - Right */}
        <div className="ml-4">
          {user ? (
            <button
              className="h-10 w-10 rounded-full bg-[#242b3d] flex items-center justify-center hover:bg-[#2a3142] transition-colors overflow-hidden"
              aria-label="Profile"
              onClick={() => setIsProfileOpen(true)}
            >
              {user.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt={user.username || "Profile"} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-[#8ba3d4]" />
              )}
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-[#242b3d] text-[#8ba3d4] rounded-md hover:bg-[#2a3142] transition-colors text-sm font-medium">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </header>

      {user && (
        <CurrentProfileCard
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </>
  )
} 