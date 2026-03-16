import { useState } from 'react';
import { useStudyGroups } from '@/hooks/useStudyGroups';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Users, Plus, LogIn, LogOut, Trash2, Crown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StudyGroupsProps {
  courseId: string;
}

export default function StudyGroups({ courseId }: StudyGroupsProps) {
  const { user } = useAuth();
  const { groups, isLoading, createGroup, joinGroup, leaveGroup, deleteGroup } = useStudyGroups(courseId);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    const { error } = await createGroup(name.trim(), description.trim(), maxMembers);
    setSubmitting(false);
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Study group created!' });
      setName('');
      setDescription('');
      setMaxMembers(10);
      setShowCreate(false);
    }
  };

  const handleJoin = async (groupId: string) => {
    await joinGroup(groupId);
    toast({ title: 'Joined study group!' });
  };

  const handleLeave = async (groupId: string) => {
    await leaveGroup(groupId);
    toast({ title: 'Left study group' });
  };

  const handleDelete = async (groupId: string) => {
    await deleteGroup(groupId);
    toast({ title: 'Study group deleted' });
  };

  if (isLoading) {
    return (
      <div className="text-center py-14 text-muted-foreground">
        <div className="animate-pulse font-medium">Loading study groups...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create toggle */}
      {!showCreate ? (
        <Button onClick={() => setShowCreate(true)} className="rounded-xl gap-2">
          <Plus className="w-4 h-4" /> Create Study Group
        </Button>
      ) : (
        <div className="bg-muted/30 rounded-2xl border border-border/50 p-5 space-y-4">
          <h4 className="font-display font-semibold text-foreground">New Study Group</h4>
          <Input
            placeholder="Group name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="rounded-xl"
            maxLength={100}
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="rounded-xl resize-none"
            rows={2}
            maxLength={500}
          />
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground whitespace-nowrap">Max members:</label>
            <Input
              type="number"
              min={2}
              max={50}
              value={maxMembers}
              onChange={e => setMaxMembers(Number(e.target.value))}
              className="w-20 rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreate} disabled={submitting || !name.trim()} className="rounded-xl">
              {submitting ? 'Creating...' : 'Create'}
            </Button>
            <Button variant="ghost" onClick={() => setShowCreate(false)} className="rounded-xl">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Groups list */}
      {groups.length === 0 ? (
        <div className="text-center py-14 text-muted-foreground">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
            <Users className="w-7 h-7 opacity-50" />
          </div>
          <p className="font-semibold text-foreground">No study groups yet</p>
          <p className="text-sm mt-1">Create one to start studying together!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(group => {
            const isFull = group.member_count >= group.max_members;
            const isCreator = user?.id === group.creator_id;

            return (
              <div
                key={group.id}
                className={`rounded-2xl border p-5 transition-all duration-200 ${
                  group.is_member
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border/50 bg-card/60'
                } ${isFull && !group.is_member ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-display font-semibold text-foreground truncate">{group.name}</h4>
                      {isCreator && (
                        <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                    </div>
                    {group.description && (
                      <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
                    )}
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        isFull
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        <Users className="w-3 h-3 inline mr-1" />
                        {group.member_count}/{group.max_members}
                      </span>
                      {/* Member initials */}
                      <div className="flex -space-x-1.5">
                        {Array.from({ length: Math.min(group.member_count, 5) }).map((_, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary"
                          >
                            ?
                          </div>
                        ))}
                        {group.member_count > 5 && (
                          <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                            +{group.member_count - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {group.is_member ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLeave(group.id)}
                        className="rounded-xl gap-1.5 text-destructive hover:text-destructive"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Leave
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        disabled={isFull}
                        onClick={() => handleJoin(group.id)}
                        className="rounded-xl gap-1.5"
                      >
                        <LogIn className="w-3.5 h-3.5" /> {isFull ? 'Full' : 'Join'}
                      </Button>
                    )}
                    {isCreator && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(group.id)}
                        className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
