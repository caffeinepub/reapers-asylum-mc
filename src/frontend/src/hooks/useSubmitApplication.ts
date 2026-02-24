import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

export function useSubmitApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, bio }: { name: string; bio: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitMembershipApplication(name, bio);
    },
    onSuccess: () => {
      toast.success('Application submitted successfully! Awaiting admin approval.');
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: (error: any) => {
      console.error('Error submitting application:', error);
      toast.error(error.message || 'Failed to submit application');
    },
  });
}
