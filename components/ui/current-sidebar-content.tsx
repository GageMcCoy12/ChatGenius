"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, MoreVertical, Bell, BellOff, Plus } from "lucide-react"
import { ModalCreateChannel } from "../ui/modal-create-channel"
import { useChannels } from "../../src/hooks/use-channels"
import { useRouter, useParams } from "next/navigation"

interface CurrentSidebarContentProps {
  workspaceName: string
}

/**
 * CurrentSidebarContent Component
 * 
 * Displays the sidebar content including:
 * - Workspace name
 * - Channels list with add button and navigation
 * Each channel has a three-dot menu for notifications
 * 
 * @component
 */
export function CurrentSidebarContent({
  workspaceName = "Workspace Name",
}: CurrentSidebarContentProps) {
  const router = useRouter()
  const params = useParams()
  const currentChannel = params?.channelId as string
  
  const [expandedSections, setExpandedSections] = React.useState<string[]>(["Channels"])
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null)
  const [isCreateChannelOpen, setIsCreateChannelOpen] = React.useState(false)

  const { channels, isLoading, error, createChannel } = useChannels()

  const toggleSection = (label: string) => {
    setExpandedSections(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  const handleCreateChannel = async (name: string, description: string) => {
    try {
      await createChannel({ name, description });
      setIsCreateChannelOpen(false);
    } catch (error) {
      console.error('Failed to create channel:', error);
    }
  }

  const handleChannelClick = (channelId: string) => {
    router.push(`/channels/${channelId}`);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Workspace Name */}
      <div className="px-4 py-3 text-lg font-semibold text-[#8ba3d4]">
        {workspaceName}
      </div>

      {/* Channels Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2">
          <div className="mb-4">
            <div
              className="flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-[#242b3d] rounded-lg"
              onClick={() => toggleSection("Channels")}
            >
              <div className="flex items-center gap-2">
                {expandedSections.includes("Channels") ? (
                  <ChevronDown className="w-4 h-4 text-[#8ba3d4]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#8ba3d4]" />
                )}
                <span className="text-sm font-medium text-[#8ba3d4]">Channels</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreateChannelOpen(true);
                }}
                className="p-1 hover:bg-[#1f2437] rounded-md"
              >
                <Plus className="w-4 h-4 text-[#8ba3d4]" />
              </button>
            </div>

            {expandedSections.includes("Channels") && (
              <div className="mt-1 space-y-1">
                {isLoading ? (
                  <div className="px-8 py-2 text-sm text-[#8ba3d4]">Loading...</div>
                ) : error ? (
                  <div className="px-8 py-2 text-sm text-red-400">Error loading channels</div>
                ) : channels?.length === 0 ? (
                  <div className="px-8 py-2 text-sm text-[#8ba3d4]">No channels yet</div>
                ) : (
                  channels?.map((channel) => (
                    <div
                      key={channel.id}
                      className={cn(
                        "flex items-center justify-between px-8 py-2 cursor-pointer rounded-lg",
                        channel.id === currentChannel
                          ? "bg-[#242b3d] text-white"
                          : "text-[#8ba3d4] hover:bg-[#1f2437]"
                      )}
                      onClick={() => handleChannelClick(channel.id)}
                    >
                      <span className="text-sm"># {channel.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === channel.id ? null : channel.id);
                        }}
                        className="p-1 hover:bg-[#242b3d] rounded-md"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Channel Modal */}
      <ModalCreateChannel
        isOpen={isCreateChannelOpen}
        onClose={() => setIsCreateChannelOpen(false)}
        onSubmit={handleCreateChannel}
      />
    </div>
  )
} 