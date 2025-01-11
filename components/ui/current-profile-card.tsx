"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { User, Settings, Circle, LogOut } from "lucide-react"
import { useUser, SignOutButton } from "@clerk/nextjs"

interface CurrentProfileCardProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * CurrentProfileCard Component
 * 
 * A profile card that displays user information and actions.
 * Features:
 * - User email and name
 * - Profile picture
 * - Settings, Status, and Logout options
 * 
 * @component
 */
export function CurrentProfileCard({
  isOpen,
  onClose
}: CurrentProfileCardProps) {
  const { user } = useUser();
  
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Card */}
      <div className="fixed top-16 right-4 w-80 bg-[#1a1f2e] rounded-lg shadow-lg border border-[#2a3142] z-50">
        {/* Header with Profile Info */}
        <div className="p-4 border-b border-[#2a3142]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#8ba3d4] text-sm mb-1">{user?.primaryEmailAddress?.emailAddress}</p>
              <h3 className="text-[#8ba3d4] font-semibold">{user?.username || user?.firstName}</h3>
            </div>
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.username || "Profile"}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-[#242b3d] flex items-center justify-center">
                <User className="h-6 w-6 text-[#8ba3d4]" />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-2">
          <button
            className="w-full flex items-center gap-3 px-3 py-2 text-[#8ba3d4] hover:bg-[#242b3d] rounded-md transition-colors text-sm"
            onClick={() => console.log("Settings clicked")}
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <button
            className="w-full flex items-center gap-3 px-3 py-2 text-[#8ba3d4] hover:bg-[#242b3d] rounded-md transition-colors text-sm"
            onClick={() => console.log("Status clicked")}
          >
            <Circle className="h-4 w-4" />
            Status
          </button>
          <SignOutButton>
            <button
              className="w-full flex items-center gap-3 px-3 py-2 text-[#8ba3d4] hover:bg-[#242b3d] rounded-md transition-colors text-sm"
              onClick={() => {
                onClose();
              }}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </SignOutButton>
        </div>
      </div>
    </>
  )
} 