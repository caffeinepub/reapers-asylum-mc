import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useIsCallerAdmin } from '../hooks/useIsCallerAdmin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, User, Copy, Check, Calendar, Shield } from 'lucide-react';
import { toast } from 'sonner';
import AdminBadge from '../components/AdminBadge';
import { useNavigate } from '@tanstack/react-router';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const navigate = useNavigate();
  
  const [copied, setCopied] = useState(false);

  const isAuthenticated = !!identity;

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    navigate({ to: '/' });
    return null;
  }

  const principalId = identity.getPrincipal().toString();

  const handleCopyPrincipal = async () => {
    try {
      await navigator.clipboard.writeText(principalId);
      setCopied(true);
      toast.success('Principal ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy principal ID');
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getMemberRoleLabel = (role?: string) => {
    if (!role) return 'Member';
    const roleMap: Record<string, string> = {
      president: 'President',
      vicePresident: 'Vice President',
      roadCaptain: 'Road Captain',
      secretary: 'Secretary',
      treasurer: 'Treasurer',
      member: 'Member',
      guest: 'Guest',
    };
    return roleMap[role] || 'Member';
  };

  if (profileLoading || isAdminLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <User className="h-8 w-8 text-primary" />
            <h1 className="font-display text-4xl chrome-text">Your Profile</h1>
          </div>
          <p className="text-muted-foreground">
            View your profile information and principal ID
          </p>
        </div>

        {/* Profile Information */}
        <Card className="mb-6 border-2 metal-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-2xl">Profile Information</CardTitle>
              {isAdmin && <AdminBadge />}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {userProfile ? (
              <>
                <div>
                  <Label className="font-heading text-lg text-muted-foreground">Name</Label>
                  <p className="text-xl font-heading mt-1">{userProfile.name}</p>
                </div>

                {userProfile.memberRole && (
                  <div>
                    <Label className="font-heading text-lg text-muted-foreground">Club Role</Label>
                    <p className="text-xl font-heading mt-1">
                      {getMemberRoleLabel(userProfile.memberRole)}
                    </p>
                  </div>
                )}

                {userProfile.bio && (
                  <div>
                    <Label className="font-heading text-lg text-muted-foreground">Bio</Label>
                    <p className="text-base mt-1">{userProfile.bio}</p>
                  </div>
                )}

                <div>
                  <Label className="font-heading text-lg text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Member Since
                  </Label>
                  <p className="text-xl font-heading mt-1">{formatDate(userProfile.joinDate)}</p>
                </div>

                {isAdmin && (
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-primary">
                      <Shield className="h-5 w-5" />
                      <span className="font-heading text-lg uppercase">Administrator</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      You have full administrative privileges
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">No profile information available</p>
            )}
          </CardContent>
        </Card>

        {/* Principal ID */}
        <Card className="border-2 metal-border">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Principal ID</CardTitle>
            <CardDescription>
              Your unique identifier on the Internet Computer. Share this ID with an administrator
              to request admin access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 border border-border break-all">
                <p className="font-mono text-sm">{principalId}</p>
              </div>
              <Button
                onClick={handleCopyPrincipal}
                variant="outline"
                className="font-heading uppercase tracking-wider"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Principal ID
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <label className={`block text-sm font-medium ${className}`}>{children}</label>;
}
