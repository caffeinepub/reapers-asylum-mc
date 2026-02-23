import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useSaveCallerUserProfile } from '../hooks/useSaveCallerUserProfile';
import { useActor } from '../hooks/useActor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { mutate: saveProfile, isPending: isSaving } = useSaveCallerUserProfile();
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    if (!showProfileSetup) {
      setName('');
      setBio('');
    }
  }, [showProfileSetup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    saveProfile(
      {
        name: name.trim(),
        bio: bio.trim(),
        joinDate: BigInt(Date.now() * 1000000),
        memberRole: undefined,
      },
      {
        onSuccess: async () => {
          // Check if user was granted admin privileges
          if (actor) {
            try {
              const isAdmin = await actor.isCallerAdmin();
              if (isAdmin) {
                toast.success('Admin Privileges Granted', {
                  description: 'You are the first member and have been granted admin privileges.',
                  icon: <Shield className="h-5 w-5 text-destructive" />,
                  duration: 5000,
                });
              }
            } catch (error) {
              console.error('Error checking admin status:', error);
            }
          }
          
          // Invalidate admin status to update UI immediately
          queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
        },
      }
    );
  };

  return (
    <Dialog open={showProfileSetup} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Welcome to Reapers Asylum MC</DialogTitle>
          <DialogDescription>Set up your profile to join the brotherhood.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              disabled={isSaving}
            />
          </div>
          <Button type="submit" className="w-full font-heading uppercase" disabled={isSaving || !name.trim()}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Join the Club'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
