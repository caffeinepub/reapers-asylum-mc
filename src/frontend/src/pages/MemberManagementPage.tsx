import { useState } from 'react';
import { useIsCallerAdmin } from '../hooks/useIsCallerAdmin';
import { useMembers } from '../hooks/useMembers';
import { useAddMember } from '../hooks/useAddMember';
import { useUpdateMember } from '../hooks/useUpdateMember';
import { useDeleteMember } from '../hooks/useDeleteMember';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Edit, Trash2, Crown, Star, Compass, Clipboard, Shield, DollarSign, Flame, ShieldCheck, Heart, UserPlus, User } from 'lucide-react';
import { MemberRole, Member } from '../backend';

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

export default function MemberManagementPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: members, isLoading: membersLoading } = useMembers();
  const addMember = useAddMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();

  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: MemberRole.member,
    photoUrl: '',
    bio: '',
  });

  if (adminLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    if (editingMember) {
      await updateMember.mutateAsync({
        id: editingMember.id,
        name: formData.name,
        role: formData.role,
        photoUrl: formData.photoUrl,
        bio: formData.bio,
      });
      setEditingMember(null);
    } else {
      await addMember.mutateAsync({
        name: formData.name,
        role: formData.role,
        photoUrl: formData.photoUrl,
        bio: formData.bio,
      });
    }

    setFormData({
      name: '',
      role: MemberRole.member,
      photoUrl: '',
      bio: '',
    });
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      photoUrl: member.photoUrl,
      bio: member.bio || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: MemberRole.member,
      photoUrl: '',
      bio: '',
    });
  };

  const handleDelete = async (id: string) => {
    await deleteMember.mutateAsync(id);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="font-display text-5xl md:text-6xl mb-4 chrome-text">Member Management</h1>
        <p className="text-xl text-muted-foreground font-heading uppercase tracking-wider">
          Add, Edit, and Remove Club Members
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Add/Edit Member Form */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-3xl">
              {editingMember ? <Edit className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
              {editingMember ? 'Edit Member' : 'Add New Member'}
            </CardTitle>
            <CardDescription>
              {editingMember ? 'Update member information' : 'Fill in the details to add a new member to the roster'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-heading uppercase tracking-wider">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter member name"
                    required
                    className="border-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="font-heading uppercase tracking-wider">
                    Role <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value as MemberRole })}
                  >
                    <SelectTrigger id="role" className="border-2">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={MemberRole.president}>President</SelectItem>
                      <SelectItem value={MemberRole.vicePresident}>Vice President</SelectItem>
                      <SelectItem value={MemberRole.roadCaptain}>Road Captain</SelectItem>
                      <SelectItem value={MemberRole.secretary}>Secretary</SelectItem>
                      <SelectItem value={MemberRole.sergeantAtArms}>Sergeant at Arms</SelectItem>
                      <SelectItem value={MemberRole.treasurer}>Treasurer</SelectItem>
                      <SelectItem value={MemberRole.enforcer}>Enforcer</SelectItem>
                      <SelectItem value={MemberRole.tailGunner}>Tail Gunner</SelectItem>
                      <SelectItem value={MemberRole.chaplain}>Chaplain</SelectItem>
                      <SelectItem value={MemberRole.prospect}>Prospect</SelectItem>
                      <SelectItem value={MemberRole.member}>Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photoUrl" className="font-heading uppercase tracking-wider">
                  Photo URL
                </Label>
                <Input
                  id="photoUrl"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  type="url"
                  className="border-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="font-heading uppercase tracking-wider">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Enter member bio (optional)"
                  rows={4}
                  className="border-2"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={addMember.isPending || updateMember.isPending}
                  className="font-heading uppercase tracking-wider"
                >
                  {addMember.isPending || updateMember.isPending ? (
                    'Saving...'
                  ) : editingMember ? (
                    'Update Member'
                  ) : (
                    'Add Member'
                  )}
                </Button>
                {editingMember && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="font-heading uppercase tracking-wider"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Current Members List */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-3xl">
              <Users className="h-6 w-6" />
              Current Members
            </CardTitle>
            <CardDescription>Manage existing club members</CardDescription>
          </CardHeader>
          <CardContent>
            {membersLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : members && members.length > 0 ? (
              <div className="space-y-4">
                {members.map((member) => {
                  const RoleIcon = getRoleIcon(member.role);
                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border-2 border-border hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <RoleIcon className="h-8 w-8 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-xl mb-1">{member.name}</h3>
                          <Badge variant={getRoleVariant(member.role)} className="font-heading uppercase">
                            {getRoleLabel(member.role)}
                          </Badge>
                          {member.bio && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{member.bio}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(member)}
                          className="border-2"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" className="border-2">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Member</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {member.name} from the roster? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="font-heading uppercase tracking-wider">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(member.id)}
                                className="bg-destructive hover:bg-destructive/90 font-heading uppercase tracking-wider"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No members found. Add your first member above.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
