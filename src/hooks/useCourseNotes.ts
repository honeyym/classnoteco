import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CourseNote {
  id: string;
  course_id: string;
  user_id: string;
  author_name: string;
  title: string;
  file_name: string;
  file_path: string;
  file_size: number;
  created_at: string;
}

export function useCourseNotes(courseId: string) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<CourseNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const { data } = await supabase
      .from('course_notes')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });
    setNotes((data as CourseNote[]) || []);
    setIsLoading(false);
  }, [courseId, user]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const uploadNote = async (file: File, title: string) => {
    if (!user) return { error: 'Not authenticated' };

    const filePath = `${user.id}/${courseId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('course-notes')
      .upload(filePath, file);

    if (uploadError) return { error: uploadError.message };

    const { error: dbError } = await supabase
      .from('course_notes')
      .insert({
        course_id: courseId,
        user_id: user.id,
        author_name: user.name || user.email,
        title: title.trim(),
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
      });

    if (dbError) return { error: dbError.message };

    await fetchNotes();
    return { error: null };
  };

  const deleteNote = async (note: CourseNote) => {
    await supabase.storage.from('course-notes').remove([note.file_path]);
    await supabase.from('course_notes').delete().eq('id', note.id);
    await fetchNotes();
  };

  const getDownloadUrl = (filePath: string) => {
    const { data } = supabase.storage.from('course-notes').getPublicUrl(filePath);
    return data.publicUrl;
  };

  return { notes, isLoading, uploadNote, deleteNote, getDownloadUrl };
}
