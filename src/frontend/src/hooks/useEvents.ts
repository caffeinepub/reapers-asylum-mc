import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Event } from '../backend';

export function useEvents() {
  const { actor, isFetching } = useActor();

  return useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEvents();
    },
    enabled: !!actor && !isFetching,
  });
}
