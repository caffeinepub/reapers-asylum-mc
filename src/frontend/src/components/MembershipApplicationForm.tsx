import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useSubmitApplication } from '../hooks/useSubmitApplication';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, UserPlus } from 'lucide-react';

export default function MembershipApplicationForm() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const submitApplication = useSubmitApplication();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isAuthenticated = !!identity;

  // Don't show form if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Don't show form while loading profile
  if (profileLoading) {
    return (
      <Card className="border-2 metal-border">
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Don't show form if user already has a member role
  if (userProfile?.memberRole) {
    return (
      <Card className="border-2 metal-border">
        <CardContent className="p-8">
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription className="font-heading">
              You are already a member of Reapers Asylum MC
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show success message after submission
  if (submitted) {
    return (
      <Card className="border-2 metal-border">
        <CardContent className="p-8">
          <Alert className="border-primary/50">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertDescription className="font-heading text-lg">
              Application submitted successfully! An admin will review your application soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      return;
    }

    if (bio.trim().length < 20) {
      return;
    }

    try {
      await submitApplication.mutateAsync({ name: name.trim(), bio: bio.trim() });
      setName('');
      setBio('');
      setSubmitted(true);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  return (
    <Card className="border-2 metal-border">
      <CardHeader>
        <CardTitle className="font-display text-2xl flex items-center gap-2">
          <UserPlus className="h-6 w-6" />
          Apply for Membership
        </CardTitle>
        <CardDescription className="text-base">
          Submit your application to join the Reapers Asylum MC brotherhood
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="font-heading text-lg">
              Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="mt-2"
            />
            {name.length > 0 && name.length < 2 && (
              <p className="text-sm text-destructive mt-1">Name must be at least 2 characters</p>
            )}
          </div>

          <div>
            <Label htmlFor="bio" className="font-heading text-lg">
              Bio *
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself, your riding experience, and why you want to join Reapers Asylum MC..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              minLength={20}
              rows={6}
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {bio.length} / 20 characters minimum
            </p>
            {bio.length > 0 && bio.length < 20 && (
              <p className="text-sm text-destructive mt-1">Bio must be at least 20 characters</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitApplication.isPending || name.trim().length < 2 || bio.trim().length < 20}
            className="font-heading uppercase tracking-wider w-full"
          >
            {submitApplication.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Submit Application
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
