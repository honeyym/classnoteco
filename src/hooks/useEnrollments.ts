import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useEnrollments() {
  const { user } = useAuth();
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setEnrolledCourseIds([]);
      setIsLoading(false);
      return;
    }

    const fetchEnrollments = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', user.id);

      if (error) {
        if (import.meta.env.DEV) console.error('Error fetching enrollments:', error);
      } else {
        setEnrolledCourseIds(data.map((e) => e.course_id));
      }
      setIsLoading(false);
    };

    fetchEnrollments();
  }, [user]);

  const enroll = async (courseId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('enrollments')
      .insert({ user_id: user.id, course_id: courseId });

    if (!error) {
      setEnrolledCourseIds((prev) => [...prev, courseId]);
    }
    return { error };
  };

  const unenroll = async (courseId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('user_id', user.id)
      .eq('course_id', courseId);

    if (!error) {
      setEnrolledCourseIds((prev) => prev.filter((id) => id !== courseId));
    }
    return { error };
  };

  const isEnrolled = (courseId: string) => enrolledCourseIds.includes(courseId);

  return { enrolledCourseIds, isLoading, enroll, unenroll, isEnrolled };
}
