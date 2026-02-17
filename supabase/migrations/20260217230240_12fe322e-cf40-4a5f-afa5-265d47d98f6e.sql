
-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Users can view their own enrollments
CREATE POLICY "Users can view their own enrollments"
ON public.enrollments FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can enroll themselves
CREATE POLICY "Users can enroll themselves"
ON public.enrollments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can unenroll themselves
CREATE POLICY "Users can unenroll themselves"
ON public.enrollments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create a security definer function to check enrollment (avoids cross-table RLS issues)
CREATE OR REPLACE FUNCTION public.is_enrolled(_user_id UUID, _course_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE user_id = _user_id AND course_id = _course_id
  );
$$;

-- Update chat_messages SELECT policy to require enrollment
DROP POLICY IF EXISTS "Authenticated users can view chat messages" ON public.chat_messages;
CREATE POLICY "Enrolled users can view chat messages"
ON public.chat_messages FOR SELECT
TO authenticated
USING (public.is_enrolled(auth.uid(), course_id));

-- Update chat_messages INSERT policy to require enrollment
DROP POLICY IF EXISTS "Authenticated users can send chat messages" ON public.chat_messages;
CREATE POLICY "Enrolled users can send chat messages"
ON public.chat_messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND public.is_enrolled(auth.uid(), course_id));
