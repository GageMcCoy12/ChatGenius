import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';

export function useCurrentUser() {
  const { user: clerkUser } = useUser();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await fetch('/api/users/me');
      if (!response.ok) {
        const error = await response.text();
        throw new Error('Failed to fetch current user');
      }
      const data = await response.json();
      return data;
    },
    enabled: !!clerkUser,
  });
} 