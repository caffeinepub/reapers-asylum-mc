import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

export function useApproveApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicant: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveApplication(applicant);
    },
    onSuccess: () => {
      toast.success('Application approved successfully');
      queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error: any) => {
      console.error('Error approving application:', error);
      toast.error(error.message || 'Failed to approve application');
    },
  });
}
