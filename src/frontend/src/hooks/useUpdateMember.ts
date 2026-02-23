import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { MemberRole } from '../backend';
import { toast } from 'sonner';

export function useUpdateMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      role,
      photoUrl,
      bio,
    }: {
      id: string;
      name: string;
      role: MemberRole;
      photoUrl: string;
      bio: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMember(id, name, role, photoUrl, bio || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update member: ${error.message}`);
    },
  });
}
