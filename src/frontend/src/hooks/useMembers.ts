import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Member } from '../backend';

export function useMembers() {
  const { actor, isFetching } = useActor();

  return useQuery<Member[]>({
    queryKey: ['members'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMembers();
    },
    enabled: !!actor && !isFetching,
  });
}
