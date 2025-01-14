"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { Search, User } from "lucide-react"
import { CurrentProfileCard } from "./current-profile-card"
import { useUser, SignInButton } from "@clerk/nextjs"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { CurrentMessage } from "./current-message"

interface CurrentHeaderProps {
  sidebarCollapsed: boolean
}

interface LocalAIMessage {
  content: string;
  isAI: true;
}

export function CurrentHeader({ sidebarCollapsed }: CurrentHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [aiResponse, setAiResponse] = React.useState<LocalAIMessage | null>(null)
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

  const handleSearch = async (e: React.FormEvent) => {
    console.log("🔍 Search triggered with query:", query);
    e.preventDefault();
    if (!query.trim() || isLoading) {
      console.log("❌ Search cancelled - empty query or loading");
      return;
    }

    try {
      console.log("🚀 Starting API request...");
      setIsLoading(true);
      const response = await axios.post("/api/messages/ai", {
        question: query,
        channelId: params.channelId,
      });
      
      console.log("✅ API response received:", response.data);
      setAiResponse({
        content: response.data,
        isAI: true,
      });
      
      setQuery("");
    } catch (error) {
      console.error("❌ API request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      console.log("⌨️ Enter key pressed");
      e.preventDefault();
      handleSearch(e);
    }
  };

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
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8ba3d4]" />
            <input
              type="text"
              placeholder="Ask gAIge anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="w-full bg-[#242b3d] text-[#8ba3d4] rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#3d4663] placeholder-[#566388]"
            />
          </form>
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

      {aiResponse && (
        <div className={cn(
          "fixed z-10 w-full max-w-xl left-1/2 -translate-x-1/2 top-20",
          "bg-[#1a1f2e] rounded-lg shadow-lg border border-[#2a3142]"
        )}>
          <CurrentMessage
            content={aiResponse.content}
            isAI={true}
            user={{
              id: "ai",
              username: "AI Assistant",
              email: "",
              imageUrl: "/ai-avatar.png",
              isOnline: true,
              status: "ACTIVE",
              lastSeen: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
              roleId: "",
            }}
          />
        </div>
      )}

      {user && (
        <CurrentProfileCard
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </>
  );
} 