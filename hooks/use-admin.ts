import { useCurrentUser } from './use-current-user';

export function useAdmin() {
  const { data: user, isLoading, error } = useCurrentUser();
  
  return {
    isAdmin: user?.role.name === 'admin',
    isLoading,
    error,
  };
} 