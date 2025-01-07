import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';

export function useCurrentUser() {
  const { user: clerkUser } = useUser();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      console.log('Fetching current user...');
      const response = await fetch('/api/users/me');
      if (!response.ok) {
        const error = await response.text();
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch current user');
      }
      const data = await response.json();
      console.log('Current user data:', data);
      return data;
    },
    enabled: !!clerkUser,
  });
} 