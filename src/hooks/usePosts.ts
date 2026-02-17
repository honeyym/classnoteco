import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DbPost {
  id: string;
  course_id: string;
  user_id: string;
  author_name: string;
  is_anonymous: boolean;
  content: string;
  link: string | null;
  likes: number;
  dislikes: number;
  hearts: number;
  created_at: string;
}

export interface DbReply {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  is_anonymous: boolean;
  content: string;
  created_at: string;
}

export function usePosts(courseId: string) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<DbPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        if (import.meta.env.DEV) console.error('Error fetching posts:', error);
      } else {
        setPosts((data as DbPost[]) || []);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, [courseId]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`posts-${courseId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'posts',
        filter: `course_id=eq.${courseId}`,
      }, (payload) => {
        setPosts((prev) => [payload.new as DbPost, ...prev]);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'posts',
        filter: `course_id=eq.${courseId}`,
      }, (payload) => {
        const updated = payload.new as DbPost;
        setPosts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'posts',
        filter: `course_id=eq.${courseId}`,
      }, (payload) => {
        setPosts((prev) => prev.filter((p) => p.id !== payload.old.id));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [courseId]);

  const createPost = async (content: string, isAnonymous: boolean, link?: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase.from('posts').insert({
      course_id: courseId,
      user_id: user.id,
      author_name: user.name.slice(0, 100),
      is_anonymous: isAnonymous,
      content: content.slice(0, 5000),
      link: link || null,
    });

    if (error && import.meta.env.DEV) console.error('Error creating post:', error);
    return { error };
  };

  return { posts, isLoading, createPost };
}

export function usePostDetail(postId: string) {
  const [post, setPost] = useState<DbPost | null>(null);
  const [replies, setReplies] = useState<DbReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [postRes, repliesRes] = await Promise.all([
        supabase.from('posts').select('*').eq('id', postId).single(),
        supabase.from('post_replies').select('*').eq('post_id', postId).order('created_at', { ascending: true }),
      ]);

      if (postRes.error) {
        if (import.meta.env.DEV) console.error('Error fetching post:', postRes.error);
      } else {
        setPost(postRes.data as DbPost);
      }

      if (repliesRes.error) {
        if (import.meta.env.DEV) console.error('Error fetching replies:', repliesRes.error);
      } else {
        setReplies((repliesRes.data as DbReply[]) || []);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [postId]);

  // Realtime for replies
  useEffect(() => {
    const channel = supabase
      .channel(`replies-${postId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'post_replies',
        filter: `post_id=eq.${postId}`,
      }, (payload) => {
        setReplies((prev) => [...prev, payload.new as DbReply]);
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'post_replies',
        filter: `post_id=eq.${postId}`,
      }, (payload) => {
        setReplies((prev) => prev.filter((r) => r.id !== payload.old.id));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [postId]);

  const addReply = async (content: string, isAnonymous: boolean) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase.from('post_replies').insert({
      post_id: postId,
      user_id: user.id,
      author_name: user.name.slice(0, 100),
      is_anonymous: isAnonymous,
      content: content.slice(0, 5000),
    });

    if (error && import.meta.env.DEV) console.error('Error adding reply:', error);
    return { error };
  };

  return { post, replies, isLoading, addReply };
}
