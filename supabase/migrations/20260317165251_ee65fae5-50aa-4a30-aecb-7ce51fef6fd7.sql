
-- Create course_notes table
CREATE TABLE public.course_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  author_name TEXT NOT NULL,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.course_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled users can view notes"
  ON public.course_notes FOR SELECT
  TO authenticated
  USING (is_enrolled(auth.uid(), course_id));

CREATE POLICY "Enrolled users can upload notes"
  ON public.course_notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND is_enrolled(auth.uid(), course_id));

CREATE POLICY "Users can delete their own notes"
  ON public.course_notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket for notes
INSERT INTO storage.buckets (id, name, public) VALUES ('course-notes', 'course-notes', true);

-- Storage policies
CREATE POLICY "Authenticated users can upload notes"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'course-notes');

CREATE POLICY "Anyone can view notes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-notes');

CREATE POLICY "Users can delete their own note files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'course-notes' AND auth.uid()::text = (storage.foldername(name))[1]);
