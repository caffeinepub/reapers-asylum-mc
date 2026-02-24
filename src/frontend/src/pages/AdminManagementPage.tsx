import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useIsCallerAdmin';
import { useAssignUserRole } from '../hooks/useAssignUserRole';
import { usePendingApplications } from '../hooks/usePendingApplications';
import { useApproveApplication } from '../hooks/useApproveApplication';
import { useRejectApplication } from '../hooks/useRejectApplication';
import { Principal } from '@dfinity/principal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Shield, UserPlus, Info, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import { UserRole } from '../backend';

export default function AdminManagementPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const assignUserRole = useAssignUserRole();
  const pendingApplicationsQuery = usePendingApplications();
  const approveApplication = useApproveApplication();
  const rejectApplication = useRejectApplication();
  
  const [newAdminPrincipal, setNewAdminPrincipal] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const isAuthenticated = !!identity;

  // Debug logging for pending applications
  useEffect(() => {
    console.log('[AdminManagementPage] Pending applications query state:', {
      data: pendingApplicationsQuery.data,
      isLoading: pendingApplicationsQuery.isLoading,
      isError: pendingApplicationsQuery.isError,
      error: pendingApplicationsQuery.error,
      isFetching: pendingApplicationsQuery.isFetching,
      isSuccess: pendingApplicationsQuery.isSuccess,
      dataUpdatedAt: pendingApplicationsQuery.dataUpdatedAt,
    });
    
    if (pendingApplicationsQuery.data) {
      console.log('[AdminManagementPage] Applications array:', pendingApplicationsQuery.data);
      console.log('[AdminManagementPage] Applications count:', pendingApplicationsQuery.data.length);
      if (pendingApplicationsQuery.data.length > 0) {
        console.log('[AdminManagementPage] First application:', pendingApplicationsQuery.data[0]);
      }
    }
  }, [pendingApplicationsQuery.data, pendingApplicationsQuery.isLoading, pendingApplicationsQuery.isError, pendingApplicationsQuery.dataUpdatedAt]);

  // Show loading state while checking admin status
  if (!isAuthenticated || isAdminLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  const handleAddAdmin = async () => {
    if (!newAdminPrincipal.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }

    setIsValidating(true);
    try {
      const principal = Principal.fromText(newAdminPrincipal.trim());
      await assignUserRole.mutateAsync({
        user: principal,
        role: UserRole.admin,
      });
      toast.success('Admin privileges granted successfully');
      setNewAdminPrincipal('');
    } catch (error: any) {
      console.error('Error adding admin:', error);
      if (error.message?.includes('Invalid principal') || error.message?.includes('Textual representation')) {
        toast.error('Invalid principal ID format');
      } else {
        toast.error(error.message || 'Failed to grant admin privileges');
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleRevokeAdmin = async (principalText: string) => {
    if (!principalText.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }

    setIsValidating(true);
    try {
      const principal = Principal.fromText(principalText.trim());
      await assignUserRole.mutateAsync({
        user: principal,
        role: UserRole.user,
      });
      toast.success('Admin privileges revoked successfully');
    } catch (error: any) {
      console.error('Error revoking admin:', error);
      if (error.message?.includes('Invalid principal') || error.message?.includes('Textual representation')) {
        toast.error('Invalid principal ID format');
      } else {
        toast.error(error.message || 'Failed to revoke admin privileges');
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleApprove = async (applicant: Principal) => {
    try {
      await approveApplication.mutateAsync(applicant);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleReject = async (applicant: Principal) => {
    try {
      await rejectApplication.mutateAsync(applicant);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const currentUserPrincipal = identity?.getPrincipal().toString();

  const { data: pendingApplications, isLoading: applicationsLoading, isError: applicationsError, error: applicationsErrorObj } = pendingApplicationsQuery;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="font-display text-4xl chrome-text">Admin Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage administrator privileges for the Reapers Asylum MC application
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-8 border-2 border-primary/50">
          <Info className="h-4 w-4" />
          <AlertTitle className="font-heading text-lg">Your Principal ID</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="text-sm mb-2">You are currently logged in as:</p>
            <code className="block p-2 bg-muted/50 border border-border text-xs break-all font-mono">
              {currentUserPrincipal}
            </code>
          </AlertDescription>
        </Alert>

        {/* Membership Applications Section */}
        <Card className="mb-8 border-2 metal-border">
          <CardHeader>
            <CardTitle className="font-display text-2xl flex items-center gap-2">
              <UserPlus className="h-6 w-6" />
              Membership Applications
            </CardTitle>
            <CardDescription>
              Review and approve or reject pending membership applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applicationsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : applicationsError ? (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Applications</AlertTitle>
                <AlertDescription className="font-heading">
                  {applicationsErrorObj?.message || 'Failed to load pending applications'}
                </AlertDescription>
              </Alert>
            ) : !pendingApplications || pendingApplications.length === 0 ? (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription className="font-heading">
                  No pending membership applications at this time
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {pendingApplications.map((application) => (
                  <Card key={application.applicant.toString()} className="border-2">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-display text-xl mb-1">{application.name}</h3>
                          <p className="text-sm text-muted-foreground font-mono">
                            {application.applicant.toString()}
                          </p>
                        </div>
                        
                        <div>
                          <Label className="font-heading text-sm">Bio</Label>
                          <p className="text-sm mt-1 text-muted-foreground">{application.bio}</p>
                        </div>

                        <div>
                          <Label className="font-heading text-sm">Submitted</Label>
                          <p className="text-sm mt-1 text-muted-foreground">
                            {new Date(Number(application.timestamp / 1000000n)).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            onClick={() => handleApprove(application.applicant)}
                            disabled={approveApplication.isPending || rejectApplication.isPending}
                            className="font-heading uppercase tracking-wider"
                          >
                            {approveApplication.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Approving...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleReject(application.applicant)}
                            disabled={approveApplication.isPending || rejectApplication.isPending}
                            variant="destructive"
                            className="font-heading uppercase tracking-wider"
                          >
                            {rejectApplication.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Rejecting...
                              </>
                            ) : (
                              <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add New Admin */}
        <Card className="mb-8 border-2 metal-border">
          <CardHeader>
            <CardTitle className="font-display text-2xl flex items-center gap-2">
              <UserPlus className="h-6 w-6" />
              Grant Admin Privileges
            </CardTitle>
            <CardDescription>
              Enter the principal ID of the user you want to grant admin privileges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="principal" className="font-heading text-lg">
                  Principal ID
                </Label>
                <Input
                  id="principal"
                  type="text"
                  placeholder="Enter principal ID (e.g., xxxxx-xxxxx-xxxxx-xxxxx-xxx)"
                  value={newAdminPrincipal}
                  onChange={(e) => setNewAdminPrincipal(e.target.value)}
                  className="mt-2 font-mono text-sm"
                />
              </div>
              <Button
                onClick={handleAddAdmin}
                disabled={isValidating || assignUserRole.isPending}
                className="font-heading uppercase tracking-wider"
              >
                {isValidating || assignUserRole.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Granting...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Grant Admin Access
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Revoke Admin */}
        <Card className="border-2 metal-border">
          <CardHeader>
            <CardTitle className="font-display text-2xl flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Revoke Admin Privileges
            </CardTitle>
            <CardDescription>
              Enter the principal ID of the user whose admin privileges you want to revoke
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="revoke-principal" className="font-heading text-lg">
                  Principal ID
                </Label>
                <Input
                  id="revoke-principal"
                  type="text"
                  placeholder="Enter principal ID to revoke admin access"
                  className="mt-2 font-mono text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget;
                      handleRevokeAdmin(input.value);
                      input.value = '';
                    }
                  }}
                />
              </div>
              <Button
                onClick={(e) => {
                  const input = document.getElementById('revoke-principal') as HTMLInputElement;
                  if (input) {
                    handleRevokeAdmin(input.value);
                    input.value = '';
                  }
                }}
                disabled={isValidating || assignUserRole.isPending}
                variant="destructive"
                className="font-heading uppercase tracking-wider"
              >
                {isValidating || assignUserRole.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Revoking...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Revoke Admin Access
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
