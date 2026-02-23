import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function usePostNews() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content, postedBy }: { title: string; content: string; postedBy: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.postNews(title, content, postedBy);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsFeed'] });
    },
  });
}
