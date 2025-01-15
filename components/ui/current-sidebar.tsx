"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react"
import { CurrentHeader } from "./current-header"
import { CurrentMessageInput } from "./current-message-input"
import { CurrentSidebarContent } from "./current-sidebar-content"
import { useParams } from "next/navigation"
import { useSidebarState } from "../../hooks/use-sidebar-state"

/**
 * CurrentSidebar Component
 * 
 * A collapsible sidebar that can expand to 20% of screen width or collapse to the left border.
 * Features a circular toggle button positioned 30% from the bottom.
 * Coordinates with header and message input for responsive layout.
 * 
 * @component
 */
export function CurrentSidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebarState()
  const params = useParams()
  const channelId = params?.channelId as string

  return (
    <>
      <CurrentHeader sidebarCollapsed={isCollapsed} />
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-[#111521] transition-all duration-300 shadow-md z-50",
          isCollapsed ? "w-1.5 translate-x-0.5" : "w-[20%]"
        )}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute -right-4 top-[70%] flex h-8 w-8 items-center justify-center rounded-full bg-[#111521] text-[#8ba3d4] transition-all hover:bg-[#1a1f2e] shadow-md",
            isCollapsed && "-right-6"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRightCircle className="h-8 w-8" />
          ) : (
            <ChevronLeftCircle className="h-8 w-8" />
          )}
        </button>

        {/* Sidebar Content */}
        <div className={cn("h-full w-full pt-4", isCollapsed && "hidden")}>
          <CurrentSidebarContent workspaceName="ChatGenius" />
        </div>
      </div>
      <CurrentMessageInput 
        sidebarCollapsed={isCollapsed} 
        channelId={channelId || ''} 
        placeholder="Type a message..."
      />
    </>
  )
} 