import * as React from "react"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { ChevronDown, ChevronRight, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

interface DMUser {
  id: string
  username: string | null
  imageUrl: string
  isOnline: boolean
}

export function CurrentDMList() {
  const [isExpanded, setIsExpanded] = React.useState(true)
  const router = useRouter()
  const { user: currentUser } = useUser()

  // Fetch all users except current user
  const { data: users, isLoading } = useQuery<DMUser[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error("Failed to fetch users")
      const allUsers = await response.json()
      return allUsers.filter((user: DMUser) => user.id !== currentUser?.id)
    },
    enabled: !!currentUser
  })

  const handleDMClick = async (userId: string) => {
    try {
      // Create or get DM channel
      const response = await fetch("/api/channels/dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otherUserId: userId
        })
      })

      if (!response.ok) throw new Error("Failed to create/get DM channel")
      
      const { channelId } = await response.json()
      router.push(`/channels/${channelId}`)
    } catch (error) {
      console.error("Error handling DM click:", error)
    }
  }

  return (
    <div className="mt-2">
      {/* DM Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center px-2 py-1.5 hover:bg-[#242b3d] transition-colors rounded-md group"
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-[#566388] group-hover:text-[#8ba3d4]" />
        ) : (
          <ChevronRight className="h-4 w-4 text-[#566388] group-hover:text-[#8ba3d4]" />
        )}
        <span className="ml-1 text-sm font-medium text-[#566388] group-hover:text-[#8ba3d4]">
          Direct Messages
        </span>
      </button>

      {/* DM List */}
      {isExpanded && (
        <div className="mt-1 space-y-0.5">
          {isLoading ? (
            <div className="px-2 py-1 text-sm text-[#566388]">Loading...</div>
          ) : users?.length === 0 ? (
            <div className="px-2 py-1 text-sm text-[#566388]">No users found</div>
          ) : (
            users?.map((user) => (
              <button
                key={user.id}
                onClick={() => handleDMClick(user.id)}
                className="w-full flex items-center px-2 py-1.5 hover:bg-[#242b3d] transition-colors rounded-md group"
              >
                <div className="relative">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.username || "User"}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <User className="h-6 w-6 text-[#566388] group-hover:text-[#8ba3d4]" />
                  )}
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-[#1a1f2e]" />
                  )}
                </div>
                <span className="ml-2 text-sm font-medium text-[#566388] group-hover:text-[#8ba3d4] truncate">
                  {user.username || "Anonymous"}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
} 