"use client"

import * as React from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu"
import { SmilePlus } from "lucide-react"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  triggerClassName?: string;
}

const commonEmojis = [
  "👍", "❤️", "😊", "😂", "🎉", "🔥", "👏", "🙌",
  "😍", "🤔", "👀", "✨", "💯", "🚀", "💪", "🙏",
  "😭", "😅", "🤣", "😳", "🤯", "🤷", "🙄", "😴"
];

export function EmojiPicker({
  onEmojiSelect,
  triggerClassName
}: EmojiPickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={triggerClassName || "p-1 rounded-full hover:bg-[#242b3d] text-[#566388] hover:text-[#8ba3d4] opacity-0 group-hover:opacity-100 transition-opacity"}
          aria-label="Add reaction"
        >
          <SmilePlus className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 p-2 grid grid-cols-8 gap-1 bg-[#1a1d2d]"
        side="top"
        align="start"
      >
        {commonEmojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onEmojiSelect(emoji)}
            className="p-1 hover:bg-[#242b3d] rounded transition-colors text-lg"
          >
            {emoji}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 