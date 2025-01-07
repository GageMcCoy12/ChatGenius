'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

interface SearchResult {
  id: string;
  text: string;
  createdAt: string;
  channelId: string;
  channel: string;
  user: {
    username: string;
  };
}

export function SearchMessages() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const { data: results = [], isLoading } = useQuery<SearchResult[]>({
    queryKey: ['search-messages', search],
    queryFn: async () => {
      if (!search.trim()) return [];
      const response = await fetch(`/api/messages/search?q=${encodeURIComponent(search)}`);
      if (!response.ok) throw new Error('Failed to search messages');
      return response.json();
    },
    enabled: !!search,
  });

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    router.push(`/channels/${result.channel.toLowerCase()}?message=${result.id}`);
  };

  return (
    <>
      <button
        className="flex items-center gap-2 px-2 h-9 rounded-md bg-muted text-muted-foreground text-sm hover:bg-muted/80"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span>Search messages...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Search messages</DialogTitle>
        <CommandInput 
          placeholder="Search messages..." 
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Messages">
            {results.map((result) => (
              <CommandItem
                key={result.id}
                value={result.id}
                onSelect={() => handleSelect(result)}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{result.user.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(result.createdAt), 'MMM d, yyyy HH:mm')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      in #{result.channel}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {result.text}
                  </p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
} 