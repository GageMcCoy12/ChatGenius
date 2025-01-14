import * as React from "react"
import { cn } from "@/lib/utils"
import { useChannels } from "@/hooks/use-channels"
import { useRouter, useParams } from "next/navigation"
import { ChevronDown, ChevronRight, MoreVertical, Plus } from "lucide-react"
import { ModalCreateChannel } from "./modal-create-channel"

export function CurrentChannelList() {
  const [expandedSections, setExpandedSections] = React.useState<string[]>(["Channels"])
  const [isCreateChannelOpen, setIsCreateChannelOpen] = React.useState(false)
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null)
  
  const router = useRouter()
  const params = useParams()
  const currentChannel = params?.channelId as string
  const { channels, isLoading, error, mutate } = useChannels()

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const handleChannelClick = (channelId: string) => {
    router.push(`/channels/${channelId}`)
  }

  const handleCreateChannel = async (name: string) => {
    try {
      const response = await fetch("/api/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      })

      if (!response.ok) throw new Error("Failed to create channel")

      const { channelId } = await response.json()
      mutate() // Refresh channels list
      router.push(`/channels/${channelId}`)
    } catch (error) {
      console.error("Error creating channel:", error)
    } finally {
      setIsCreateChannelOpen(false)
    }
  }

  return (
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
                e.stopPropagation()
                setIsCreateChannelOpen(true)
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
                      "flex items-center justify-between px-8 py-2 rounded-lg",
                      channel.id === currentChannel
                        ? "bg-[#242b3d] text-white"
                        : "text-[#8ba3d4] hover:bg-[#1f2437]"
                    )}
                  >
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleChannelClick(channel.id)}
                    >
                      <span className="text-sm"># {channel.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveMenu(activeMenu === channel.id ? null : channel.id)
                      }}
                      className="p-1 hover:bg-[#242b3d] rounded-md cursor-pointer"
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

      {/* Create Channel Modal */}
      <ModalCreateChannel
        isOpen={isCreateChannelOpen}
        onClose={() => setIsCreateChannelOpen(false)}
        onSubmit={handleCreateChannel}
      />
    </div>
  )
} 