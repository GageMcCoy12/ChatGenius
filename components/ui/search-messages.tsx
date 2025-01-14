import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CurrentMessage } from "./current-message";
import axios from "axios";
import { useParams } from "next/navigation";

interface LocalAIMessage {
  content: string;
  isAI: true;
}

export function SearchMessages() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<LocalAIMessage | null>(null);
  const params = useParams();

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

  return (
    <div className="flex flex-col gap-4 w-full">
      <form onSubmit={handleSearch} className="relative w-full">
        <Input
          placeholder="Ask AI about the chat history..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="w-full bg-zinc-100/90 dark:bg-zinc-700/75 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
        />
        <Button
          size="sm"
          variant="ghost"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-600"
          disabled={isLoading}
          type="submit"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {aiResponse && (
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
      )}
    </div>
  );
} 