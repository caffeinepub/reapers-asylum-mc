import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useGetAdminList() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['adminList'],
    queryFn: async () => {
      // Backend doesn't expose getAdmins() method
      // Return empty array as we cannot fetch the admin list
      return [];
    },
    enabled: false, // Disable this query since backend doesn't support it
  });
}
