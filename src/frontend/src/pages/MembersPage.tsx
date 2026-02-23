import { useMembers } from '../hooks/useMembers';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Shield, Navigation, FileText, DollarSign, User, UserPlus } from 'lucide-react';
import { MemberRole } from '../backend';

function getRoleIcon(role: MemberRole) {
  switch (role) {
    case MemberRole.president:
      return Shield;
    case MemberRole.vicePresident:
      return Shield;
    case MemberRole.roadCaptain:
      return Navigation;
    case MemberRole.secretary:
      return FileText;
    case MemberRole.treasurer:
      return DollarSign;
    case MemberRole.member:
      return User;
    case MemberRole.guest:
      return UserPlus;
    default:
      return User;
  }
}

function getRoleLabel(role: MemberRole): string {
  switch (role) {
    case MemberRole.president:
      return 'President';
    case MemberRole.vicePresident:
      return 'Vice President';
    case MemberRole.roadCaptain:
      return 'Road Captain';
    case MemberRole.secretary:
      return 'Secretary';
    case MemberRole.treasurer:
      return 'Treasurer';
    case MemberRole.member:
      return 'Member';
    case MemberRole.guest:
      return 'Guest';
    default:
      return 'Member';
  }
}

function getRoleVariant(role: MemberRole): 'default' | 'secondary' | 'outline' {
  if (role === MemberRole.president || role === MemberRole.vicePresident) {
    return 'default';
  }
  if (role === MemberRole.roadCaptain || role === MemberRole.secretary || role === MemberRole.treasurer) {
    return 'secondary';
  }
  return 'outline';
}

export default function MembersPage() {
  const { identity } = useInternetIdentity();
  const { data: members, isLoading, error } = useMembers();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="font-display text-4xl mb-4">Members Only</h1>
          <p className="text-muted-foreground">Please login to view the club roster.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-display text-4xl mb-4 text-destructive">Error Loading Members</h1>
          <p className="text-muted-foreground">Unable to load the member roster. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="font-display text-5xl md:text-6xl mb-4 chrome-text">Club Roster</h1>
        <p className="text-xl text-muted-foreground font-heading uppercase tracking-wider">
          The Brotherhood of Reapers Asylum MC
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : members && members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => {
            const RoleIcon = getRoleIcon(member.role);
            return (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="font-display text-2xl">{member.name}</span>
                    <RoleIcon className="h-6 w-6 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={getRoleVariant(member.role)} className="font-heading uppercase">
                    {getRoleLabel(member.role)}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No members found. The roster is currently empty.</p>
        </div>
      )}
    </div>
  );
}
