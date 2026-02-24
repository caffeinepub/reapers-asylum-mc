import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useIsCallerAdmin } from './useIsCallerAdmin';
import { MembershipApplication } from '../backend';

export function usePendingApplications() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: isAdmin, isFetching: isAdminFetching } = useIsCallerAdmin();

  return useQuery<MembershipApplication[]>({
    queryKey: ['pendingApplications'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      console.log('[usePendingApplications] Calling actor.getPendingApplications()...');
      const result = await actor.getPendingApplications();
      console.log('[usePendingApplications] Raw response from backend:', result);
      console.log('[usePendingApplications] Number of applications received:', result.length);
      if (result.length > 0) {
        console.log('[usePendingApplications] Sample application:', result[0]);
      }
      return result;
    },
    enabled: !!actor && !actorFetching && !isAdminFetching && isAdmin === true,
    retry: false,
  });
}
