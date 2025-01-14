"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { ChevronDown, ChevronRight, MoreVertical, Bell, BellOff, Plus } from "lucide-react"
import { ModalCreateChannel } from "../ui/modal-create-channel"
import { useChannels } from "@/hooks/use-channels"
import { useRouter, useParams } from "next/navigation"
import { CurrentChannelList } from "./current-channel-list"
import { CurrentDMList } from "./current-dm-list"

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
      <CurrentChannelList />
      <CurrentDMList />
    </div>
  )
} 