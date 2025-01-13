"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { User, Settings, Circle, LogOut } from "lucide-react"
import { useUser, SignOutButton } from "@clerk/nextjs"
import { StatusIndicator } from "./status-indicator"
import { useQuery, useQueryClient } from "@tanstack/react-query"

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
  const queryClient = useQueryClient();
  
  // Fetch user status
  const { data: userData } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      return response.json();
    },
    enabled: !!user?.id,
  });

  const updateStatus = async (newStatus: "DEFAULT" | "DND") => {
    try {
      console.log("[STATUS_UPDATE] Attempting to update status to:", newStatus);
      
      const response = await fetch('/api/users/status', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: newStatus 
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[STATUS_UPDATE] Server responded with error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(errorText || 'Failed to update status');
      }

      const data = await response.json();
      console.log("[STATUS_UPDATE] Status updated successfully:", data);

      // Invalidate user query to refresh the data
      await queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
    } catch (error) {
      console.error("[STATUS_UPDATE] Failed to update status:", error);
      // You might want to show a toast notification here
    }
  };
  
  if (!isOpen) return null;

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
            <div className="relative">
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
              <StatusIndicator 
                status={userData?.status || "DEFAULT"} 
                isOnline={userData?.isOnline || false}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-2">
          <button
            onClick={() => updateStatus("DEFAULT")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-[#8ba3d4] hover:bg-[#242b3d] transition-colors",
              userData?.status === "DEFAULT" && "bg-[#242b3d]"
            )}
          >
            <div className="relative">
              <Circle className="h-5 w-5" />
              <div className={cn(
                "absolute bottom-0 right-0 h-2 w-2 rounded-full",
                userData?.isOnline ? "bg-green-500" : "bg-gray-500"
              )} />
            </div>
            <span>Default</span>
          </button>
          
          <button
            onClick={() => updateStatus("DND")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-[#8ba3d4] hover:bg-[#242b3d] transition-colors",
              userData?.status === "DND" && "bg-[#242b3d]"
            )}
          >
            <div className="relative">
              <Circle className="h-5 w-5" />
              <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-red-500" />
            </div>
            <span>Do Not Disturb</span>
          </button>

          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[#8ba3d4] hover:bg-[#242b3d] transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>

          <SignOutButton>
            <button
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-red-400 hover:bg-[#242b3d] transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Log out</span>
            </button>
          </SignOutButton>
        </div>
      </div>
    </>
  )
} 