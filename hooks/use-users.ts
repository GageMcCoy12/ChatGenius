'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  username: string;
  imageURL: string | null;
}

export function useUsers() {
  const { user: currentUser } = useUser();

  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const users: User[] = await response.json();
      return users.filter(user => user.id !== currentUser?.id);
    },
    enabled: !!currentUser,
  });
} 