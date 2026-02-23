import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { MemberRole } from '../backend';
import { toast } from 'sonner';

export function useAddMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      role,
      photoUrl,
      bio,
    }: {
      name: string;
      role: MemberRole;
      photoUrl: string;
      bio: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMember(name, role, photoUrl, bio || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add member: ${error.message}`);
    },
  });
}
