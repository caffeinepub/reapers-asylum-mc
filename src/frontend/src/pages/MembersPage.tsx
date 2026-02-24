import { useMembers } from '../hooks/useMembers';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Crown, Star, Compass, Clipboard, Shield, DollarSign, Flame, ShieldCheck, Heart, UserPlus, User } from 'lucide-react';
import { MemberRole } from '../backend';

function getRoleIcon(role: MemberRole) {
  switch (role) {
    case MemberRole.president:
      return Crown;
    case MemberRole.vicePresident:
      return Star;
    case MemberRole.roadCaptain:
      return Compass;
    case MemberRole.secretary:
      return Clipboard;
    case MemberRole.sergeantAtArms:
      return Shield;
    case MemberRole.treasurer:
      return DollarSign;
    case MemberRole.enforcer:
      return Flame;
    case MemberRole.tailGunner:
      return ShieldCheck;
    case MemberRole.chaplain:
      return Heart;
    case MemberRole.prospect:
      return UserPlus;
    case MemberRole.member:
      return User;
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
    case MemberRole.sergeantAtArms:
      return 'Sergeant at Arms';
    case MemberRole.treasurer:
      return 'Treasurer';
    case MemberRole.enforcer:
      return 'Enforcer';
    case MemberRole.tailGunner:
      return 'Tail Gunner';
    case MemberRole.chaplain:
      return 'Chaplain';
    case MemberRole.prospect:
      return 'Prospect';
    case MemberRole.member:
      return 'Member';
    default:
      return 'Member';
  }
}

function getRoleVariant(role: MemberRole): 'default' | 'secondary' | 'outline' {
  if (role === MemberRole.president || role === MemberRole.vicePresident) {
    return 'default';
  }
  if (role === MemberRole.roadCaptain || role === MemberRole.secretary || role === MemberRole.sergeantAtArms || role === MemberRole.treasurer) {
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
          {members.map((member) => {
            const RoleIcon = getRoleIcon(member.role);
            return (
              <Card key={member.id} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="font-display text-2xl">{member.name}</span>
                    <RoleIcon className="h-6 w-6 text-primary" />
                  </CardTitle>
                  <CardDescription>
                    <Badge variant={getRoleVariant(member.role)} className="font-heading uppercase">
                      {getRoleLabel(member.role)}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                {member.bio && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="font-display text-3xl mb-2">No Members Yet</h2>
          <p className="text-muted-foreground">The roster is currently empty.</p>
        </div>
      )}
    </div>
  );
}
