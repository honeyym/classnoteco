import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface StudyGroup {
  id: string;
  course_id: string;
  name: string;
  description: string;
  creator_id: string;
  max_members: number;
  created_at: string;
  member_count: number;
  is_member: boolean;
}

export function useStudyGroups(courseId: string) {
  const { user } = useAuth();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGroups = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    const { data: groupsData, error } = await supabase
      .from('study_groups')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });

    if (error || !groupsData) {
      setIsLoading(false);
      return;
    }

    const groupIds = groupsData.map(g => g.id);
    
    const { data: membersData } = groupIds.length > 0
      ? await supabase
          .from('study_group_members')
          .select('group_id, user_id')
          .in('group_id', groupIds)
      : { data: [] };

    const members = membersData || [];

    const enriched: StudyGroup[] = groupsData.map(g => ({
      ...g,
      description: g.description || '',
      member_count: members.filter(m => m.group_id === g.id).length,
      is_member: members.some(m => m.group_id === g.id && m.user_id === user.id),
    }));

    setGroups(enriched);
    setIsLoading(false);
  }, [courseId, user]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const createGroup = async (name: string, description: string, maxMembers: number) => {
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('study_groups')
      .insert({ course_id: courseId, name, description, creator_id: user.id, max_members: maxMembers })
      .select()
      .single();

    if (error) return { error: error.message };

    // Auto-join creator
    await supabase
      .from('study_group_members')
      .insert({ group_id: data.id, user_id: user.id });

    await fetchGroups();
    return { error: null };
  };

  const joinGroup = async (groupId: string) => {
    if (!user) return;
    await supabase
      .from('study_group_members')
      .insert({ group_id: groupId, user_id: user.id });
    await fetchGroups();
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return;
    await supabase
      .from('study_group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id);
    await fetchGroups();
  };

  const deleteGroup = async (groupId: string) => {
    await supabase.from('study_groups').delete().eq('id', groupId);
    await fetchGroups();
  };

  return { groups, isLoading, createGroup, joinGroup, leaveGroup, deleteGroup };
}
