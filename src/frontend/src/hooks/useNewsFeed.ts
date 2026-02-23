import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { News } from '../backend';

export function useNewsFeed() {
  const { actor, isFetching } = useActor();

  return useQuery<News[]>({
    queryKey: ['newsFeed'],
    queryFn: async () => {
      if (!actor) return [];
      const news = await actor.getNewsFeed();
      return news.sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !isFetching,
  });
}
