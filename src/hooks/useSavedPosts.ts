import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { DbPost } from '@/hooks/usePosts';

interface SavedPostPreference {
  post_id: string;
  is_saved: boolean;
}

export function useSavedPosts(posts: DbPost[]) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (!user) {
      setPreferences(new Map());
      return;
    }

    const fetchPreferences = async () => {
      const { data, error } = await supabase
        .from('saved_posts')
        .select('post_id, is_saved')
        .eq('user_id', user.id);

      if (error) {
        if (import.meta.env.DEV) console.error('Error fetching saved posts:', error);
        return;
      }

      setPreferences(new Map(
        ((data as SavedPostPreference[]) || []).map((preference) => [preference.post_id, preference.is_saved]),
      ));
    };

    fetchPreferences();
  }, [user]);

  const savedPostIds = useMemo(() => new Set(
    posts
      .filter((post) => preferences.get(post.id) ?? post.is_default_saved)
      .map((post) => post.id),
  ), [posts, preferences]);

  const toggleSavedPost = useCallback(async (postId: string) => {
    if (!user) return;

    const post = posts.find((candidate) => candidate.id === postId);
    if (!post) return;

    const nextValue = !(preferences.get(postId) ?? post.is_default_saved);
    setPreferences((current) => new Map(current).set(postId, nextValue));

    const { error } = await supabase
      .from('saved_posts')
      .upsert(
        { user_id: user.id, post_id: postId, is_saved: nextValue },
        { onConflict: 'user_id,post_id' },
      );

    if (error) {
      setPreferences((current) => {
        const reverted = new Map(current);
        reverted.delete(postId);
        return reverted;
      });
      if (import.meta.env.DEV) console.error('Error updating saved post:', error);
    }
  }, [posts, preferences, user]);

  return { savedPostIds, toggleSavedPost };
}