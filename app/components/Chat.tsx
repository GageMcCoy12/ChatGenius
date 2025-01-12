import { CurrentHeader } from "../../components/ui/current-header"
import { CurrentMessageInput } from "../../components/ui/current-message-input"
import { CurrentMessageList } from "../../components/ui/current-message-list"
import { useSidebarState } from "../../hooks/use-sidebar-state"

interface ChatProps {
  channelId: string
}

export function Chat({ channelId }: ChatProps) {
  const { isCollapsed } = useSidebarState()

  return (
    <div className="flex flex-col h-full">
      <CurrentHeader sidebarCollapsed={isCollapsed} />
      <CurrentMessageList channelId={channelId} sidebarCollapsed={isCollapsed} />
      <CurrentMessageInput channelId={channelId} sidebarCollapsed={isCollapsed} />
    </div>
  )
} 