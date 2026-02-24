import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

export function useRejectApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicant: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectApplication(applicant);
    },
    onSuccess: () => {
      toast.success('Application rejected');
      queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
    },
    onError: (error: any) => {
      console.error('Error rejecting application:', error);
      toast.error(error.message || 'Failed to reject application');
    },
  });
}
